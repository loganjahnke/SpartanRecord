import { child, Database, DataSnapshot, get, ref, set, update } from "firebase/database";
import { Debugger } from "../Objects/Helpers/Debugger";
import { Appearance } from "../Objects/Model/Appearance";
import { CSRS } from "../Objects/Model/CSRS";
import { Match } from "../Objects/Model/Match";
import { Player } from "../Objects/Model/Player";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { MMR } from "../Objects/Pieces/MMR";
import { SRFilter } from "../Objects/Pieces/SRFilter";
import { ServiceRecordFilter } from "./ArrowheadFirebase";
import { AutocodeAppearance } from "./Schemas/AutocodeAppearance";
import { AutocodeCSRSData } from "./Schemas/AutocodeCSRS";
import { AutocodeMatch } from "./Schemas/AutocodeMatch";
import { AutocodeMultiplayerServiceRecord } from "./Schemas/AutocodeMultiplayerServiceRecord";
import { FirebaseBest } from "./Schemas/FirebaseBest";
import { FirebaseHistoricServiceRecord } from "./Schemas/FirebaseHistoricServiceRecord";

export class SCFirebase
{
	/** Turns on or off debugging mode */
	private readonly IS_DEBUGGING = process.env.NODE_ENV !== "production";
	
	/** The firebase database */
	private __database: Database;

	constructor(database: Database) 
	{
		this.__database = database;
	}

	/**
     * Gets a player from firebase
     * @param gamertag the gamertag
     * @param season the season
     * @param historic the historic SRs
     * @returns player object
     */
	public async GetPlayer(player: Player, season?: number, historic?: boolean): Promise<void>
	{
		if (!player.gamertag) { return; }

		if (historic)
		{
			[player.serviceRecord, player.appearance, player.historicStats, player.mmr, player.csrs] = await Promise.all([
				this.GetServiceRecord(player.gamertag, season),
				this.GetAppearance(player.gamertag),
				this.GetHistoricStatistics(player.gamertag),
				this.GetMMR(player.gamertag),
				this.GetCSRS(player.gamertag, season)
			]);
		}
		else
		{
			[player.serviceRecord, player.appearance, player.mmr, player.csrs] = await Promise.all([
				this.GetServiceRecord(player.gamertag, season),
				this.GetAppearance(player.gamertag),
				this.GetMMR(player.gamertag),
				this.GetCSRS(player.gamertag, season)
			]);
		}

	}

	//#region Appearance
	/**
	 * Gets the gamertag's appearance from Firebase
	 * @param gamertag the gamertag to get the appearance of
	 * @returns the appearance
	 */
	public async GetAppearance(gamertag: string): Promise<Appearance>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.GetAppearance()", gamertag); }

		const snapshot = await this.__get(`appearance/${gamertag}`);
		return new Appearance(snapshot?.val());
	}

	/**
	 * Sets the appearance for the gamertag into Firebase
	 * @param gamertag the gamertag
	 * @param data the appearance JSON
	 */
	public async SetAppearance(gamertag: string, data?: AutocodeAppearance): Promise<void>
	{
		if (!data) { return; }
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.SetAppearance()", gamertag); }
		await this.__set(`appearance/${gamertag}`, data);
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
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.GetServiceRecord()", gamertag); }

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
	 * Sets the appearance for the gamertag into Firebase
	 * @param gamertag the gamertag
	 * @param data the service record JSON
	 * @param season the season
	 */
	public async SetServiceRecord(gamertag: string, data?: AutocodeMultiplayerServiceRecord, season?: number): Promise<void>
	{
		if (!data) { return; }
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.SetServiceRecord()", gamertag); }

		if (!season || season === -1)
		{
			await this.__set(`service_record/multiplayer/${gamertag}`, data);
		}
		else
		{
			await this.__set(`service_record/season/${season}/${gamertag}`, data);
		}		
	}

	/**
	 * Gets a specific filtered service record for a gamertag
	 * @param gamertag the gamertag to get stats from
	 * @returns A service record that represents the filter
	 */
	public async GetFilteredServiceRecord(gamertag: string, tree: ServiceRecordFilter, filter: string): Promise<ServiceRecord | undefined>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.GetFilteredServiceRecord()", `${gamertag} - ${filter}`); }

		const node = tree === ServiceRecordFilter.Maps ? "map" : tree === ServiceRecordFilter.Modes ? "mode" : "outcome";
		const snapshot = await this.__get(`service_record/filtered/${gamertag}/${node}/${filter}`);
		if (snapshot)
		{
			return new ServiceRecord(snapshot.val());
		}
	}

	/**
	 * Gets a specific filtered service record for a gamertag
	 * @param gamertag the gamertag to get stats from
	 * @returns A service record that represents the filter
	 */
	public async GetAvailableFilters(gamertag: string, node: ServiceRecordFilter): Promise<SRFilter[]>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.GetAvailableFilters()", `${gamertag} - ${node}`); }

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

	/**
	 * Gets all filtered service records for a gamertag
	 * @param gamertag the gamertag to get stats from
	 * @returns A big ole JSON object
	 */
	public async GetAllFilteredServiceRecordsInRawJSON(gamertag: string): Promise<any>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.GetAllFilteredServiceRecordsInRawJSON()", `${gamertag}`); }

		const snapshot = await this.__get(`service_record/filtered/${gamertag}`);
		if (snapshot)
		{
			return snapshot.val();
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
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.SetFilteredServiceRecord()", `${gamertag} - ${tree}`); }
		await this.__update(`service_record/filtered/${gamertag}/${tree}`, Object.fromEntries(data));
	}

	/**
	 * Sets the fiters node for a gamertag to easily get the available maps and modes
	 * @param gamertag the gamertag
	 * @param tree the filter tree
	 * @param data the data
	 */
	public async SetAvailableFilters(gamertag: string, tree: ServiceRecordFilter, data?: Map<string, boolean>): Promise<void>
	{
		if (!data) { return; }
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.SetFiltersForGamertag()", `${gamertag} - ${tree}`); }
		await this.__update(`filters/${gamertag}/${tree}`, Object.fromEntries(data));
	}

	/**
	 * A specific historic service record for a gamertag
	 * @param gamertag the gamertag to get the historic statistics of
	 * @returns the service record for the game
	 */
	public async GetHistoricStatisticsForGameNumber(gamertag: string, game: number): Promise<ServiceRecord>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.GetHistoricStatisticsForGameNumber()", gamertag); }
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
	 * Gets the historic statistics for a gamertag
	 * @param gamertag the gamertag to get the historic statistics of
	 * @returns an array of service records
	 */
	public async GetHistoricStatistics(gamertag: string): Promise<ServiceRecord[]>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.GetHistoricStatistics()", gamertag); }

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
	 * Gets the historic statistics for a gamertag
	 * @param gamertag the gamertag to get the historic statistics of
	 * @returns an array of service records
	 */
	public async SetHistoricStatistics(gamertag: string, serviceRecord: FirebaseHistoricServiceRecord, matchCount: number): Promise<void>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.SetHistoricStatistics()", gamertag); }
		await this.__update(`service_record/historic/${gamertag}/${matchCount}`, serviceRecord);
	}
	//#endregion

	//#region MMR and CSRS
	/**
	 * Gets the MMR of the gamertag
	 * @param gamertag the gamertag to get the MMR of
	 * @returns the MMR for the gamertag
	 */
	public async GetMMR(gamertag: string): Promise<MMR>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.GetMMR()", gamertag); }

		const snapshot = await this.__get(`mmr/${gamertag}`);
		const data = snapshot?.val();
		if (!data) { return new MMR(); }

		const lss = data["lss"];
		const ffa = data["ffa"];

		return new MMR(lss, ffa);
	}

	/**
	 * Sets the MMR for the gamertag into Firebase
	 * @param gamertag the gamertag
	 * @param mmr the MMR
	 */
	public async SetMMR(gamertag: string, mmr: MMR): Promise<void>
	{
		if (!mmr) { return; }
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.SetMMR()", gamertag); }

		let update: any = {};
		if (mmr.ffa && mmr.lastSpartanStanding)
		{
			update = { ffa: mmr.ffa, lss: mmr.lastSpartanStanding };
		}
		else if (mmr.ffa)
		{
			update = { ffa: mmr.ffa };
		}
		else if (mmr.lastSpartanStanding)
		{
			update = { lss: mmr.lastSpartanStanding };
		}
		else { return; }

		await this.__update(`mmr/${gamertag}`, update);	
	}

	/**
	 * Gets the MMR of the gamertag
	 * @param gamertag the gamertag to get the MMR of
	 * @param season the season
	 * @returns the CSRS
	 */
	public async GetCSRS(gamertag: string, season?: number): Promise<CSRS[]>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.GetCSRS()", gamertag); }

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

	/**
	 * Sets the MMR for the gamertag into Firebase
	 * @param gamertag the gamertag
	 * @param season the season
	 * @param data the data to save
	 */
	public async SetCSRS(gamertag: string, season?: number, data?: Partial<AutocodeCSRSData>[]): Promise<void>
	{
		if (!data) { return; }
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.SetCSRS()", gamertag); }
		
		if (!season || season === -1) { await this.__set(`csrs/${gamertag}/current`, data); }
		else { await this.__set(`csrs/${gamertag}/season/${season}`, data); }
	}
	//#endregion

	//#region Sync Match Information
	/**
	 * Sees if this gamertag is allowed to see filters
	 * @param gamertag the gamertag to check the permissions of
	 * @returns true if allowed to see filters
	 */
	public async GetIsAllowed(gamertag: string): Promise<boolean>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.GetIsAllowed()", gamertag); }

		const snapshot = await this.__get(`allowed/${gamertag}`);
		return snapshot?.val() ?? false;
	}

	/**
	 * Gets the latest match ID and number that has been synced into firebase
	 * @param gamertag the gamertag to get the last match ID of
	 * @returns the latest match ID and match number synced into firebase
	 */
	public async GetIsSyncing(gamertag: string): Promise<boolean>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.GetIsSyncing()", gamertag); }

		const snapshot = await this.__get(`sync/${gamertag}/syncing`);
		return snapshot?.val() ?? false;
	}
	//#endregion

	//#region Single Match
	/**
	 * Gets a full match from firebase
	 * @param matchID the match ID
	 * @returns the match
	 */
	public async GetMatch(matchID: string): Promise<Match | undefined>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.GetMatch()", matchID); }

		const snapshot = await this.__get(`match/${matchID}`);
		if (!snapshot) { return undefined; }
		return new Match(snapshot.val());
	}

	/**
	 * Sets a full match into firebase
	 * @param matchID the match ID
	 * @returns the match
	 */
	public async SetMatch(matchID: string, match: AutocodeMatch): Promise<void>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.SetMatch()", matchID); }
		await this.__update(`match/${matchID}`, match);
	}
	//#endregion

	//#region Best Matches
	/**
	 * The current best (or worst) values for the gamer
	 * @param gamertag the gamertag
	 * @returns the best values object
	 */
	public async GetBest(gamertag: string): Promise<FirebaseBest>
	{
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
	public async GetBestForMap(gamertag: string, map: string): Promise<FirebaseBest>
	{
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

	//#region Gamertag References
	/**
	 * Gets the reference to the right gamertag from the input
	 * @param input the inputted gamertag
     * @returns the real gamertag
	 */
	public async GetGamertag(input: string): Promise<string>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.GetGamertag()", `${input}`); }
		const snapshot = await this.__get(`gamertag/${input}`);
		if (!snapshot || !snapshot.val()) { return input; }
		return snapshot.val();
	}

	/**
	 * Sets the reference to the right gamertag from the wrong one
	 * @param correct the correct gamertag
     * @param incorrect the incorrect gamertag
	 */
	public async SetGamertagPointer(correct: string, incorrect: string): Promise<void>
	{
		if (correct === incorrect) { return; }
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.SetGamertagPointer()", `${incorrect} -> ${correct}`); }

		await this.__set(`gamertag/${incorrect}`, correct);	
	}
	//#endregion

	//#region Helpers
	/**
	 * Gets the snapshot given the path
	 * @param path the path to get
	 * @returns the data snapshot unless there is none
	 */
	private async __get(path: string): Promise<DataSnapshot | undefined>
	{
		const snapshot = await get(child(ref(this.__database), path));
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
	private async __set(path: string, value: any): Promise<void>
	{
		await set(child(ref(this.__database), path), value);
	}

	/**
	 * Updates the value for the path
	 * @param path the path
	 * @param value the value
	 */
	private async __update(path: string, value: any): Promise<void>
	{
		await update(child(ref(this.__database), path), value);
	}
	//#endregion
}