import { child, Database, DataSnapshot, get, ref, set, update } from "firebase/database";
import { Debugger } from "../Objects/Helpers/Debugger";
import { Appearance } from "../Objects/Model/Appearance";
import { Match } from "../Objects/Model/Match";
import { Player } from "../Objects/Model/Player";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { FilterCount } from "../Objects/Pieces/FilterCounts";
import { ServiceRecordFilter } from "./ArrowheadFirebase";
import { AutocodeAppearance } from "./Schemas/AutocodeAppearance";
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
	 * Gets the player's service record and appearance from firebase
	 * @param player the player to update
	 * @param historic get the historic stats?
	 */
	public async GetPlayer(player: Player, historic?: boolean): Promise<void>
	{
		if (!player.gamertag) { return; }

		if (historic)
		{
			[player.serviceRecord, player.appearance, player.historicStats] = await Promise.all([
				this.GetServiceRecord(player.gamertag),
				this.GetAppearance(player.gamertag),
				this.GetHistoricStatistics(player.gamertag)
			]);
		}
		else
		{
			[player.serviceRecord, player.appearance] = await Promise.all([
				this.GetServiceRecord(player.gamertag),
				this.GetAppearance(player.gamertag)
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
	 * @returns the service record for the gamertag
	 */
	public async GetServiceRecord(gamertag: string): Promise<ServiceRecord>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.GetServiceRecord()", gamertag); }

		const snapshot = await this.__get(`service_record/multiplayer/${gamertag}`);
		return new ServiceRecord(snapshot?.val());
	}

	/**
	 * Sets the appearance for the gamertag into Firebase
	 * @param gamertag the gamertag
	 * @param data the service record JSON
	 */
	public async SetServiceRecord(gamertag: string, data?: AutocodeMultiplayerServiceRecord): Promise<void>
	{
		if (!data) { return; }
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.SetAppearance()", gamertag); }
		await this.__set(`service_record/multiplayer/${gamertag}`, data);
	}

	/**
	 * Gets a specific filtered service record for a gamertag
	 * @param gamertag the gamertag to get stats from
	 * @returns A service record that represents the filter
	 */
	public async GetFilteredServiceRecord(gamertag: string, tree: ServiceRecordFilter, filter: string): Promise<ServiceRecord | undefined>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.GetFilteredServiceRecord()", `${gamertag} - ${filter}`); }

		const snapshot = await this.__get(`service_record/filtered/${gamertag}/${tree}/${filter}`);
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
	public async GetAvailableFilters(gamertag: string, node: ServiceRecordFilter): Promise<FilterCount[]>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCFirebase.GetAvailableFilters()", `${gamertag} - ${node}`); }

		const filters: FilterCount[] = [];
		const snapshot = await this.__get(`filters/${gamertag}/${node}`);
		if (snapshot)
		{
			for (const name in snapshot.val())
			{
				const count = snapshot.val()[name];
				filters.push(new FilterCount(name, count ?? 0));
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
			for (const key in result)
			{
				if (+key < 50) { continue; }
				let autocodeSR: any = {
					data: {
						records: {
							pvp: result[key]
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

	//#region Sync Match Information
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