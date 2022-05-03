import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as firebase from "./Helpers/SCFirebase";
import * as autocode from "./Helpers/SCAutocode";
import { AutocodeHelpers } from "./Helpers/Schemas/AutocodeHelpers";
import { AutocodeMatch, AutocodeMatchPlayer } from "./Helpers/Schemas/AutocodeMatch";
import { AutocodeMultiplayerServiceRecord } from "./Helpers/Schemas/AutocodeMultiplayerServiceRecord";
import { AutocodePlayerMatch } from "./Helpers/Schemas/AutocodePlayerMatch";
import { FirebaseBest, FirebaseMatchesBest } from "./Helpers/Schemas/FirebaseBest";
import { AutocodeAppearance } from "./Helpers/Schemas/AutocodeAppearance";

//#region Helpers
/**
 * Updates the service record and filter maps with the player details for a match
 * @param srMap the service record map
 * @param filterMap the filters map
 * @param key the key for the map (could be variant, map, playlist, or outcome)
 * @param playerDetails the player's match details
 * @param isRanked was the match ranked?
 * @param secondsPlayed how many seconds was the match?
 */
const UpdateMap = (srMap: Map<string, AutocodeMultiplayerServiceRecord>, filterMap: Map<string, number>, key: string | undefined, playerDetails: AutocodeMatchPlayer, isRanked: boolean, secondsPlayed: number): void =>
{
	if (!key) { return; }
	
	// Update number of times in filter map
	filterMap.set(key, (filterMap.get(key) ?? 0) + 1);

	// Get service record if possible, and then subtract match and add back to map
	let sr = srMap.get(key);
	if (sr) { AutocodeHelpers.AddMatchToServiceRecord(sr, playerDetails, isRanked, secondsPlayed); }
	else
	{ 
		sr = AutocodeHelpers.CreateServiceRecordFromMatch(playerDetails.details.name, playerDetails, isRanked, secondsPlayed); 
		srMap.set(key, sr);
	}
}

/**
 * Evaluates the best values against the match to see if anything is better
 * @param matchID the match ID
 * @param match the match object
 * @param bestMatches the best matches
 * @param map the Halo map
 * @param bestMatchesForMaps the best matches for all Halo maps
 */
const EvaluateBestValues = (matchID: string, match: AutocodeMatchPlayer, bestMatches: FirebaseBest, map: string, bestMatchesForMaps: FirebaseMatchesBest): void =>
{	
	//#region All matches
	// Best KDA
	if (bestMatches.values.best_kda === undefined || (bestMatches.values.best_kda < match.stats.core.kda))
	{
		bestMatches.values.best_kda = match.stats.core.kda;
		bestMatches.match_ids.best_kda = matchID;
	}

	// Worst KDA
	if (bestMatches.values.worst_kda === undefined || (bestMatches.values.worst_kda > match.stats.core.kda))
	{
		bestMatches.values.worst_kda = match.stats.core.kda;
		bestMatches.match_ids.worst_kda = matchID;
	}

	// Most Kills
	if (bestMatches.values.most_kills === undefined || (bestMatches.values.most_kills < match.stats.core.summary.kills))
	{
		bestMatches.values.most_kills = match.stats.core.summary.kills;
		bestMatches.match_ids.most_kills = matchID;
	}

	// Most Deaths
	if (bestMatches.values.most_deaths === undefined || (bestMatches.values.most_deaths < match.stats.core.summary.deaths))
	{
		bestMatches.values.most_deaths = match.stats.core.summary.deaths;
		bestMatches.match_ids.most_deaths = matchID;
	}

	// Most Assists
	if (bestMatches.values.most_assists === undefined || (bestMatches.values.most_assists < match.stats.core.summary.assists))
	{
		bestMatches.values.most_assists = match.stats.core.summary.assists;
		bestMatches.match_ids.most_assists = matchID;
	}

	// Highest KD Spread
	if (bestMatches.values.highest_kd_spread === undefined || (bestMatches.values.highest_kd_spread < (match.stats.core.summary.kills - match.stats.core.summary.deaths)))
	{
		bestMatches.values.highest_kd_spread = match.stats.core.summary.kills - match.stats.core.summary.deaths;
		bestMatches.match_ids.highest_kd_spread = matchID;
	}

	// Lowest KD Spread
	if (bestMatches.values.worst_kd_spread === undefined || (bestMatches.values.worst_kd_spread > (match.stats.core.summary.kills - match.stats.core.summary.deaths)))
	{
		bestMatches.values.worst_kd_spread = match.stats.core.summary.kills - match.stats.core.summary.deaths;
		bestMatches.match_ids.worst_kd_spread = matchID;
	}
	//#endregion

	//#region Matches for Map
	if (!map) { return; }
	let mapBests = bestMatchesForMaps[map];
	if (!mapBests)
	{
		mapBests = {
			match_ids: {
				best_kda: matchID,
				worst_kda: matchID,
				most_kills: matchID,
				most_deaths: matchID,
				most_assists: matchID,
				highest_kd_spread: matchID,
				worst_kd_spread: matchID
			},
			values: {
				best_kda: match.stats.core.kda,
				worst_kda: match.stats.core.kda,
				most_kills: match.stats.core.summary.kills,
				most_deaths: match.stats.core.summary.deaths,
				most_assists: match.stats.core.summary.assists,
				highest_kd_spread: match.stats.core.summary.kills - match.stats.core.summary.deaths,
				worst_kd_spread: match.stats.core.summary.kills - match.stats.core.summary.deaths
			}
		} 		
	}
	else
	{
		// Best KDA
		if (mapBests.values.best_kda === undefined || (mapBests.values.best_kda < match.stats.core.kda))
		{
			mapBests.values.best_kda = match.stats.core.kda;
			mapBests.match_ids.best_kda = matchID;
		}
	
		// Worst KDA
		if (mapBests.values.worst_kda === undefined || (mapBests.values.worst_kda > match.stats.core.kda))
		{
			mapBests.values.worst_kda = match.stats.core.kda;
			mapBests.match_ids.worst_kda = matchID;
		}
	
		// Most Kills
		if (mapBests.values.most_kills === undefined || (mapBests.values.most_kills < match.stats.core.summary.kills))
		{
			mapBests.values.most_kills = match.stats.core.summary.kills;
			mapBests.match_ids.most_kills = matchID;
		}
	
		// Most Deaths
		if (mapBests.values.most_deaths === undefined || (mapBests.values.most_deaths < match.stats.core.summary.deaths))
		{
			mapBests.values.most_deaths = match.stats.core.summary.deaths;
			mapBests.match_ids.most_deaths = matchID;
		}
	
		// Most Assists
		if (mapBests.values.most_assists === undefined || (mapBests.values.most_assists < match.stats.core.summary.assists))
		{
			mapBests.values.most_assists = match.stats.core.summary.assists;
			mapBests.match_ids.most_assists = matchID;
		}
	
		// Highest KD Spread
		if (mapBests.values.highest_kd_spread === undefined || (mapBests.values.highest_kd_spread < (match.stats.core.summary.kills - match.stats.core.summary.deaths)))
		{
			mapBests.values.highest_kd_spread = match.stats.core.summary.kills - match.stats.core.summary.deaths;
			mapBests.match_ids.highest_kd_spread = matchID;
		}
	
		// Lowest KD Spread
		if (mapBests.values.worst_kd_spread === undefined || (mapBests.values.worst_kd_spread > (match.stats.core.summary.kills - match.stats.core.summary.deaths)))
		{
			mapBests.values.worst_kd_spread = match.stats.core.summary.kills - match.stats.core.summary.deaths;
			mapBests.match_ids.worst_kd_spread = matchID;
		}
	}

	// Set back into map
	bestMatchesForMaps[map] = mapBests;
	//#endregion
}

/**
 * Populates the map with the data for the given key
 * @param data the data JSON
 * @param key the key to loop through in data
 * @param map the map to populate
 */
const PopulateSRMap = (data: any, key: keyof any, map: Map<string, AutocodeMultiplayerServiceRecord>): void =>
{
	if (!data) { return; }
	const tree = data[key] ?? {};

	let k: keyof any;
	for (k in tree)
	{
		const sr: AutocodeMultiplayerServiceRecord = tree[k];
		if (sr) { map.set(k, sr); }
	}
}

/**
 * Populates the map with the data for the given key
 * @param data the data JSON
 * @param key the key to loop through in data
 * @param map the map to populate
 */
const PopulateFilterMap = (data: any, key: keyof any, map: Map<string, number>): void =>
{
	if (!data) { return; }
	const tree = data[key] ?? {};

	let k: keyof any;
	for (k in tree) 
	{ 
		const count: number = tree[k];
		map.set(k, count ?? 0); 
	}
}

/**
 * Loops through all matches until we hit the last match ID
 * @param app the firebase app
 * @param gamertag the gamertag
 * @param lastMatchID the last match ID
 * @param startingServiceRecord the starting service record
 * @returns nothing but love
 */
const LoopThroughMatches = async (app: admin.app.App, gamertag: string, lastMatchID: string, startingServiceRecord: AutocodeMultiplayerServiceRecord): Promise<void> =>
{
	// Get current game count from the service record that was passed in
	const currGameCount = startingServiceRecord.data?.records?.pvp?.matches?.total ?? 0;
	if (currGameCount === 0) { return; }
	
	let offset = 0;
	let newLastMatchIDSynced = "";
	let indexOfLastMatchID = -1;
	let game = currGameCount;
	let matches: (AutocodeMatch | undefined)[] = [];

	// Setup maps to track filtered service records
	const mapSRs = new Map<string, AutocodeMultiplayerServiceRecord>();
	const variantSRs = new Map<string, AutocodeMultiplayerServiceRecord>();
	const playlistSRs = new Map<string, AutocodeMultiplayerServiceRecord>();
	const outcomeSRs = new Map<string, AutocodeMultiplayerServiceRecord>();
	
	// Get previous filtered SRs and best matches
	const [filteredSRs, availableFilters, bestMatches, bestMatchesPerMap] = await Promise.all([
		firebase.GetAllFilteredServiceRecordsInRawJSON(app, gamertag),
		firebase.GetAvailableFilters(app, gamertag),
		firebase.GetBest(app, gamertag),
		firebase.GetBestForMaps(app, gamertag)
	]);
	
	// Populate maps
	PopulateSRMap(filteredSRs, firebase.ServiceRecordFilter.Map, mapSRs);
	PopulateSRMap(filteredSRs, firebase.ServiceRecordFilter.Variant, variantSRs);
	PopulateSRMap(filteredSRs, firebase.ServiceRecordFilter.Playlist, playlistSRs);
	PopulateSRMap(filteredSRs, firebase.ServiceRecordFilter.Outcome, outcomeSRs);
	
	// Setup maps to track the keys of maps and modes and stuff
	const mapFilters = new Map<string, number>();
	const variantFilters = new Map<string, number>();
	const playlistFilters = new Map<string, number>();
	const outcomeFilters = new Map<string, number>();

	PopulateFilterMap(availableFilters, firebase.ServiceRecordFilter.Map, mapFilters);
	PopulateFilterMap(availableFilters, firebase.ServiceRecordFilter.Variant, variantFilters);
	PopulateFilterMap(availableFilters, firebase.ServiceRecordFilter.Playlist, playlistFilters);
	PopulateFilterMap(availableFilters, firebase.ServiceRecordFilter.Outcome, outcomeFilters);

	// Get latest SR over time
	const overtimeSR = startingServiceRecord;
	
	// Pull matches until we have the complete match history since the last query
	do
	{
		// Get the last chunk of matches
		const playerMatches = await autocode.GetPlayerMatches(gamertag, 25, offset);
		if (!playerMatches || !playerMatches.data || !playerMatches.data.matches) { return; }

		// Do a quick loop to see if we hit our last match ID and cut everything after it
		let playerMatchResults = playerMatches.data.matches;
		if (lastMatchID)
		{
			indexOfLastMatchID = playerMatchResults.findIndex((match: AutocodePlayerMatch) => match.id === lastMatchID);
			if (indexOfLastMatchID === 0) { return; }
			if (indexOfLastMatchID !== -1)
			{
				playerMatchResults = playerMatchResults.slice(0, indexOfLastMatchID);
			}
		}

		const autocodeMatchesToQuery = new Map<string, number>();
		const matchIDsToGet: string[] = [];

		// Try to get these matches in firebase
		let i = 0;
		for (const playerMatch of playerMatchResults)
		{
			const match = await firebase.GetMatch(app, playerMatch.id);
			if (!match || !match.id || match.id !== playerMatch.id) 
			{
				matches.push(undefined);
				autocodeMatchesToQuery.set(playerMatch.id, i);
				matchIDsToGet.push(playerMatch.id);
			}
			else { matches.push(match); }

			i += 1;
		}

		// Get the ones we couldn't from autocode (so much slower)
		if (matchIDsToGet.length > 0)
		{
			const autocodeMatches = await autocode.GetMatches(matchIDsToGet);
	
			// Something went wrong here
			if (!autocodeMatches || !autocodeMatches.data) 
			{ 
				console.warn("AutocodeMatches returned nothing for " + matchIDsToGet);
				return; 
			}
	
			// If this equals what we originally queried (aka firebase gave us no savings), set the matches and move on
			if (autocodeMatches.data.length === playerMatchResults.length)
			{
				matches = autocodeMatches.data;
				// Add to firebase
				for (const autocodeMatch of autocodeMatches.data) { await firebase.SetMatch(app, autocodeMatch.id, autocodeMatch); }
			}
			else
			{
				// Add to the right index
				for (const autocodeMatch of autocodeMatches.data)
				{
					const i = autocodeMatchesToQuery.get(autocodeMatch.id);
					if (!i) { continue; }
					matches[i] = autocodeMatch;
	
					// Add match to firebase
					await firebase.SetMatch(app, autocodeMatch.id, autocodeMatch);
				}
			}
		}

		// Loop through all matches for this query, index them, and store details to gamertag
		for (const autocodeMatch of matches)
		{
			if (!autocodeMatch) { continue; }
			if (game <= 0) { break; }

			// Match is required
			const match = autocodeMatch.match;
			if (!match || !match.id) { continue; }
			if (!newLastMatchIDSynced) { newLastMatchIDSynced = match.id; }

			// Update offset
			offset += 1;

			// We don't keep track of bot battles, so skip this
			if (match.experience === "pve-bots") { continue; }
			if (match.type !== "matchmaking") { continue; }

			// Update which game we are on, break if we met our goal
			game -= 1;

			// Need to get player details
			const playerDetails = AutocodeHelpers.GetPlayerDetailsForGamertag(gamertag, autocodeMatch);
			if (!playerDetails) { continue; }

			const isRanked = !!match.details?.playlist?.properties?.ranked;
			const secondsPlayed = match.duration?.seconds ?? 0;
			const map = match.details?.map?.name;

			// See if we have new bests
			EvaluateBestValues(match.id, playerDetails, bestMatches, map, bestMatchesPerMap);

			// Update filtered service records
			UpdateMap(mapSRs, mapFilters, map, playerDetails, isRanked, secondsPlayed);
			UpdateMap(variantSRs, variantFilters, match.details?.gamevariant?.name, playerDetails, isRanked, secondsPlayed);
			UpdateMap(playlistSRs, playlistFilters, match.details?.playlist?.name, playerDetails, isRanked, secondsPlayed);
			UpdateMap(outcomeSRs, outcomeFilters, playerDetails.outcome, playerDetails, isRanked, secondsPlayed);

			// Update service record overtime
			AutocodeHelpers.RemoveMatchFromServiceRecord(overtimeSR, playerDetails, isRanked, secondsPlayed);

			// Store history and update filters every 25 games
			if (game % 25 === 0 && game > 0)
			{
				// Populate maps
				await firebase.SetHistoricStatistics(app, gamertag, AutocodeHelpers.TrimHistoricServiceRecord(overtimeSR), game);
			}
		}
	} while (matches && matches.length > 0 && game > 0 && indexOfLastMatchID === -1);

	// Save filters, bests, last synced match, and anything else we need to wrap up
	await Promise.all([
		firebase.SetBest(app, gamertag, bestMatches),
		firebase.SetBestForMaps(app, gamertag, bestMatchesPerMap),
		firebase.SetLastSyncedMatchID(app, gamertag, newLastMatchIDSynced),
		firebase.SetFilteredServiceRecord(app, gamertag, firebase.ServiceRecordFilter.Map, mapSRs),
		firebase.SetFilteredServiceRecord(app, gamertag, firebase.ServiceRecordFilter.Variant, variantSRs),
		firebase.SetFilteredServiceRecord(app, gamertag, firebase.ServiceRecordFilter.Playlist, playlistSRs),
		firebase.SetFilteredServiceRecord(app, gamertag, firebase.ServiceRecordFilter.Outcome, outcomeSRs),
		firebase.SetAvailableFilters(app, gamertag, firebase.ServiceRecordFilter.Map, mapFilters),
		firebase.SetAvailableFilters(app, gamertag, firebase.ServiceRecordFilter.Variant, variantFilters),
		firebase.SetAvailableFilters(app, gamertag, firebase.ServiceRecordFilter.Playlist, playlistFilters),
		firebase.SetAvailableFilters(app, gamertag, firebase.ServiceRecordFilter.Outcome, outcomeFilters)
	]);

}
//#endregion

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const GetLatestStatistics = functions
	.runWith({ 
		timeoutSeconds: 540, 
		memory: "512MB" 
	}).https.onCall(async (data, context): Promise<boolean> =>
{
	// Check input
	const gamertag = data.gamertag;
	if (!gamertag) 
	{ 
		console.warn("No gamertag passed in.");
		return false; 
	}

	const app = admin.initializeApp();

	// Currently syncing this gamertag, don't do it double
	if (await firebase.GetIsSyncing(app, gamertag)) 
	{
		await app.delete();
		return false;
	}

	// Check if we need to sync at all
	const [lastPlayedMatchID, lastSyncedMatchID] = await Promise.all([
		autocode.GetLastMatchID(gamertag),
		firebase.GetLastSyncedMatchID(app, gamertag)
	]);

	// Check if this player has played any matches at all
	if (!lastPlayedMatchID) 
	{ 
		await app.delete();
		console.log(gamertag + " has not played any matches.");
		return false; 
	}

	// Check if the last synced match is the same as the current last match
	if (lastPlayedMatchID === lastSyncedMatchID) 
	{ 
		await app.delete();
		return false; 
	}

	// Get service record
	let [season1, season2, appearance] = await Promise.all([
		autocode.GetServiceRecord(gamertag, 1),
		autocode.GetServiceRecord(gamertag, 2),
		autocode.GetAppearance(gamertag),
		firebase.SetIsSyncing(app, gamertag, true)
	]).catch(() => 
	{
		return [false, false, false]; 
	});

	// Uh oh
	if (season1 === false || season2 === false || appearance === false)
	{
		await firebase.SetIsSyncing(app, gamertag, false);
		await app.delete();
		console.error("Something went wrong, check autocode logs.");
		return false; 
	}

	// Check if they don't have either of these seasons
	if (((season1 as any)?.error?.message?.includes("Specified season does not exist")))
	{
		season1 = AutocodeHelpers.CreateEmptyServiceRecord(gamertag);
	}
	else if ((season1 as any)?.error)
	{
		await firebase.SetIsSyncing(app, gamertag, false);
		await app.delete();
		console.error((season1 as any).error.message);
		return false; 
	}

	// Check if they don't have either of these seasons
	if (((season2 as any)?.error?.message?.includes("Specified season does not exist")))
	{
		season2 = AutocodeHelpers.CreateEmptyServiceRecord(gamertag);
	}
	else if ((season2 as any)?.error)
	{
		await firebase.SetIsSyncing(app, gamertag, false);
		await app.delete();
		console.error((season2 as any).error.message);
		return false; 
	}

	// Add service records together to get the total SR
	AutocodeHelpers.AddSRtoSR(season1 as AutocodeMultiplayerServiceRecord, season2 as AutocodeMultiplayerServiceRecord);

	// Otherwise update the current service record, appearance, and historic service record
	await Promise.all([
		firebase.SetServiceRecord(app, gamertag, season1 as AutocodeMultiplayerServiceRecord),
		firebase.SetAppearance(app, gamertag, appearance as AutocodeAppearance),
		LoopThroughMatches(app, gamertag, lastSyncedMatchID, season1 as AutocodeMultiplayerServiceRecord)
	]).finally(async () =>
	{
		// No longer syncing
		await firebase.SetIsSyncing(app, gamertag, false);
		// Clean up
		await app.delete();
	});

	return true;
});