import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as firebase from "./Helpers/SCFirebase";
import * as autocode from "./Helpers/SCAutocode";
import { AutocodeHelpers } from "./Helpers/Schemas/AutocodeHelpers";
import { AutocodeMatch, AutocodeMatchPlayer } from "./Helpers/Schemas/AutocodeMatch";
import { AutocodeMultiplayerServiceRecord } from "./Helpers/Schemas/AutocodeMultiplayerServiceRecord";
import { FirebaseBest, FirebaseMatchesBest } from "./Helpers/Schemas/FirebaseBest";

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
const UpdateMap = (srMap: Map<string, AutocodeMultiplayerServiceRecord>, filterMap: Map<string, number>, key: string | undefined, playerDetails: AutocodeMatchPlayer, secondsPlayed: number): void =>
{
	if (!key) { return; }
	
	// Update number of times in filter map
	filterMap.set(key, (filterMap.get(key) ?? 0) + 1);

	// Get service record if possible, and then subtract match and add back to map
	let sr = srMap.get(key);
	if (sr) { AutocodeHelpers.AddMatchToServiceRecord(sr, playerDetails, secondsPlayed); }
	else
	{ 
		sr = AutocodeHelpers.CreateServiceRecordFromMatch(playerDetails.details.name, playerDetails, secondsPlayed); 
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
 * @returns nothing but love
 */
const LoopThroughMatches = async (app: admin.app.App, gamertag: string): Promise<void> =>
{
	// Get previous SR, new SR, and bots SR
	const [prevBotGames, prevSR, newSR, botsSR] = await Promise.all([
		firebase.GetTotalBotGames(app, gamertag),
		firebase.GetServiceRecord(app, gamertag),
		autocode.GetServiceRecord(gamertag),
		autocode.GetServiceRecord(gamertag, undefined, "a446725e-b281-414c-a21e-31b8700e95a1")
	]);

	// If new SR has no games, return
	const prevTotalGames = prevSR?.data?.matches?.total ?? 0;
	const currTotalGames = newSR?.data?.matches?.total ?? 0;
	const currBotGames = botsSR?.data?.matches?.total ?? 0;
	if (currTotalGames === 0) 
	{ 
		console.error("Couldn't load autocode SR for " + gamertag);
		return; 
	}

	// See how many bot games were played since last time, if negative, something went wrong
	const botGamesPlayedSinceLastSync = (botsSR.data?.matches?.total ?? 0) - prevBotGames;
	if (botGamesPlayedSinceLastSync < 0) 
	{ 
		console.error("Bot games total is a negative number for " + gamertag);
		return; 
	}
	
	let matches: (AutocodeMatch | undefined)[] = [];

	// Setup maps to track filtered service records
	const mapSRs = new Map<string, AutocodeMultiplayerServiceRecord>();
	const modeSRs = new Map<string, AutocodeMultiplayerServiceRecord>();
	const outcomeSRs = new Map<string, AutocodeMultiplayerServiceRecord>();

	const mapFilters = new Map<string, number>();
	const modeFilters = new Map<string, number>();
	const outcomeFilters = new Map<string, number>();
	
	// Get previous filtered SRs and best matches
	const [filteredSRs, availableFilters, bestMatches, bestMatchesPerMap] = await Promise.all([
		firebase.GetAllFilteredServiceRecordsInRawJSON(app, gamertag),
		firebase.GetAvailableFilters(app, gamertag),
		firebase.GetBest(app, gamertag),
		firebase.GetBestForMaps(app, gamertag)
	]);
	
	// Populate maps
	PopulateSRMap(filteredSRs, firebase.ServiceRecordFilter.Map, mapSRs);
	PopulateSRMap(filteredSRs, firebase.ServiceRecordFilter.Mode, modeSRs);
	PopulateSRMap(filteredSRs, firebase.ServiceRecordFilter.Outcome, outcomeSRs);

	PopulateFilterMap(availableFilters, firebase.ServiceRecordFilter.Map, mapFilters);
	PopulateFilterMap(availableFilters, firebase.ServiceRecordFilter.Mode, modeFilters);
	PopulateFilterMap(availableFilters, firebase.ServiceRecordFilter.Outcome, outcomeFilters);

	// Get latest SR over time
	const overtimeSR = prevSR ?? AutocodeHelpers.CreateEmptyServiceRecord(gamertag);
	
	// Get number of matches played since last pull
	const matchesPlayedSinceLastPull: number = (currTotalGames - prevTotalGames) + (currBotGames - prevBotGames);
	let game = prevTotalGames;
	let remainingMatchesToQuery = matchesPlayedSinceLastPull;
	
	// Pull matches until we have the complete match history since the last query
	while (remainingMatchesToQuery > 0)
	{
		// Reset matches
		matches = [];

		// Determine number of matches we need to query during this iteration of the loop (max is 25)
		const queryCount = Math.min(remainingMatchesToQuery, 25);
		const offset = remainingMatchesToQuery - queryCount;
		const playerMatches = await autocode.GetPlayerMatches(gamertag, queryCount, offset);
		if (!playerMatches || !playerMatches.data || !playerMatches.data.matches) 
		{ 
			console.error("Player Matches were not returned. Skipping " + gamertag);
			return; 
		}

		const playerMatchResults = playerMatches.data.matches;
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
				console.error("AutocodeMatches returned nothing for " + matchIDsToGet + " for " + gamertag);
				return; 
			}
	
			// If this equals what we originally queried (aka firebase gave us no savings), set the matches and move on
			if (autocodeMatches.data.length === playerMatchResults.length)
			{
				matches = autocodeMatches.data;
				// Add to firebase
				if (gamertag === "BoundlessEcho")
				{
					for (const autocodeMatch of autocodeMatches.data) { await firebase.SetMatch(app, autocodeMatch.id, autocodeMatch); }
				}
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
					if (gamertag === "BoundlessEcho") { await firebase.SetMatch(app, autocodeMatch.id, autocodeMatch); }
				}
			}
		}

		// Loop through all matches for this query, index them, and store details to gamertag
		for (const autocodeMatch of matches)
		{
			remainingMatchesToQuery -= 1;
			if (!autocodeMatch) { continue; }

			// Match is required
			const match = autocodeMatch.match;
			if (!match || !match.id) { continue; }

			// We don't keep track of bot battles, so skip this
			if (match.experience === "pve-bots") { continue; }
			if (match.type !== "matchmaking") { continue; }

			// Update which game we are on
			game += 1;

			// Need to get player details
			const playerDetails = AutocodeHelpers.GetPlayerDetailsForGamertag(gamertag, autocodeMatch);
			if (!playerDetails) { continue; }

			const secondsPlayed = match.duration?.seconds ?? 0;
			const map = match.details?.map?.name;

			// See if we have new bests
			EvaluateBestValues(match.id, playerDetails, bestMatches, map, bestMatchesPerMap);

			// Update filtered service records
			UpdateMap(mapSRs, mapFilters, map, playerDetails, secondsPlayed);
			UpdateMap(modeSRs, modeFilters, match.details?.gamevariant?.name, playerDetails, secondsPlayed);
			UpdateMap(outcomeSRs, outcomeFilters, playerDetails.outcome, playerDetails, secondsPlayed);

			// Update service record overtime
			AutocodeHelpers.AddMatchToServiceRecord(overtimeSR, playerDetails, secondsPlayed);

			// Store history and update filters every 25 games
			if (game % 25 === 0)
			{
				// Populate maps
				await firebase.SetHistoricStatistics(app, gamertag, AutocodeHelpers.TrimHistoricServiceRecord(overtimeSR), game);
			}
		}
	}

	// Save filters, bests, last synced match, and anything else we need to wrap up
	await Promise.all([
		firebase.SetBest(app, gamertag, bestMatches),
		firebase.SetBestForMaps(app, gamertag, bestMatchesPerMap),
		firebase.SetServiceRecord(app, gamertag, newSR),
		firebase.SetTotalBotGames(app, gamertag, currBotGames),
		firebase.SetFilteredServiceRecord(app, gamertag, firebase.ServiceRecordFilter.Map, mapSRs),
		firebase.SetFilteredServiceRecord(app, gamertag, firebase.ServiceRecordFilter.Mode, modeSRs),
		firebase.SetFilteredServiceRecord(app, gamertag, firebase.ServiceRecordFilter.Outcome, outcomeSRs),
		firebase.SetAvailableFilters(app, gamertag, firebase.ServiceRecordFilter.Map, mapFilters),
		firebase.SetAvailableFilters(app, gamertag, firebase.ServiceRecordFilter.Mode, modeFilters),
		firebase.SetAvailableFilters(app, gamertag, firebase.ServiceRecordFilter.Outcome, outcomeFilters)
	]);

}

/**
 * Calculates the leaderboard averages given a specific leaderboard
 * @param app the app
 * @param leaderboard the leaderboard path 
 * @returns nothing but fun
 */
const CalculateLeaderboardAverages = async (app: admin.app.App, leaderboard: string) =>
{
	// Get leaders for the leaderboard
	const leaders = await firebase.GetLeaderboard(app, leaderboard);
	if (!leaders) { return; }

	// Get values and sort
	const values: number[] = Object.values(leaders);
	if (!values || values.length <= 0) { return; }

	// Filter out -1 for CSRs
	const filtered: number[] = leaderboard.includes("csr") ? values.filter(values => values !== -1) : values;
	if (!filtered || filtered.length <= 0) { return; }
	filtered.sort((a, b) => a - b);

	// Calculate all the statistics
	const count = filtered.length;

	// Median and quartiles
	const index25 = Math.floor(filtered.length / 4);
	const index50 = Math.floor(filtered.length / 2);
	const index75 = Math.floor(3 * filtered.length / 4);

	let q25 = -1;
	let q50 = -1;
	let q75 = -1;

	if (count % 2 !== 0) 
	{ 
		q25 = (filtered[index25 - 1] + filtered[index25]) / 2.0;
		q50 = (filtered[index50 - 1] + filtered[index50]) / 2.0;
		q75 = (filtered[index75 - 1] + filtered[index75]) / 2.0;
	}
	else
	{
		q25 = filtered[index25];
		q50 = filtered[index50];
		q75 = filtered[index75];
	}

	// Min and max
	const min = filtered[filtered.length - 1];
	const max = filtered[0];

	// Standard deviation and mean
	const mean = filtered.reduce((a, b) => a + b) / count;
	const std = Math.sqrt(filtered.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / count);

	// Set to firebase
	await firebase.SetLeaderboardAverages(app, leaderboard, mean, q50, q25, q75, std, min, max);
}
//#endregion

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

/**
 * Updates the additional statistics for allowed players
 * Runs every day at 12:00p
 */
export const UpdatePlayerFilters = functions
	.runWith({ 
		timeoutSeconds: 540, 
		memory: "512MB" 
	}).pubsub.schedule("every day 12:00")
	.timeZone("America/Chicago")
	.onRun(async (context) =>
{
	const app = admin.initializeApp();

	// Get all allowed gamertags
	const gamertags = await firebase.GetAllAllowed(app);
	if (!gamertags || gamertags.length === 0) 
	{ 
		console.error("WARNING: no gamertags found, nothing to update."); 
		await app.delete();
		return; 
	}

	await Promise.all(gamertags.map((gamertag) => LoopThroughMatches(app, gamertag))).finally(async () => 
	{
		// Clean up
		await app.delete();
	});

	return;
});

/**
 * Updates the leaderboard graphs
 * Runs every Tuesday at 10:00a
 */
export const UpdateLeaderboardGraph = functions
	.runWith({ 
		timeoutSeconds: 540, 
		memory: "512MB" 
	}).pubsub.schedule("every Tuesday 10:00")
	.timeZone("America/Chicago")
	.onRun(async (context) =>
{
	const app = admin.initializeApp();

	// All leaderboard paths
	const leaderboards = ["accuracy", "assists", "assists_per_game", "callouts", "csr/controller_soloduo", "csr/mnk_soloduo", "csr/open_crossplay", "damage", "deaths", "deaths_per_game", "kda", "kdr", "kills", "kills_per_game", "spartan_rank"];

	await Promise.all(leaderboards.map((leaderboard) => CalculateLeaderboardAverages(app, leaderboard))).finally(async () => 
	{
		// Clean up
		await app.delete();
	});

	return;
});