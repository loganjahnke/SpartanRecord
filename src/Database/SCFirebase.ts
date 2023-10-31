import { child, Database, DatabaseReference, DataSnapshot, get, increment, limitToLast, orderByValue, Query, query, ref, serverTimestamp, set, update } from "firebase/database";
import { Debugger } from "../Objects/Helpers/Debugger";
import { Halo5Converter } from "../Objects/Helpers/Halo5Converter";
import { Converter } from "../Objects/Helpers/Statics/Converter";
import { Appearance } from "../Objects/Model/Appearance";
import { CSRS } from "../Objects/Model/CSRS";
import { Leader, LeaderboardAverages } from "../Objects/Model/Leader";
import { Match } from "../Objects/Model/Match";
import { Player } from "../Objects/Model/Player";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { SRFilter } from "../Objects/Pieces/SRFilter";
import { Leaderboard, ServiceRecordFilter } from "./ArrowheadFirebase";
import { AppearanceSchema } from "./Schemas/AppearanceSchema";
import { CSRDataSchema } from "./Schemas/CSRSchema";
import { ServiceRecordSchema } from "./Schemas/ServiceRecordSchema";
import { MatchSchema } from "./Schemas/MatchSchema";
import { HaloDotAPISeason } from "./Schemas/AutocodeMetadata";
import { CareerRankSchema, EmptyCareerRank } from "./Schemas/CareerRankSchema";
import { URLReducer } from "../Objects/Helpers/Statics/URLReducer";
import { VIP } from "../Objects/Model/VIP";

export class SCFirebase
{
	/** The firebase database */
	private __database: Database;

	constructor(database: Database) 
	{
		this.__database = database;
	}

	//#region Getters
	//#region Player
	/**
     * Gets a player from firebase
     * @param player the player object (needs gamertag populated)
     * @param season the season identifier
     * @param historic the historic SRs
     * @returns player object
     */
	public async GetPlayer(player: Player, season?: string, historic?: boolean): Promise<void>
	{
		if (!player.gamertag) { return; }
		
		let appearance, careerRank;
		if (historic)
		{
			[player.serviceRecord, appearance, player.historicStats, player.csrs, careerRank] = await Promise.all([
				this.GetServiceRecord(player.gamertag, season),
				this.GetAppearance(player.gamertag),
				this.GetAllSeasonsStats(player.gamertag),
				this.GetCSRS(player.gamertag, season),
				this.GetCareerRank(player.gamertag)
			]);
		}
		else
		{
			[player.serviceRecord, appearance, player.csrs, careerRank] = await Promise.all([
				this.GetServiceRecord(player.gamertag, season),
				this.GetAppearance(player.gamertag),
				this.GetCSRS(player.gamertag, season),
				this.GetCareerRank(player.gamertag)
			]);
		}

		player.appearance = appearance ?? new Appearance();
		player.careerRank = careerRank ?? EmptyCareerRank();
	}

	/**
     * Gets a player from firebase
     * @param player the player object (needs gamertag populated)
     * @returns player object
     */
	public async GetMinimumPlayerData(player: Player): Promise<void>
	{
		if (!player.gamertag) { return; }
		
		let appearance, careerRank;
		
		[player.serviceRecord, appearance] = await Promise.all([
			this.GetServiceRecord(player.gamertag),
			this.GetAppearance(player.gamertag)
		]);

		player.appearance = appearance ?? new Appearance();
		player.careerRank = careerRank ?? EmptyCareerRank();
	}
	//#endregion

	//#region Appearance
	/**
	 * Gets the appearance for a leader from Firebase
	 * @param leader the leader to get the appearance for
	 */
	public async GetAppearanceForLeader(leader: Leader): Promise<void>
	{
		if (!leader.gamertag) { return; }
		Debugger.Print("SCFirebase", "GetAppearanceForLeader()", leader.gamertag);
		leader.appearance = await this.GetAppearance(leader.gamertag) ?? new Appearance();
	}

	/**
	 * Gets the gamertag's appearance from Firebase
	 * @param gamertag the gamertag to get the appearance of
	 * @returns the appearance
	 */
	public async GetAppearance(gamertag: string): Promise<Appearance | null>
	{
		Debugger.Print("SCFirebase", "GetAppearance()", gamertag);

		const snapshot = await this.__get(`appearance/${gamertag}`);
		if (!snapshot || !snapshot.val()) { return null; }

		this.__setReadSize("GetAppearance", snapshot.val());

		return new Appearance(snapshot.val());
	}
	//#endregion

	//#region Career Rank
	/**
	 * Gets the career rank for the player object
	 * @param gamertag the gamertag
	 */
	public async GetCareerRank(gamertag: string): Promise<CareerRankSchema | null>
	{
		if (!gamertag) { return null; }

		Debugger.Print("SCFirebase", "GetCareerRank()", gamertag);

		const snapshot = await this.__get(`career_rank/${gamertag}`);
		if (!snapshot || !snapshot.val()) { return null; }

		this.__setReadSize("GetCareerRank", snapshot.val());

		const result = snapshot.val() as CareerRankSchema;

		// Expand URL size
		if (result?.data?.current?.image_urls?.icon) { result.data.current.image_urls.icon = URLReducer.ConstructURLForGruntAPI(result.data.current.image_urls.icon); }
		if (result?.data?.current?.image_urls?.adornment_icon) { result.data.current.image_urls.adornment_icon = URLReducer.ConstructURLForGruntAPI(result.data.current.image_urls.adornment_icon); }
		if (result?.data?.current?.image_urls?.large_icon) { result.data.current.image_urls.large_icon = URLReducer.ConstructURLForGruntAPI(result.data.current.image_urls.large_icon); }

		return result;
	}
	//#endregion
	
	//#region Service Record
	/**
	 * Gets the service record for the gamertag from Firebase
	 * @param gamertag the gamertag to get the service record of
	 * @param season the season identifier
	 * @returns the service record for the gamertag
	 */
	public async GetServiceRecord(gamertag: string, season?: string): Promise<ServiceRecord>
	{
		Debugger.Print("SCFirebase", "GetServiceRecord()", gamertag);

		let snapshot: DataSnapshot | undefined;
		if (!season)
		{
			snapshot = await this.__get(`service_record/multiplayer/${gamertag}`);
			if (snapshot) { this.__setReadSize("GetServiceRecord", snapshot.val()); }
		}

		return new ServiceRecord(snapshot?.val());
	}

	/**
	 * Gets a specific filtered service record for a gamertag
	 * @param gamertag the gamertag to get stats from
	 * @returns A service record that represents the filter
	 */
	public async GetFilteredServiceRecord(gamertag: string, tree: ServiceRecordFilter, filter: string): Promise<ServiceRecord | undefined>
	{
		Debugger.Print("SCFirebase", "GetFilteredServiceRecord()", `${gamertag} - ${filter}`);

		const node = tree === ServiceRecordFilter.Maps ? "map" : tree === ServiceRecordFilter.Modes ? "mode" : "outcome";
		const snapshot = await this.__get(`service_record/filtered/${gamertag}/${node}/${filter}`);
		if (snapshot)
		{
			this.__setReadSize("GetFilteredServiceRecord", snapshot.val());
			return new ServiceRecord(snapshot.val());
		}
	}

	/**
	 * Determines if the previous season's are cached for a given gamertag
	 * @param gamertag the gamertag to evaluate
	 * @param seasons the available seasons
	 * @returns true if we have these seasons saved in Firebase
	 */
	public async HasHistoricSeasonsCached(gamertag: string, seasons: HaloDotAPISeason[]): Promise<boolean>
	{
		Debugger.Print("SCFirebase", "HasHistoricSeasonsCached()", gamertag);
		
		if (!seasons || seasons.length === 0) { return false; }

		const snapshot = await this.__get(`service_record/historic/cached/${gamertag}`);
		if (!snapshot) { return false; }

		const result = snapshot.val();
		if (!result) { return false; }

		this.__setReadSize("HasHistoricSeasonsCached", result);

		const currSeason = seasons[seasons.length - 1];
		for (const season of seasons)
		{
			if (season.properties.identifier === currSeason.properties.identifier) { continue; }
			Debugger.Continue(season.properties.identifier + ": " + result[season.properties.identifier]);
			if (!result[season.properties.identifier]) { return false; }
		}

		return true;
	}

	/**
	 * Gets the historical season statistics for a gamertag
	 * @param gamertag the gamertag to get the historic statistics of
	 * @returns an array of service records
	 */
	public async GetAllSeasonsStats(gamertag: string): Promise<ServiceRecord[]>
	{
		Debugger.Print("SCFirebase", "GetAllSeasonsStats()", gamertag);

		const historicSRs: ServiceRecord[] = [];

		const snapshot = await this.__get(`service_record/historic/season/${gamertag}`);
		if (!snapshot) { return [new ServiceRecord(), new ServiceRecord(), new ServiceRecord()]; } // 3 empties for 3 seasons
		
		const result = snapshot.val();
		this.__setReadSize("GetAllSeasonsStats", result);

		for (const key in result)
		{
			const autocodeSR: any = { data: result[key] };
			autocodeSR.data.time_played = "";
			historicSRs.push(new ServiceRecord(autocodeSR, key));
		}

		return historicSRs;
	}
	//#endregion
	
	//#region Matches Played
	/**
	 * Gets the number of matches played for a leader
	 * @param gamertag the leader to get the number of matches played for
	 */
	public async GetMatchesPlayed(gamertag: string): Promise<number>
	{
		if (!gamertag) { return 0; }

		const snapshot = await this.__get(`service_record/multiplayer/${gamertag}/data/matches/completed`);
		if (!snapshot || !snapshot.exists()) { return 0; }

		return snapshot.val() as number;
	}
	//#endregion

	//#region Matches
	/**
	 * Gets a full match from firebase
	 * @param matchID the match ID
	 * @returns the match
	 */
	public async GetMatch(matchID: string): Promise<Match | undefined>
	{
		Debugger.Print("SCFirebase", "GetMatch()", matchID);

		const snapshot = await this.__get(`match/${matchID}`);
		if (!snapshot) { return undefined; }
		this.__setReadSize("GetMatch", snapshot.val());
		return new Match(snapshot.val());
	}

	/**
	 * Determines if a match is stored in Firebase
	 * @param matchID the match ID
	 * @returns true if it is in Firebase
	 */
	public async GetMatchIsStored(matchID: string): Promise<boolean>
	{
		Debugger.Print("SCFirebase", "GetMatchIsStored()", matchID);

		const snapshot = await this.__get(`match/${matchID}/success`);
		if (!snapshot) { return false; }
		this.__setReadSize("GetMatchIsStored", snapshot.val());
		return snapshot.val();
	}
	//#endregion

	//#region Filters
	/**
	 * Gets a specific filtered service record for a gamertag
	 * @param gamertag the gamertag to get stats from
	 * @returns A service record that represents the filter
	 */
	public async GetAvailableFilters(gamertag: string, node: ServiceRecordFilter): Promise<SRFilter[]>
	{
		if (!gamertag) { return []; }

		Debugger.Print("SCFirebase", "GetAvailableFilters()", `${gamertag} - ${node}`);

		const n = node === ServiceRecordFilter.Maps ? "map" : node === ServiceRecordFilter.Modes ? "mode" : "outcome";
		const filters: SRFilter[] = [];
		const snapshot = await this.__get(`filters/${gamertag}/${n}`);
		if (snapshot)
		{
			for (const name in snapshot.val())
			{
				const count = snapshot.val()[name];
				filters.push(new SRFilter(name, name, count ?? 0));
			}
			
			this.__setReadSize("GetAvailableFilters", snapshot.val());
		}

		return filters;
	}
	//#endregion

	//#region CSRS
	/**
	 * Gets the MMR of the gamertag
	 * @param gamertag the gamertag to get the MMR of
	 * @param season the season identifier
	 * @returns the CSRS
	 */
	public async GetCSRS(gamertag: string, season?: string): Promise<CSRS[]>
	{
		if (!gamertag) { return []; }

		Debugger.Print("SCFirebase", "GetCSRS()", gamertag);

		let snapshot: DataSnapshot | undefined;

		if (!season) { snapshot = await this.__get(`csrs/${gamertag}/current`); }
		else { snapshot = await this.__get(`csrs/${gamertag}/season/${season}`); }

		const data = snapshot?.val();
		const csrs: CSRS[] = [];

		this.__setReadSize("GetCSRS", data);

		if (data && data.length > 0)
		{
			for (const iter of data) { csrs.push(new CSRS(iter)); }
		}

		return csrs;
	}
	//#endregion
	
	//#region Leaderboard
	/**
	 * Gets a leaderboard for a certain category
	 * @param leaderboard the leaderboard to get
	 * @returns the player's with the highest values in the leaderboard
	 */
	public async GetLeaderboard(leaderboard: Leaderboard): Promise<Leader[]>
	{
		// Prepare queries
		const sort = this.__querySort(`leaderboard/${leaderboard}`);
		const limit = this.__queryLimit(sort, 25);

		// Get query
		const snapshot = await get(limit);
		if (!snapshot || !snapshot.exists()) { return []; }

		this.__setReadSize("GetLeaderboard", snapshot.val());

		// Put the results into an array of leaders
		const leaders: Leader[] = [];
		snapshot.forEach(child => 
		{
			if (!child.exists()) { return; }
			leaders.push(new Leader(child.key!, undefined, child.val() as number));
		});

		// Reverse to get descending order since firebase is dumb
		leaders.reverse();

		// Get appearance for all leaders
		await Promise.all(leaders.map((leader => this.GetLeaderProperties(leader))));

		return leaders;
	}

	/**
	 * Gets a leader for a certain category and gamertag
	 * @param leaderboard the leaderboard to get
	 * @param gamertag the gamertag
	 * @returns the leader for the player
	 */
	public async GetLeader(leaderboard: Leaderboard, gamertag: string): Promise<Leader>
	{
		if (!gamertag) { return new Leader(); }

		// Get leader
		const [value, matchesPlayed] = await Promise.all([
			this.__get(`leaderboard/${leaderboard}/${gamertag}`),
			this.GetMatchesPlayed(gamertag)
		]);

		return new Leader(gamertag, undefined, +(value?.val() ?? 0), +(matchesPlayed ?? 0));
	}

	/**
	 * Gets leaderboard averages for a certain category
	 * @param leaderboard the leaderboard to get averages for
	 * @returns the leaderboard averages
	 */
	public async GetLeaderboardAverages(leaderboard: Leaderboard): Promise<LeaderboardAverages>
	{
		Debugger.Print("SCFirebase", "GetLeaderboardAverages()", leaderboard);

		// Prepare queries
		const snapshot = await this.__get(`averages/${leaderboard}`);
		if (!snapshot || !snapshot.exists()) { return new LeaderboardAverages(); }

		this.__setReadSize("GetLeaderboard", snapshot.val());

		return new LeaderboardAverages(snapshot.val());
	}

	/**
	 * Gets the appearance for a leader from Firebase
	 * @param leader the leader to get the appearance for
	 */
	public async GetLeaderProperties(leader: Leader): Promise<void>
	{
		if (!leader.gamertag) { return; }
		Debugger.Print("SCFirebase", "GetLeaderProperties()", leader.gamertag);

		let appearance;

		[appearance, leader.matchesPlayed] = await Promise.all([
			this.GetAppearance(leader.gamertag),
			this.GetMatchesPlayed(leader.gamertag)
		]);

		leader.appearance = appearance ?? new Appearance();
	}
	//#endregion
	
	//#region User
	/**
	 * Sees if this gamertag is subscribed to the Patreon
	 * @param gamertag the gamertag to check the permissions of
	 * @returns true if is subscribed to the Patreon
	 */
	public async GetIsAdFree(gamertag: string): Promise<boolean>
	{
		if (!gamertag) { return false; }

		Debugger.Print("SCFirebase", "GetIsAdFree()", gamertag);

		const snapshot = await this.__get(`ad_free/${gamertag}`);
		if (snapshot) { this.__setReadSize("GetIsAdFree", snapshot.val()); }
		return snapshot?.val() ?? false;
	}

	/**
	 * Gets all VIPs (thanks kings)
	 * @returns an array of VIPs
	 */
	public async GetAllVIPs(): Promise<VIP[]>
    {
		Debugger.Print("SCFirebase", "GetAllVIPs()");

		const snapshot = await this.__get(`VIP`);
		if (!snapshot) { return []; }
		
		const VIPs = [];
		for (const gamertag in snapshot.val())
		{
			const appearance = await this.GetAppearance(gamertag) ?? new Appearance();
			VIPs.push(new VIP(gamertag, appearance));
		}

        return VIPs;
    }
	//#endregion
	
	//#region Gamertag
	/**
	 * Gets the reference to the right gamertag from the input
	 * @param input the inputted gamertag
     * @returns the real gamertag
	 */
	public async GetGamertag(input: string): Promise<string>
	{
		Debugger.Print("SCFirebase", "GetGamertag()", `${input}`);
		const snapshot = await this.__get(`gamertag/${input}`);
		if (!snapshot || !snapshot.val()) { return input; }
		if (snapshot) { this.__setReadSize("GetGamertag", snapshot.val()); }
		return snapshot.val();
	}
	//#endregion
	//#endregion

	//#region Setters
	//#region Appearance
	/**
	 * Sets the appearance for the gamertag into Firebase
	 * @param gamertag the gamertag
	 * @param data the appearance JSON
	 */
	public async SetAppearance(gamertag: string, data?: AppearanceSchema): Promise<void>
	{
		if (!data) { return; }
		Debugger.Print("SCFirebase", "SetAppearance()", gamertag);
		await this.__set(`appearance/${gamertag}`, Converter.ReducedAutocodeAppearance(data));
	}
	//#endregion

	//#region Career Rank
	/**
	 * Gets the career rank for the player object
	 * @param gamertag the gamertag
	 */
	public async SetCareerRank(gamertag: string, data?: CareerRankSchema): Promise<void>
	{
		if (!data || !data.data?.current || data.data.current.rank === 0) { return; }
		Debugger.Print("SCFirebase", "SetCareerRank()", gamertag);

		// Delete some unused things to save on space
		const dataToSet = data as any;

		if (dataToSet?.additional) { delete dataToSet.additional; }
		if (dataToSet?.data?.current?.attributes?.colors) { delete dataToSet.data.current.attributes.colors; }
		if (dataToSet?.data?.next?.attributes?.colors) { delete dataToSet.data.next.attributes.colors; }
		if (dataToSet?.data?.next?.image_urls) { delete dataToSet.data.next.image_urls; }

		// Reduce URL size
		if (dataToSet?.data?.current?.image_urls?.icon) { dataToSet.data.current.image_urls.icon = URLReducer.ReduceURLFromGruntAPI(dataToSet.data.current.image_urls.icon); }
		if (dataToSet?.data?.current?.image_urls?.adornment_icon) { dataToSet.data.current.image_urls.adornment_icon = URLReducer.ReduceURLFromGruntAPI(dataToSet.data.current.image_urls.adornment_icon); }
		if (dataToSet?.data?.current?.image_urls?.large_icon) { dataToSet.data.current.image_urls.large_icon = URLReducer.ReduceURLFromGruntAPI(dataToSet.data.current.image_urls.large_icon); }

		await this.__set(`career_rank/${gamertag}`, dataToSet);
	}
	//#endregion

	//#region Service Record
	/**
	 * Sets the service record for the gamertag into Firebase
	 * @param gamertag the gamertag
	 * @param data the service record JSON
	 * @param season the season identifier
	 * @param currSeason the current season identifier
	 */
	public async SetServiceRecord(gamertag: string, data?: ServiceRecordSchema, season?: string, currSeason?: string): Promise<void>
	{
		if (!data) { return; }
		Debugger.Print("SCFirebase", "SetServiceRecord()", gamertag);

		if (!season)
		{
			await this.__set(`service_record/multiplayer/${gamertag}`, data);
		}
		else if (currSeason)
		{
			await this.SetPreviousSeasonStats(gamertag, season, currSeason, data);
		}		
	}

	/**
	 * Gets a specific filtered service record for a gamertag
	 * @param gamertag the gamertag to get stats from
	 * @returns A service record that represents the filter
	 */
	public async SetFilteredServiceRecord(gamertag: string, tree: ServiceRecordFilter, data?: Map<string, ServiceRecordSchema>): Promise<void>
	{
		if (!data) { return; }
		Debugger.Print("SCFirebase", "SetFilteredServiceRecord()", `${gamertag} - ${tree}`);
		await this.__update(`service_record/filtered/${gamertag}/${tree}`, Object.fromEntries(data));
	}

	/**
	 * Sets a previous season's statistics
	 * @param gamertag the gamertag to set the historic statistics for
	 * @param season the season identifier we are saving
	 * @param currSeason the current season identifier
	 * @param sr the service record
	 */
	public async SetPreviousSeasonStats(gamertag: string, season: string, currSeason: string, sr: ServiceRecordSchema): Promise<void>
	{
		Debugger.Print("SCFirebase", "SetPreviousSeasonStats()", gamertag);

		await Promise.all([
			this.__set(`service_record/historic/season/${gamertag}/${season}`, Converter.AutocodeToSeasons(sr)),  // set abridged SR into historic season node
			this.__set(`service_record/historic/cached/${gamertag}/${season}`, season !== currSeason),            // set flag stating we have the historic season cached
		]);
	}

	/**
	 * Sets the service record for the gamertag for the date into Firebase
	 * @param gamertag the gamertag
	 * @param data the service record JSON
	 * @param date the date string
	 */
	public async SetServiceRecordForDate(gamertag: string, data?: ServiceRecordSchema, date?: string): Promise<void>
	{
		if (!data || !date) { return; }
		Debugger.Print("SCFirebase", "SetServiceRecordForDate()", gamertag);

		await this.__set(`service_record/date/${date}/${gamertag}`, data);		
	}
	//#endregion
	
	//#region Matches
	/**
	 * Sets a full match into firebase
	 * @param matchID the match ID
	 * @returns the match
	 */
	public async SetMatch(matchID: string, match: MatchSchema): Promise<void>
	{
		Debugger.Print("SCFirebase", "SetMatch()", matchID);
		await this.__update(`match/${matchID}`, match);
	}
	//#endregion

	//#region Filters
	/**
	 * Sets the fiters node for a gamertag to easily get the available maps and modes
	 * @param gamertag the gamertag
	 * @param tree the filter tree
	 * @param data the data
	 */
	public async SetAvailableFilters(gamertag: string, tree: ServiceRecordFilter, data?: Map<string, boolean>): Promise<void>
	{
		if (!data) { return; }
		Debugger.Print("SCFirebase", "SetFiltersForGamertag()", `${gamertag} - ${tree}`);
		await this.__update(`filters/${gamertag}/${tree}`, Object.fromEntries(data));
	}
	//#endregion

	//#region CSRS
	/**
	 * Sets the MMR for the gamertag into Firebase
	 * @param gamertag the gamertag
	 * @param season the CSR season identifier
	 * @param data the data to save
	 */
	public async SetCSRS(gamertag: string, season?: string, data?: Partial<CSRDataSchema>[]): Promise<void>
	{
		if (!data) { return; }
		Debugger.Print("SCFirebase", "SetCSRS()", gamertag);
		
		if (!season) { await this.__set(`csrs/${gamertag}/current`, data); }
		else { await this.__set(`csrs/${gamertag}/season/${season}`, data); }
	}
	//#endregion

	//#region Leaderboard
	/**
	 * Updates all leaderboards
	 * @param player the player
	 */
	public async UpdateLeaderboard(player: Player): Promise<void>
	{
		// Must have more than 100 games played to be on leaderboard
		if (!player || !player.gamertag || !player.serviceRecord || player.serviceRecord.matchesPlayed < 100) { return; }

		await Promise.all([
			await this.__set(`leaderboard/kda/${player.gamertag}`, player.serviceRecord.kda),
			await this.__set(`leaderboard/kdr/${player.gamertag}`, player.serviceRecord.kdr),
			await this.__set(`leaderboard/kills/${player.gamertag}`, player.serviceRecord.summary.kills),
			await this.__set(`leaderboard/deaths/${player.gamertag}`, player.serviceRecord.summary.deaths),
			await this.__set(`leaderboard/assists/${player.gamertag}`, player.serviceRecord.summary.assists),
			await this.__set(`leaderboard/kills_per_game/${player.gamertag}`, player.serviceRecord.killsPerGame),
			await this.__set(`leaderboard/deaths_per_game/${player.gamertag}`, player.serviceRecord.deathsPerGame),
			await this.__set(`leaderboard/assists_per_game/${player.gamertag}`, player.serviceRecord.assistsPerGame),
			await this.__set(`leaderboard/callouts/${player.gamertag}`, player.serviceRecord.breakdowns.assists.callouts),
			await this.__set(`leaderboard/damage/${player.gamertag}`, player.serviceRecord.damage.dealt),
			await this.__set(`leaderboard/accuracy/${player.gamertag}`, player.serviceRecord.shots.accuracy),
			await this.__set(`leaderboard/spartan_rank/${player.gamertag}`, Halo5Converter.GetNumericLevelFromScore(player.serviceRecord.totalScore)),
			await this.__set(`leaderboard/csr/open_crossplay/${player.gamertag}`, player.GetOpenCrossplay().ranks.current.value),
			await this.__set(`leaderboard/csr/mnk_soloduo/${player.gamertag}`, player.GetMnKSoloDuo().ranks.current.value),
			await this.__set(`leaderboard/csr/controller_soloduo/${player.gamertag}`, player.GetControllerSoloDuo().ranks.current.value),
		]);
	}
	//#endregion
	
	//#region Gamertag
	/**
	 * Sets the reference to the right gamertag from the wrong one
	 * @param correct the correct gamertag
     * @param incorrect the incorrect gamertag
	 */
	public async SetGamertagPointer(correct: string, incorrect: string): Promise<void>
	{
		if (correct === incorrect) { return; }
		Debugger.Print("SCFirebase", "SetGamertagPointer()", `${incorrect} -> ${correct}`);

		await this.__set(`gamertag/${incorrect}`, correct);	
	}
	//#endregion
	
	//#region Get Cost Investigation
	/**
	 * Sets the read size into Firebase for investigation
	 * @param method the method doing the read
	 * @param data the data being read
	 */
	private async __setReadSize(method: string, data: any): Promise<void>
	{
		const size = Debugger.Size(data);

		let bucket = "";

		if (size.bytes < 1024) { bucket = "Under 1KB"; }
		else if (size.bytes < 5120) { bucket = "Under 5KB"; }
		else if (size.bytes < 10240) { bucket = "Under 10KB"; }
		else if (size.bytes < 51200) { bucket = "Under 50KB"; }
        else if (size.bytes < 102400) {bucket = "Under 100KB"; }
		else if (size.bytes < 1048576) { bucket = "Under 1MB"; }
        else { bucket = "Bigger than 1MB" }

		// Get line count
		const lines = await this.__get(`debug/${method}/details/0`);
		
		let totalLines = 0;
		if (lines && lines.val()) { totalLines = lines.val(); }
		
		totalLines += 1;

		// Get bucket count
		const bucketCount = await this.__get(`debug/${method}/summary/${bucket}`);
		
		let totalBucketCount = 0;
		if (bucketCount && bucketCount.val()) { totalBucketCount = bucketCount.val(); }

		// Set size and update line count
		await Promise.all([
			this.__set(`debug/${method}/summary/${bucket}`, totalBucketCount + 1),
			this.__set(`debug/${method}/details/${Math.max(totalLines % 100, 1)}`, size.formatted),
			this.__set(`debug/${method}/details/0`, totalLines)
		]);
	} 
	//#endregion
	//#endregion

	//#region API Usage
	/**
	 * Gets the current API usage
	 */
	public async SetVersion(): Promise<void>
	{		
		let version = process.env.REACT_APP_VERSION;
		if (!version) { return; }

		version = version.replaceAll(".", "-");
		if (!version) { return; }

		const timestamp = serverTimestamp() as any;
		const date = timestamp && timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date();

		const updates: any = {};
		updates[`version/${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}/${version}`] = increment(1);

		update(ref(this.__database), updates);
	}

	/**
	 * Gets the current API usage
	 */
	public async CurrentAPIUsage(): Promise<number>
	{
		const timestamp = serverTimestamp() as any;
		const date = timestamp && timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date();

		const snapshot = await this.__get(`api/${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCHours()}`);
		return snapshot?.val() ?? -1;
	}

	/**
	 * Increments the API usage counter by the count
	 * @param count the count to increment
	 */
	public async CountAPIUsage(count: number): Promise<void>
	{		
		if (count === 0) { return; }

		const timestamp = serverTimestamp() as any;
		const date = timestamp && timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date();

		const updates: any = {};
		updates[`api/${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCHours()}`] = increment(count);

		update(ref(this.__database), updates);
	}
	//#endregion

	//#region Helpers
	/**
	 * Creates a child database reference
	 * @param path the path
	 * @returns the database reference
	 */
	private __child = (path: string): DatabaseReference => child(ref(this.__database), path);

	/**
	 * Gets the snapshot given the path
	 * @param path the path to get
	 * @returns the data snapshot unless there is none
	 */
	private async __get(path: string): Promise<DataSnapshot | undefined>
	{
		const snapshot = await get(this.__child(path));
		if (snapshot?.exists()) 
		{ 
			return snapshot; 
		}
	}

	/**
	 * Sets the value for the path
	 * @param path the path
	 * @param value the value
	 */
	private __set = async (path: string, value: any): Promise<void> => await set(this.__child(path), value);

	/**
	 * Updates the value for the path
	 * @param path the path
	 * @param value the value
	 */
	private __update = async (path: string, value: any): Promise<void> => await update(this.__child(path), value);

	/**
	 * Query sort by value
	 * @param path the path
	 */
	private __querySort = (path: string): Query => query(ref(this.__database, path), orderByValue());

	/**
	 * Query limit by value
	 * @param additonalQuery the first query
	 * @param limit the number to limit to
	 */
	private __queryLimit = (additonalQuery: Query, limit: number): Query => query(additonalQuery, limitToLast(limit));
	//#endregion
}
