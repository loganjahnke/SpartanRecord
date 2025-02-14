import * as admin from "firebase-admin";

import { AutocodeAppearance } from "./Schemas/AutocodeAppearance";
import { AutocodeMatch } from "./Schemas/AutocodeMatch";
import { AutocodeMultiplayerServiceRecord } from "./Schemas/AutocodeMultiplayerServiceRecord";
import { FirebaseBest, FirebaseMatchesBest } from "./Schemas/FirebaseBest";
import { FirebaseHistoricServiceRecord } from "./Schemas/FirebaseHistoricServiceRecord";


export enum ServiceRecordFilter
{
	Map = "map",
	Outcome = "outcome",
	Mode = "mode"
}

//#region Appearance
/**
 * Sets the appearance for the gamertag into Firebase
 * @param gamertag the gamertag
 * @param data the appearance JSON
 */
export const SetAppearance = async (app: admin.app.App, gamertag: string, data?: AutocodeAppearance): Promise<void> =>
{
	if (!data) { return; }
	await set(app, `appearance/${gamertag}`, data);
}
//#endregion

//#region Service Record
/**
 * Gets the total number of bot games from the last sync
 * @param gamertag the gamertag to get the service record of
 * @returns the total number of bot games
 */
export const GetTotalBotGames = async (app: admin.app.App, gamertag: string): Promise<number> =>
{
	return await get(app, `bots/${gamertag}`) ?? 0;
}

/**
 * Gets the total number of bot games from the last sync
 * @param gamertag the gamertag to get the service record of
 * @returns the total number of bot games
 */
export const SetTotalBotGames = async (app: admin.app.App, gamertag: string, count: number): Promise<void> =>
{
	await set(app, `bots/${gamertag}`, count);
}

/**
 * Gets the service record for the gamertag from Firebase
 * @param gamertag the gamertag to get the service record of
 * @returns the service record for the gamertag
 */
export const GetServiceRecord = async (app: admin.app.App, gamertag: string): Promise<AutocodeMultiplayerServiceRecord | undefined> =>
{
	return await get(app, `service_record/current/${gamertag}`);
}

/**
 * Sets the appearance for the gamertag into Firebase
 * @param gamertag the gamertag
 * @param data the service record JSON
 */
export const SetServiceRecord = async (app: admin.app.App, gamertag: string, data?: AutocodeMultiplayerServiceRecord): Promise<void> =>
{
	if (!data) { return; }
	await Promise.all([
		set(app, `service_record/current/${gamertag}`, data),
		set(app, `service_record/multiplayer/${gamertag}`, data)
	]);
}

/**
 * Gets a specific filtered service record for a gamertag
 * @param gamertag the gamertag to get stats from
 * @returns A service record that represents the filter
 */
export const GetAvailableFilters = async (app: admin.app.App, gamertag: string): Promise<any> =>
{
	return await get(app, `filters/${gamertag}`);
}

/**
 * Gets all filtered service records for a gamertag
 * @param gamertag the gamertag to get stats from
 * @returns A big ole JSON object
 */
export const GetAllFilteredServiceRecordsInRawJSON = async (app: admin.app.App, gamertag: string): Promise<any> =>
{
	return await get(app, `service_record/filtered/${gamertag}`);
}

/**
 * Gets a specific filtered service record for a gamertag
 * @param gamertag the gamertag to get stats from
 * @returns A service record that represents the filter
 */
export const SetFilteredServiceRecord = async (app: admin.app.App, gamertag: string, tree: ServiceRecordFilter, data?: Map<string, AutocodeMultiplayerServiceRecord>): Promise<void> =>
{
	if (!data) { return; }
	await update(app, `service_record/filtered/${gamertag}/${tree}`, Object.fromEntries(data));
}

/**
 * Sets the fiters node for a gamertag to easily get the available maps and modes
 * @param gamertag the gamertag
 * @param tree the filter tree
 * @param data the data
 */
export const SetAvailableFilters = async (app: admin.app.App, gamertag: string, tree: ServiceRecordFilter, data?: Map<string, number>): Promise<void> =>
{
	if (!data) { return; }
	await update(app, `filters/${gamertag}/${tree}`, Object.fromEntries(data));
}

/**
 * Gets the historic statistics for a gamertag
 * @param gamertag the gamertag to get the historic statistics of
 * @returns an array of service records
 */
export const SetHistoricStatistics = async (app: admin.app.App, gamertag: string, serviceRecord: FirebaseHistoricServiceRecord, matchCount: number): Promise<void> =>
{
	await update(app, `service_record/historic/${gamertag}/${matchCount}`, serviceRecord);
}
//#endregion

//#region Sync
/**
 * Is this gamertag allowed to sync all stats?
 * @param gamertag the gamertag
 * @returns true if allowed to sync all stats
 */
export const GetAllAllowed = async (app: admin.app.App): Promise<string[]> =>
{
	const allowed = await get(app, `allowed`);
	if (!allowed) { return []; }
	return Object.keys(allowed);
}

/**
 * Is this gamertag allowed to sync all stats?
 * @param gamertag the gamertag
 * @returns true if allowed to sync all stats
 */
export const GetIsAllowed = async (app: admin.app.App, gamertag: string): Promise<boolean> =>
{
	return await get(app, `allowed/${gamertag}`) ?? false;
}

/**
 * Gets the last synced match ID
 * @param gamertag the gamertag
 * @returns the match ID
 */
export const GetLastSyncedMatchID = async (app: admin.app.App, gamertag: string): Promise<string> =>
{
	return await get(app, `sync/${gamertag}/last_match`) ?? "";
}

/**
 * Gets the last synced match ID
 * @param gamertag the gamertag
 * @returns the match ID
 */
export const SetLastSyncedMatchID = async (app: admin.app.App, gamertag: string, lastMatchID: string): Promise<void> =>
{
	await set(app, `sync/${gamertag}/last_match`, lastMatchID);
}

/**
 * Gets the last synced match ID
 * @param gamertag the gamertag
 * @returns the match ID
 */
export const GetIsSyncing = async (app: admin.app.App, gamertag: string): Promise<boolean> =>
{
	return await get(app, `sync/${gamertag}/syncing`) ?? false;
}

/**
 * Gets the last synced match ID
 * @param gamertag the gamertag
 * @returns the match ID
 */
export const SetIsSyncing = async (app: admin.app.App, gamertag: string, isSyncing: boolean): Promise<void> =>
{
	await set(app, `sync/${gamertag}/syncing`, isSyncing);
}
//#endregion

//#region Best Matches
/**
 * The current best (or worst) values for the gamer
 * @param gamertag the gamertag
 * @returns the best values object
 */
export const GetBest = async (app: admin.app.App, gamertag: string): Promise<FirebaseBest> =>
{
	let result = await get(app, `best/${gamertag}/all`);
	if (!result)
	{
		result = {
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
	return result;
}

/**
 * Sets the best values and match IDs
 * @param gamertag the gamertag
 * @param best the best match IDs and values
 * @returns the match
 */
export const SetBest = async (app: admin.app.App, gamertag: string, best: FirebaseBest): Promise<void> =>
{
	await set(app, `best/${gamertag}/all`, best);
}

/**
 * The current best (or worst) values for the gamer
 * @param gamertag the gamertag
 * @returns the best values object
 */
export const GetBestForMaps = async (app: admin.app.App, gamertag: string): Promise<FirebaseMatchesBest> =>
{
	return await get(app, `best/${gamertag}/maps`) ?? {};
}

/**
 * Sets the best values and match IDs
 * @param gamertag the gamertag
 * @param best the best match IDs and values
 * @returns the match
 */
export const SetBestForMaps = async (app: admin.app.App, gamertag: string, best: FirebaseMatchesBest): Promise<void> =>
{
	await set(app, `best/${gamertag}/maps`, best);
}
//#endregion

//#region Single Match
/**
 * Gets a full match from firebase
 * @param matchID the match ID
 * @returns the match
 */
export const GetMatch = async (app: admin.app.App, matchID: string): Promise<AutocodeMatch | undefined> =>
{
	return await get(app, `match/${matchID}`);
}

/**
 * Sets a full match into firebase
 * @param matchID the match ID
 * @returns the match
 */
export const SetMatch = async (app: admin.app.App, matchID: string, match: AutocodeMatch): Promise<void> =>
{
	await update(app, `match/${matchID}`, match);
}
//#endregion

//#region Leaderboards
/**
 * Gets the leaderboard
 * @param app the firebase app
 * @param leaderboard the leaderboard path
 * @returns the leaderboard JSON results
 */
export const GetLeaderboard = async (app: admin.app.App, leaderboard: string): Promise<any> => await get(app, "leaderboard/" + leaderboard);

/**
 * Sets the leaderboard averages
 * @param app the firebase app
 * @param leaderboard the leaderboard path
 * @param mean the average
 * @param median the 50% quartile
 * @param q25 the 25% quartile
 * @param q75 the 75% quartile
 * @param sd the standard deviation
 * @param min the minimum
 * @param max the maximum
 */
export const SetLeaderboardAverages = async (app: admin.app.App, leaderboard: string, mean: number, median: number, q25: number, q75: number, sd: number, min: number, max: number): Promise<void> => 
{
	await set(app, "averages/" + leaderboard, {
		mean: mean,
		median: median,
		q25: q25,
		q75: q75,
		sd: sd,
		min: min,
		max: max
	});
}
//#endregion

//#region Helpers
/**
 * Gets the snapshot given the path
 * @param path the path to get
 * @returns the data snapshot unless there is none
 */
const get = async (app: admin.app.App, path: string): Promise<any> =>
{
	const snapshot = await app.database().ref(path).get();
	if (snapshot?.exists()) 
	{ 
		return snapshot.val(); 
	}

	return undefined;
}

/**
 * Sets the value for the path
 * @param path the path
 * @param value the value
 */
const set = async (app: admin.app.App, path: string, value: any): Promise<void> =>
{
	await app.database().ref(path).set(value);
}

/**
 * Updates the value for the path
 * @param path the path
 * @param value the value
 */
const update = async (app: admin.app.App, path: string, value: any): Promise<void> =>
{
	await app.database().ref(path).update(value);
}
//#endregion