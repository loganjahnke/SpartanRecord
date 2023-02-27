import { child, Database, DatabaseReference, DataSnapshot, get, limitToLast, orderByValue, Query, query, ref, set, update } from "firebase/database";
import { Debugger } from "../Objects/Helpers/Debugger";
import { Halo5Converter } from "../Objects/Helpers/Halo5Converter";
import { Converter } from "../Objects/Helpers/Statics/Converter";
import { SR } from "../Objects/Helpers/Statics/SR";
import { Appearance } from "../Objects/Model/Appearance";
import { CSRS } from "../Objects/Model/CSRS";
import { Leader, LeaderboardAverages } from "../Objects/Model/Leader";
import { Match } from "../Objects/Model/Match";
import { Player } from "../Objects/Model/Player";
import { PlayerMatch } from "../Objects/Model/PlayerMatch";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { SRFilter } from "../Objects/Pieces/SRFilter";
import { Leaderboard, ServiceRecordFilter } from "./ArrowheadFirebase";
import { AutocodeAppearance } from "./Schemas/AutocodeAppearance";
import { AutocodeCSRSData } from "./Schemas/AutocodeCSRS";
import { AutocodeMatch } from "./Schemas/AutocodeMatch";
import { AutocodeMultiplayerServiceRecord } from "./Schemas/AutocodeMultiplayerServiceRecord";
import { AutocodePlayerMatch } from "./Schemas/AutocodePlayerMatch";
import { FirebaseBest } from "./Schemas/FirebaseBest";

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
     * @param season the season
     * @param historic the historic SRs
     * @returns player object
     */
	public async GetPlayer(player: Player, season?: number, historic?: boolean): Promise<void>
	{
		if (!player.gamertag) { return; }
		
		let appearance;
		if (historic)
		{
			[player.serviceRecord, appearance, player.historicStats, player.csrs] = await Promise.all([
				this.GetServiceRecord(player.gamertag, season),
				this.GetAppearance(player.gamertag),
				this.GetAllSeasonsStats(player.gamertag),
				this.GetCSRS(player.gamertag, season)
			]);
		}
		else
		{
			[player.serviceRecord, appearance, player.csrs] = await Promise.all([
				this.GetServiceRecord(player.gamertag, season),
				this.GetAppearance(player.gamertag),
				this.GetCSRS(player.gamertag, season)
			]);
		}

		player.appearance = appearance ?? new Appearance();
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
		return new Appearance(snapshot.val());
	}
	//#endregion
	
	//#region Service Record
	/**
	 * Gets the service record for the gamertag from Firebase
	 * @param gamertag the gamertag to get the service record of
	 * @param season the season
	 * @returns the service record for the gamertag
	 */
	public async GetServiceRecord(gamertag: string, season?: number): Promise<ServiceRecord>
	{
		Debugger.Print("SCFirebase", "GetServiceRecord()", gamertag);

		let snapshot: DataSnapshot | undefined;
		if (!season || season === -1)
		{
			snapshot = await this.__get(`service_record/multiplayer/${gamertag}`);
		}
		else
		{
			snapshot = await this.__get(`service_record/season/${season}/${gamertag}`);
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
			return new ServiceRecord(snapshot.val());
		}
	}

	/**
	 * Gets all filtered service records for a gamertag
	 * @param gamertag the gamertag to get stats from
	 * @returns A big ole JSON object
	 */
	public async GetAllFilteredServiceRecordsInRawJSON(gamertag: string): Promise<any>
	{
		Debugger.Print("SCFirebase", "GetAllFilteredServiceRecordsInRawJSON()", `${gamertag}`);

		const snapshot = await this.__get(`service_record/filtered/${gamertag}`);
		if (snapshot)
		{
			return snapshot.val();
		}
	}

	/**
	 * A specific historic service record for a gamertag
	 * @param gamertag the gamertag to get the historic statistics of
	 * @returns the service record for the game
	 */
	public async GetHistoricStatisticsForGameNumber(gamertag: string, game: number): Promise<ServiceRecord>
	{
		Debugger.Print("SCFirebase", "GetHistoricStatisticsForGameNumber()", gamertag);
		const snapshot = await this.__get(`service_record/historic/${gamertag}/${game}`);
		if (!snapshot) { return new ServiceRecord(); }

		let autocodeSR: any = {
			data: {
				records: {
					pvp: snapshot.val()
				},
				privacy: {
					public: true
				},
			},
			additional: {
				polling: {
					synced_at: "",
				},
				parameters: {
					gamertag: "gamertag",
					filter: "matchmade"
				},
			}
		};

		return new ServiceRecord(autocodeSR);
	}

	/**
	 * Determines if the previous season's are cached for a given gamertag
	 * @param gamertag the gamertag to evaluate
	 * @returns true if we have these seasons saved in Firebase
	 */
	public async HasHistoricSeasonsCached(gamertag: string): Promise<boolean>
	{
		Debugger.Print("SCFirebase", "HasHistoricSeasonsCached()", gamertag);
		
		const snapshot = await this.__get(`service_record/historic/cached/${gamertag}`);
		if (!snapshot) { return false; }

		const result = snapshot.val();
		if (!result) { return false; }

		for (let i = 1; i < SR.Season; i++)
		{
			Debugger.Continue("Season " + i + ": " + result[i]);
			if (!result[i]) { return false; }
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
		for (const key in result)
		{
			const autocodeSR: any = { data: result[key] };
			historicSRs.push(new ServiceRecord(autocodeSR));
		}

		return historicSRs;
	}

	/**
	 * Gets the historic statistics for a gamertag
	 * @param gamertag the gamertag to get the historic statistics of
	 * @returns an array of service records
	 */
	public async GetHistoricStatistics(gamertag: string): Promise<ServiceRecord[]>
	{
		Debugger.Print("SCFirebase", "GetHistoricStatistics()", gamertag);

		let historicSRs: ServiceRecord[] = [];

		const snapshot = await this.__get(`service_record/historic/${gamertag}`);
		if (snapshot)
		{
			const result = snapshot.val();
			const keys = Object.keys(result);
			const numberOfMatches = +keys[keys.length - 1];
			for (const key in result)
			{
				if (+key < 50) { continue; }
				if (numberOfMatches > 3000 && +key % 150 !== 0) { continue; }
				else if (numberOfMatches > 2000 && +key % 100 !== 0) { continue; }
				else if (numberOfMatches > 1000 && +key % 50 !== 0) { continue; }
				let autocodeSR: any = {
					data: result[key]
				};

				historicSRs.push(new ServiceRecord(autocodeSR));
			}
		}

		return historicSRs;
	}

	/**
	 * Gets the service record for the gamertag for the date into Firebase
	 * @param gamertag the gamertag
	 * @param date the date string
	 */
	public async GetServiceRecordForDate(gamertag: string, date?: string): Promise<AutocodeMultiplayerServiceRecord | undefined>
	{
		if (!date) { return; }
		Debugger.Print("SCFirebase", "GetServiceRecordForDate()", gamertag);

		const snapshot = await this.__get(`service_record/date/${date}/${gamertag}`);
		if (snapshot && snapshot.exists()) { return snapshot.val(); }
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

		const snapshot = await this.__get(`service_record/multiplayer/${gamertag}/data/matches/total`);
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
		return new Match(snapshot.val());
	}

	/**
	 * Gets an array of recent matches for the given gamertag
	 * @param gamertag the gamertag to set the recent matches for
	 * @returns an array of recent matches
	 */
	public async GetRecentMatches(gamertag: string): Promise<PlayerMatch[]>
	{
		Debugger.Print("SCFirebase", "GetRecentMatches()", gamertag);
		
		const snapshot = await this.__get(`recent/${gamertag}`);
		if (!snapshot) { return []; }

		const data = snapshot.val();
		if (!data) { return []; }

		return data.map((match: any) => new PlayerMatch(match));
	}

	/**
	 * The current best (or worst) values for the gamer
	 * @param gamertag the gamertag
	 * @returns the best values object
	 */
	public async GetBestMatches(gamertag: string): Promise<FirebaseBest>
	{
		Debugger.Print("SCFirebase", "GetBestMatches()", gamertag);
		const result = await this.__get(`best/${gamertag}/all`);
		let best = result?.val();

		if (!best)
		{
			best = {
				match_ids: {
					best_kda: "",
					worst_kda: "",
					most_kills: "",
					most_deaths: "",
					most_assists: "",
					highest_kd_spread: "",
					worst_kd_spread: ""
				},
				values: {
					best_kda: undefined,
					worst_kda: undefined,
					most_kills: undefined,
					most_deaths: undefined,
					most_assists: undefined,
					highest_kd_spread: undefined,
					worst_kd_spread: undefined
				}
			}
		}
		return best;
	}

	/**
	 * The current best (or worst) values for the gamer
	 * @param gamertag the gamertag
	 * @param map the map name
	 * @returns the best values object
	 */
	public async GetBestMatchesForMap(gamertag: string, map: string): Promise<FirebaseBest>
	{
		Debugger.Print("SCFirebase", "GetBestMatchesForMap()", gamertag + " - " + map);
		const result = await this.__get(`best/${gamertag}/maps/${map}`);
		let best = result?.val();

		if (!best)
		{
			best = {
				match_ids: {
					best_kda: "",
					worst_kda: "",
					most_kills: "",
					most_deaths: "",
					most_assists: "",
					highest_kd_spread: "",
					worst_kd_spread: ""
				},
				values: {
					best_kda: undefined,
					worst_kda: undefined,
					most_kills: undefined,
					most_deaths: undefined,
					most_assists: undefined,
					highest_kd_spread: undefined,
					worst_kd_spread: undefined
				}
			}
		}
		return best;
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
		}

		return filters;
	}
	//#endregion

	//#region CSRS
	/**
	 * Gets the MMR of the gamertag
	 * @param gamertag the gamertag to get the MMR of
	 * @param season the season
	 * @returns the CSRS
	 */
	public async GetCSRS(gamertag: string, season?: number): Promise<CSRS[]>
	{
		Debugger.Print("SCFirebase", "GetCSRS()", gamertag);

		let snapshot: DataSnapshot | undefined;

		if (!season || season === -1) { snapshot = await this.__get(`csrs/${gamertag}/current`); }
		else { snapshot = await this.__get(`csrs/${gamertag}/season/${season}`); }

		const data = snapshot?.val();
		const csrs: CSRS[] = [];

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
	 * Sees if this gamertag is allowed to see filters
	 * @param gamertag the gamertag to check the permissions of
	 * @returns true if allowed to see filters
	 */
	public async GetIsPremiumUser(gamertag: string): Promise<boolean>
	{
		Debugger.Print("SCFirebase", "GetIsPremiumUser()", gamertag);

		const snapshot = await this.__get(`allowed/${gamertag}`);
		return snapshot?.val() ?? false;
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
	public async SetAppearance(gamertag: string, data?: AutocodeAppearance): Promise<void>
	{
		if (!data) { return; }
		Debugger.Print("SCFirebase", "SetAppearance()", gamertag);
		await this.__set(`appearance/${gamertag}`, data);
	}
	//#endregion

	//#region Service Record
	/**
	 * Sets the service record for the gamertag into Firebase
	 * @param gamertag the gamertag
	 * @param data the service record JSON
	 * @param season the season
	 */
	public async SetServiceRecord(gamertag: string, data?: AutocodeMultiplayerServiceRecord, season?: number): Promise<void>
	{
		if (!data) { return; }
		Debugger.Print("SCFirebase", "SetServiceRecord()", gamertag);

		if (!season || season === -1)
		{
			await this.__set(`service_record/multiplayer/${gamertag}`, data);
		}
		else
		{
			await this.SetPreviousSeasonStats(gamertag, season, data);
		}		
	}

	/**
	 * Gets a specific filtered service record for a gamertag
	 * @param gamertag the gamertag to get stats from
	 * @returns A service record that represents the filter
	 */
	public async SetFilteredServiceRecord(gamertag: string, tree: ServiceRecordFilter, data?: Map<string, AutocodeMultiplayerServiceRecord>): Promise<void>
	{
		if (!data) { return; }
		Debugger.Print("SCFirebase", "SetFilteredServiceRecord()", `${gamertag} - ${tree}`);
		await this.__update(`service_record/filtered/${gamertag}/${tree}`, Object.fromEntries(data));
	}

	/**
	 * Sets a previous season's statistics
	 * @param gamertag the gamertag to set the historic statistics for
	 * @param season the season we are saving
	 * @param sr the service record
	 */
	public async SetPreviousSeasonStats(gamertag: string, season: number, sr: AutocodeMultiplayerServiceRecord): Promise<void>
	{
		Debugger.Print("SCFirebase", "SetPreviousSeasonStats()", gamertag);

		await Promise.all([
			this.__set(`service_record/season/${season}/${gamertag}`, sr), 										  // set full SR into season node
			this.__set(`service_record/historic/season/${gamertag}/${season}`, Converter.AutocodeToSeasons(sr)),  // set abridged SR into historic season node
			this.__set(`service_record/historic/cached/${gamertag}/${season}`, season !== SR.Season),			  // set flag stating we have the historic season cached
		]);
	}

	/**
	 * Sets the service record for the gamertag for the date into Firebase
	 * @param gamertag the gamertag
	 * @param data the service record JSON
	 * @param date the date string
	 */
	public async SetServiceRecordForDate(gamertag: string, data?: AutocodeMultiplayerServiceRecord, date?: string): Promise<void>
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
	public async SetMatch(matchID: string, match: AutocodeMatch): Promise<void>
	{
		Debugger.Print("SCFirebase", "SetMatch()", matchID);
		await this.__update(`match/${matchID}`, match);
	}

	/**
	 * Sets an array of recent matches for the given gamertag
	 * @param gamertag the gamertag to set the recent matches for
	 * @param matches the array of Autocode player matches
	 */
	public async SetRecentMatches(gamertag: string, matches: AutocodePlayerMatch[]): Promise<void>
	{
		Debugger.Print("SCFirebase", "SetRecentMatches()", gamertag);
		const abridged = matches.map(match => Converter.PlayerMatchToRecentMatch(match));
		await this.__set(`recent/${gamertag}`, abridged);
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
	 * @param season the season
	 * @param data the data to save
	 */
	public async SetCSRS(gamertag: string, season?: number, data?: Partial<AutocodeCSRSData>[]): Promise<void>
	{
		if (!data) { return; }
		Debugger.Print("SCFirebase", "SetCSRS()", gamertag);
		
		if (!season || season === -1) { await this.__set(`csrs/${gamertag}/current`, data); }
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