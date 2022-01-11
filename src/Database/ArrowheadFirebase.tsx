import { Database, ref, get, child, update } from "firebase/database";
import { Timestamp } from "firebase/firestore";
import { Appearance } from "../Objects/Model/Appearance";
import { Debugger } from "../Objects/Helpers/Debugger";
import { Player } from "../Objects/Model/Player";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { Match } from "../Objects/Model/Match";

export enum HaloMap
{
	Aquarius = "Aquarius",
	Bazaar = "Bazaar",
	Behemoth = "Behemoth",
	Deadlock = "Deadlock",
	Fragmentation = "Fragmentation",
	Highpower = "Highpower",
	LaunchSite = "Launch Site",
	LiveFire = "Live Fire",
	Recharge = "Recharge",
	Streets = "Streets"
}

export enum HaloMode
{
	CTF = "CTF",
	FFASlayer = "FFA Slayer",
	Fiesta = "Fiesta",
	Oddball = "Oddball",
	Slayer = "Slayer",
	Stockpile = "Stockpile",
	Strongholds = "Strongholds",
	TacticalSlayer = "Tactical Slayer",
	TotalControl = "Total Control"
}

export enum HaloRanked
{
	Yes = "true",
	No = "false"
}

export enum HaloOutcome
{
	Win = "win",
	Loss = "loss",
	Draw = "draw",
	Left = "left"
}

export enum ServiceRecordFilter
{
	Map = "map",
	Mode = "mode",
	IsRanked = "isRanked",
	Outcome = "outcome"
}

export class ArrowheadFirebase
{
	/** Turns on or off debugging mode */
	private readonly IS_DEBUGGING = process.env.NODE_ENV !== "production";

	/** The last time the Halo API was used */
	public lastUpdate: Date | null = null;
	/** An array of all Arrowhead members */
	public members: string[] = [];

	/** The firebase database */
	private __database: Database;
	/** All players, locally stored */
	private __allPlayers: Map<string, Player> = new Map<string, Player>();
	/** All matches with details for just the player, locally stored */
	private __allMatchesForGamertag: Map<string, Match> = new Map<string, Match>();
	/** All matches with all details, locally stored */
	private __allMatches: Map<string, Match> = new Map<string, Match>();

	constructor(database: Database)
	{
		this.__database = database;
	}

	//#region Members
	/**
	 * Populates the members field
	 */
	public async PopulateMembers(): Promise<boolean>
	{
		if (this.members && this.members.length > 0) { return true; }
		const membersSnapshot = await get(child(ref(this.__database), "members"));
		if (membersSnapshot?.exists())
		{
			this.members = Object.keys(membersSnapshot.val());
			return true;
		}

		return false;
	}
	//#endregion

	//#region Player
	/**
	 * Gets the entire player from firebase or locally if available
	 * @param gamertag the gamertag to get
	 * @param getHistoricSR should we load all historical service records for the player?
	 * @param matchesToGet the number of matches to get starting from the latest match
	 * @returns the player object containing all stats and appearance
	 */
	public async GetPlayer(gamertag: string, getHistoricSR: boolean = false, matchesToGet: number = 0): Promise<Player>
	{
		const serviceRecord = await this.GetCurrentServiceRecord(gamertag);
		const historicServiceRecords = getHistoricSR ? await this.GetHistoricServiceRecord(gamertag) : [];
		const appearance = await this.GetAppearance(gamertag);
		const matches = await this.GetMatches(gamertag, matchesToGet, 0);
		
		return new Player(gamertag, serviceRecord, historicServiceRecords, appearance, matches);
	}
	//#endregion

	//#region Data Stale Checks
	/**
	 * Gets the date and time the last time we used the Halo API
	 * @returns nothing, sets CurrentPull and LastUpdate
	 */
	public async GetLastUpdate(): Promise<void>
	{
		if (!this.__database) { return; }

		const queryFactsSnapshot = await get(child(ref(this.__database), "query_facts"));
		if (queryFactsSnapshot?.exists())
		{
			const result = queryFactsSnapshot.val();

			if (result.last_update)
			{
				const lastUpdateTimestamp = new Timestamp(result.last_update._seconds, result.last_update._nanoseconds);
				this.lastUpdate = lastUpdateTimestamp.toDate();
			}
		}

		if (this.IS_DEBUGGING) { Debugger.Print(false, "GetLastUpdate()", undefined, this); }
	}
	//#endregion

	//#region Player Appearence 
	/**
	 * Gets the appearance for a gamertag, checks locally before querying Firebase
	 * @param gamertag the gamertag to get stats from
	 * @returns The current appearance for the gamertag
	 */
	public async GetAppearance(gamertag: string): Promise<Appearance | undefined>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "GetAppearance()", gamertag); }
		
		// Check locally
		let player = this.__allPlayers.get(gamertag);
		if (player?.appearance?.emblemURL) 
		{ 
			if (this.IS_DEBUGGING) { Debugger.Continue("Locally"); }
			return player.appearance; 
		}

		// Otherwise get from Firebase
		const reference = `appearance/${gamertag}`;
		const gamertagSnapshot = await get(child(ref(this.__database), reference));
		if (gamertagSnapshot?.exists())
		{
			if (this.IS_DEBUGGING) { Debugger.Continue("Firebase"); }
			const result = gamertagSnapshot.val();
			const appearance = new Appearance(result);

			// Store locally
			this.__storeAppearanceLocally(gamertag, appearance);
			return appearance;
		}

		return undefined;
	}

	 /**
	 * Stores the service record into the AllUserStatistics map if it's not already in there
	 * @param serviceRecord The service record to push in
	 * @param pull The pull to push in
	 */
	private __storeAppearanceLocally(gamertag: string, appearance: Appearance): void
	{
		const player = this.__allPlayers.get(gamertag) ?? new Player(gamertag);
		player.appearance = appearance;
		this.__allPlayers.set(gamertag, player);
	}
	//#endregion

	//#region Service Record
	/**
	 * Gets the service record for a gamertag, checks locally before going to Firebase
	 * @param gamertag the gamertag to get stats from
	 * @returns The current service record for the gamertag
	 */
	public async GetCurrentServiceRecord(gamertag: string): Promise<ServiceRecord | undefined>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "GetCurrentServiceRecord()", gamertag); }

		// Try locally
		let sr = this.__getCurrentStatsForGamertagLocally(gamertag);
		if (sr && sr.matchesPlayed > 0)
		{
			if (this.IS_DEBUGGING) { Debugger.Continue("Locally"); }
			return sr;
		}

		// Otherwise go to Firebase
		const reference = `service_record/current/${gamertag}`;
		const gamertagSnapshot = await get(child(ref(this.__database), reference));
		if (gamertagSnapshot?.exists())
		{
			if (this.IS_DEBUGGING) { Debugger.Continue("Firebase"); }
			const result = gamertagSnapshot.val();
			const serviceRecord = new ServiceRecord(result);

			// Store locally for current pull
			this.__storeCurrentServiceRecordLocally(gamertag, serviceRecord);
			return serviceRecord;
		}

		return undefined;
	}

	/**
	 * Gets the entire history of service records for a gamertag, tries locally before going to Firebase
	 * @param gamertag the gamertag to get stats from
	 * @returns An array of service record JSONs
	 */
	public async GetHistoricServiceRecord(gamertag: string): Promise<ServiceRecord[] | undefined>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "GetHistoricServiceRecord()", gamertag); }

		// First locally
		let historicSRs = this.__getAllHistoricStatsLocally(gamertag);
		if (historicSRs)
		{
			if (this.IS_DEBUGGING) { Debugger.Continue("Locally"); }
			return historicSRs;
		}

		// Otherwise go to Firebase
		const reference = `service_record/historic/${gamertag}`;
		const gamertagSnapshot = await get(child(ref(this.__database), reference));
		if (gamertagSnapshot?.exists())
		{
			if (this.IS_DEBUGGING) { Debugger.Continue("Firebase"); }
			const result = gamertagSnapshot.val();
			historicSRs = [];

			for (const key in result)
			{
				if (key === "25") { continue; }
				historicSRs.push(new ServiceRecord(result[key]));
			}

			this.__storeHistoricServiceRecordsLocally(gamertag, historicSRs);
		}

		return historicSRs;
	}

	/**
	 * Gets the entire history of service records for a gamertag, tries locally before going to Firebase
	 * @param gamertag the gamertag to get stats from
	 * @returns An array of service record JSONs
	 */
	public async GetServiceRecordForFilter(gamertag: string, tree: ServiceRecordFilter, filter: HaloMap | HaloMode | HaloRanked | HaloOutcome): Promise<ServiceRecord | undefined>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "GetServiceRecordForFilter()", `${gamertag} - ${filter}`); }

		// First locally
		let filteredSR = this.__getFilteredServiceRecordLocally(gamertag, tree, filter);
		if (filteredSR)
		{
			if (this.IS_DEBUGGING) { Debugger.Continue("Locally"); }
			return filteredSR;
		}

		// Otherwise go to Firebase
		const reference = `service_record/filtered/${gamertag}/${tree}/${filter}`;
		const gamertagSnapshot = await get(child(ref(this.__database), reference));
		if (gamertagSnapshot?.exists())
		{
			if (this.IS_DEBUGGING) { Debugger.Continue("Firebase"); }
			const result = gamertagSnapshot.val();
			filteredSR = new ServiceRecord(result);

			// Store locally for current pull
			this.__storeFilteredServiceRecordLocally(gamertag, tree, filter, filteredSR);
			return filteredSR;
		}

		return filteredSR;
	}

	/**
	 * Gets the statistics for a user for the current pull
	 * @param gamertag the gamertag to retrieve
	 * @returns The Service Record for the current pull
	 */
	private __getCurrentStatsForGamertagLocally(gamertag: string): ServiceRecord | undefined
	{
		const player = this.__allPlayers.get(gamertag);
		return player?.serviceRecord;
	}

	/**
	 * Gets all stats for a certain gamertag
	 * @param gamertag The gamertag to get stats from
	 * @returns Array of service records
	 */
	private __getAllHistoricStatsLocally(gamertag: string): ServiceRecord[] | undefined
	{
		const player = this.__allPlayers.get(gamertag);
		return player?.historicStats;
	}

	/**
	 * Gets the service record for the filter locally, if possible
	 * @param gamertag: the gamertag to get
	 * @param tree the filter tree
	 * @param filter the map/mode/outcome/rank filter
	 * @returns the service record for the filter
	 */
	 private __getFilteredServiceRecordLocally(gamertag: string, tree: ServiceRecordFilter, filter: HaloMap | HaloMode | HaloRanked | HaloOutcome): ServiceRecord | undefined
	{
		const player = this.__allPlayers.get(gamertag) ?? new Player(gamertag);
		return player.GetFilteredServiceRecord(gamertag, tree, filter);
	}

	/**
	 * Stores the service record into the AllUserStatistics map if it's not already in there
	 * @param serviceRecord The service record to push in
	 * @param pull The pull to push in
	 */
	private __storeCurrentServiceRecordLocally(gamertag: string, serviceRecord: ServiceRecord): void
	{
		const player = this.__allPlayers.get(gamertag) ?? new Player(gamertag);
		player.serviceRecord = serviceRecord;
		this.__allPlayers.set(gamertag, player);
	}

	/**
	 * Stores the service record into the AllUserStatistics map if it's not already in there
	 * @param serviceRecord The service record to push in
	 * @param pull The pull to push in
	 */
	private __storeHistoricServiceRecordsLocally(gamertag: string, serviceRecords: ServiceRecord[]): void
	{
		const player = this.__allPlayers.get(gamertag) ?? new Player(gamertag);
		player.historicStats = serviceRecords;
		this.__allPlayers.set(gamertag, player);
	}

	/**
	 * Sets the service record for the filter locally
	 * @param gamertag: the gamertag to get
	 * @param tree the filter tree
	 * @param filter the map/mode/outcome/rank filter
	 * @param serviceRecord the service record for the filter
	 */
	private __storeFilteredServiceRecordLocally(gamertag: string, tree: ServiceRecordFilter, filter: HaloMap | HaloMode | HaloRanked | HaloOutcome, serviceRecord: ServiceRecord): void
	{
		const player = this.__allPlayers.get(gamertag) ?? new Player(gamertag);
		player.SetFilteredServiceRecord(gamertag, tree, filter, serviceRecord);
		this.__allPlayers.set(gamertag, player);
	}
	//#endregion

	//#region Matches
	/**
	 * Gets the number of matches specified for the gamertag starting from the latest match
	 * @param gamertag the gamertag
	 * @param numberOfMatches the number of matches to get
	 * @param offset the offset
	 */
	 public async GetMatch(id: string): Promise<Match | undefined>
	 {
		if (this.IS_DEBUGGING) { Debugger.Print(true, "GetMatch()", id); }

		// Try locally
		let match = this.__getMatchWithDetailsLocally(id);
		if (match)
		{
			if (this.IS_DEBUGGING) { Debugger.Continue("Locally"); }
			return match;
		}

		// Otherwise go to Autocode
		const result = await this.__getMatchFromHaloDotAPI(id);
		if (result?.data)
		{
			if (this.IS_DEBUGGING) { Debugger.Continue("Autocode"); }
			match = new Match(result.data);
		}

		// Store locally
		if (match) { this.__storeMatchWithDetailsLocally([match]); }

		return match;
	}

	/**
	 * Gets the number of matches specified for the gamertag starting from the latest match
	 * @param gamertag the gamertag
	 * @param numberOfMatches the number of matches to get
	 * @param offset the offset
	 */
	public async GetMatches(gamertag: string, numberOfMatches: number, offset: number): Promise<Match[] | undefined>
	{
		if (numberOfMatches <= 0) { return; }
		if (this.IS_DEBUGGING) { Debugger.Print(true, "GetMatches()", `${gamertag} - ${numberOfMatches} matches`); }

		// Try locally
		let matches = this.__getMatchesLocally(gamertag);
		if (matches && matches.length >= numberOfMatches)
		{
			if (this.IS_DEBUGGING) { Debugger.Continue("Locally"); }
			return matches;
		}

		// Otherwise go to Autocode
		matches = [];
		const result = await this.__getMatchesFromHaloDotAPI(gamertag, numberOfMatches, offset);
		if (result?.data?.length > 0)
		{
			if (this.IS_DEBUGGING) { Debugger.Continue("Autocode"); }
			for (const data of result?.data)
			{
				// Construct match object and store into local array
				matches.push(new Match(data));
			}
		}

		// Store locally
		if (matches) { this.__storeMatchesLocally(gamertag, matches); }

		return matches;
	}

	/**
	 * Gets all matches for a gamertag
	 * @param gamertag The gamertag to get matches for
	 * @returns The matches
	 */
	public async GetAllMatches(gamertag: string): Promise<Match[] | undefined>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "GetAllMatches()"); }

		// Try locally
		let matches = this.__getMatchesLocally(gamertag);
		if (matches && matches.length > 0)
		{
			if (this.IS_DEBUGGING) { Debugger.Continue("Locally"); }
			return matches;
		}

		// Otherwise go to Firebase
		const reference = `matches/${gamertag}`;
		const matchIndexesSnapshot = await get(child(ref(this.__database), reference));
		if (matchIndexesSnapshot?.exists())
		{
			if (this.IS_DEBUGGING) { Debugger.Continue("Firebase"); }
			const result = matchIndexesSnapshot.val();
			matches = [];
			
			// Loop through all matches
			let matchId: keyof any;
			for (matchId in result)
			{
				// Get match
				const data = result[matchId];
				if (!data) { continue; }

				// Construct match object and store into local array
				matches.push(new Match(data));
			}
		}

		// Store locally
		if (matches) { this.__storeMatchesLocally(gamertag, matches); }

		return matches;
	}

	// /**
	//  * Gets all matches for a gamertag
	//  * @param gamertag The gamertag to get matches for
	//  * @returns The matches
	//  */
	// public async GetMatchesForFilter(gamertag: string, filter: MatchFilter): Promise<Match[] | undefined>
	// {
	// 	if (filter.IsEmpty()) { return []; }
	// 	if (this.IS_DEBUGGING) { Debugger.Print(true, "GetMatchesForFilter()"); }

	// 	// Get local player if available
	// 	let matchIDs: Set<string> = new Set<string>();
	// 	const player = this.__allPlayers.get(gamertag) ?? new Player(gamertag);

	// 	// Start with the map filter
	// 	if (filter.HasMapFilter())
	// 	{
	// 		// No need to append here since it's our first filter
	// 		const localIDs = player.MapToMatchIDs.get(filter.map);

	// 		if (localIDs && localIDs.length > 0) { matchIDs = new Set<string>(localIDs); }
	// 		else { matchIDs = await this.__getMatchIndexFromFirebase(`match_indexes/map/${gamertag}/${filter.map}`); }

	// 		if (matchIDs.size === 0) { return []; }
	// 	}

	// 	// Now the mode filter
	// 	if (filter.HasModeFilter())
	// 	{
	// 		let filterIDs: Set<string>;

	// 		const localIDs = player.ModeToMatchIDs.get(filter.mode);
	// 		if (localIDs && localIDs.length > 0) { filterIDs = new Set<string>(localIDs); }
	// 		else { filterIDs = await this.__getMatchIndexFromFirebase(`match_indexes/mode/${gamertag}/${filter.mode}`); }

	// 		if (filterIDs.size === 0) { return []; }
	// 		matchIDs = this.__combineSets(matchIDs, filterIDs);
	// 	}

	// 	// Ranked filter
	// 	if (filter.HasIsRankedFilter())
	// 	{
	// 		let filterIDs: Set<string>;

	// 		const localIDs = player.IsRankedToMatchIDs.get(filter.isRanked === YesNoAll.Yes);
	// 		if (localIDs && localIDs.length > 0) { filterIDs = new Set<string>(localIDs); }
	// 		else { filterIDs = await this.__getMatchIndexFromFirebase(`match_indexes/ranked/${gamertag}`); }

	// 		if (filterIDs.size === 0) { return []; }
	// 		matchIDs = this.__combineSets(matchIDs, filterIDs);
	// 	}

	// 	// Finally the win filter
	// 	if (filter.HasIsWinFilter())
	// 	{
	// 		let filterIDs: Set<string>;

	// 		const localIDs = player.IsWinToMatchIDs.get(filter.isWin === YesNoAll.Yes);
	// 		if (localIDs && localIDs.length > 0) { filterIDs = new Set<string>(localIDs); }
	// 		else { filterIDs = await this.__getMatchIndexFromFirebase(`match_indexes/win/${gamertag}`); }

	// 		if (filterIDs.size === 0) { return []; }
	// 		matchIDs = this.__combineSets(matchIDs, filterIDs);
	// 	}

	// 	const matches: Match[] = [];
	// 	for (const matchID of Array.from(matchIDs.values()))
	// 	{
	// 		// See if we have this one locally
	// 		let match = player.GetMatchFromID(matchID);
	// 		if (match)
	// 		{
	// 			matches.push(match);
	// 			continue;
	// 		}

	// 		// Otherwise go to Firebase for the match details
	// 		const reference = `matches/${gamertag}/${matchID}`;
	// 		const matchSnapshot = await get(child(ref(this.__database), reference));
	// 		if (matchSnapshot?.exists())
	// 		{
	// 			const result = matchSnapshot.val();
	// 			const match = new Match(result);

	// 			if (match) 
	// 			{ 
	// 				matches.push(match); 
	// 				player.AddMatch(match);
	// 			}
	// 		}
	// 	}

	// 	// Set back into the local map
	// 	this.__allPlayers.set(gamertag, player);

	// 	return matches;
	// }

	/**
	 * Gets an array of match IDs from the firebase path
	 * @param path the path to get
	 * @returns array of match IDs
	 */
	private async __getMatchIndexFromFirebase(path: string): Promise<Set<string>>
	{
		const snapshot = await get(ref(this.__database, path));
		if (snapshot.exists())
		{
			return new Set<string>(Object.keys(snapshot.val()));
		}

		return new Set<string>();
	}

	/**
	 * Combines the matches set and the filtered set via intersection
	 * @param matchesSet the matches set
	 * @param filteredSet the filtered set
	 * @returns intersection of the two sets
	 */
	private __combineSets(matchesSet: Set<string>, filteredSet: Set<string>): Set<string>
	{
		if (matchesSet.size === 0) { return filteredSet; }
		else { return new Set(Array.from(filteredSet).filter(id => matchesSet.has(id))); }
	}

	/**
	 * Gets all matches for a certain gamertag
	 * @param gamertag The gamertag to get stats from
	 * @returns Array of matches
	 */
	 private __getMatchesLocally(gamertag: string): Match[] | undefined
	 {
		 const player = this.__allPlayers.get(gamertag);
		 return player?.matches;
	 }

	/**
	 * Stores an array of matches with details locally
	 * @param matches the matches to store
	 */
	private __storeMatchesLocally(gamertag: string, matches: Match[]): void
	{
		const player = this.__allPlayers.get(gamertag) ?? new Player(gamertag);
		player.matches = matches;
		this.__allPlayers.set(gamertag, player);
		this.__storeGamertagMatchLocally(matches);
	}

	/**
	 * Stores an array of matches with details locally
	 * @param matches the matches
	 */
	private __storeMatchWithDetailsLocally(matches: Match[]): void
	{
		for (const match of matches)
		{
			this.__allMatches.set(match.id, match);
		}
	}

	/**
	 * Gets a match with details locally
	 * @param id the match ID
	 */
	private __getMatchWithDetailsLocally(id: string): Match | undefined
	{
		return this.__allMatches.get(id);
	}

	/**
	 * Stores an array of matches into the player match details map
	 * @param matches the matches to store
	 */
	private __storeGamertagMatchLocally(matches: Match[]): void
	{
		for (const match of matches)
		{
			this.__allMatchesForGamertag.set(match.id, match);
		}
	}
 
	/**
	 * Gets a match for the gamertag locally
	 * @param id the match ID
	 */
	private __getGamertagMatchLocally(id: string): Match | undefined
	{
		return this.__allMatches.get(id);
	}
	//#endregion

	//#region Autocode
	/**
	 * Gets the match from HaloDotAPI
	 * @param gamertag the gamertag
	 */
	 private async __getMatchFromHaloDotAPI(id: string): Promise<any>
	 {
		 const response = await fetch("https://dev--ArrowheadCompany.loganjahnke.autocode.gg/match", {
			 method: "POST",
			 headers: { "Content-Type": "application/json" },
			 body: JSON.stringify({
				 id: id
			 })
		 });
	 
		 return await response.json();
	 }

	/**
	 * Gets the matches from HaloDotAPI for a specific gamertag
	 * @param gamertag the gamertag
	 */
	private async __getMatchesFromHaloDotAPI(gamertag: string, count: number, offset: number): Promise<any>
	{
		const response = await fetch("https://dev--ArrowheadCompany.loganjahnke.autocode.gg/matches", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				gamertag: gamertag,
				count: count,
				offset: offset
			})
		});
	
		return await response.json();
	}
	//#endregion

	//#region You really shouldn't need this anymore
	/**
	 * Loops through all matches for a gamertag and indexes them
	 * @param gamertag the gamertag to loop through
	 */
	private async IndexMatches(gamertag: string): Promise<void>
	{
		// Determine number of matches we need to query during this iteration of the loop (max is 25)
		const reference = `matches/${gamertag}`;
		const matchIndexesSnapshot = await get(child(ref(this.__database), reference));
		if (matchIndexesSnapshot.exists())
		{
			let matchId: keyof any;
			const data = matchIndexesSnapshot.val();

			// Loop through all matches for this query, index them, and store details to gamertag
			for (matchId in data)
			{
				// Get match
				const match = data[matchId];
				if (!match) { continue; }

				// Match ID is required
				const id: string = match.id;
				if (!id) { continue; }

				// Indexing items
				const isRanked: boolean | undefined = match.details?.playlist?.properties?.ranked;
				const isWin: boolean = match.player?.outcome === "win";
				const map: string | undefined = match.details?.map?.name;
				const playlist: string | undefined = match.details?.playlist?.name;
				const mode: string | undefined = playlist === "Tactical Slayer" ? playlist : match.details?.category?.name;

				// First store details into gamertag
				await update(ref(this.__database, `matches/${gamertag}`), { [id]: match });

				// Now add to the appropriate indexes
				if (isRanked) { await update(ref(this.__database, `match_indexes/ranked/${gamertag}`), { [id]: true }); }
				if (isWin) { await update(ref(this.__database, `match_indexes/win/${gamertag}`), { [id]: true }); }
				if (map) { await update(ref(this.__database, `match_indexes/map/${gamertag}/${map}`), { [id]: true }); }
				if (mode) { await update(ref(this.__database, `match_indexes/mode/${gamertag}/${mode}`), { [id]: true }); }
			}
		}
	}
	//#endregion
}