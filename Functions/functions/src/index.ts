import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import * as functions from "firebase-functions";
import fetch from "node-fetch";
import { Match } from "./Match";
import { ServiceRecord } from "./ServiceRecord";
import { Outcome } from "./Shared";

//#region AutoCode
const AutoCodeVersion = "0-3-8";

/**
 * Gets the service record from HaloDotAPI for a specific gamertag
 * @param gamertag the gamertag
 * @returns JSON result of the service record for a gamertag
 */
const GetServiceRecordFromHaloDotAPI = async (gamertag: string): Promise<any> =>
{
	const response = await fetch(`https://${AutoCodeVersion}--ArrowheadCompany.loganjahnke.autocode.gg/service_record`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({gamertag: gamertag})
	});

	return await response.json();
};

/**
 * Gets the appearance from HaloDotAPI for a specific gamertag
 * @param gamertag the gamertag
 * @returns the URLs for the player appearance
 */
const GetPlayerAppearanceFromHaloDotAPI = async (gamertag: string): Promise<any> =>
{
	const response = await fetch(`https://${AutoCodeVersion}--ArrowheadCompany.loganjahnke.autocode.gg/appearance`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({gamertag: gamertag})
	});

	return await response.json();
};

/**
 * Gets the appearance from HaloDotAPI for a specific gamertag
 * @param gamertag the gamertag
 * @returns the URLs for the player appearance
 */
const GetMatchesFromHaloDotAPI = async (gamertag: string, count: number, offset: number): Promise<any> =>
{
	const response = await fetch(`https://${AutoCodeVersion}--ArrowheadCompany.loganjahnke.autocode.gg/matches`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			gamertag: gamertag,
			count: count,
			offset: offset
		})
	});

	return await response.json();
};

/**
 * Gets the appearance from HaloDotAPI for a specific gamertag
 * @param gamertag the gamertag
 * @returns the URLs for the player appearance
 */
 const GetCSRSFromHaloDotAPI = async (gamertag: string, season: number): Promise<any> =>
 {
	 const response = await fetch(`https://${AutoCodeVersion}--ArrowheadCompany.loganjahnke.autocode.gg/csrs`, {
		 method: "POST",
		 headers: { "Content-Type": "application/json" },
		 body: JSON.stringify({
			 gamertag: gamertag,
			 season: season
		 })
	 });
 
	 return await response.json();
 };
//#endregion

//#region Helpers
/**
 * Trims a JSON service record to make the download skinnier
 * @param sr the JSON service record
 */
const TrimServiceRecord = (sr: any): void =>
{
	// Remove additional tag, it just isn't needed
	if (sr?.additional)
	{
		delete sr.additional;
	}

	// Remove medal URLs and names, we can look this up on the client
	if (sr?.data?.core?.breakdowns?.medals)
	{
		for (let i = 0; i < sr.data.core.breakdowns.medals.length; i++)
		{
			delete sr.data.core.breakdowns.medals[i].image_urls;
			delete sr.data.core.breakdowns.medals[i].name;
		}
	}
};

/**
 * Gets the gamertags for the spartan company
 * @param app the firebase connecter
 * @returns array of gamertags
 */
const GetGamertags = async (app: admin.app.App): Promise<string[]> =>
{
	const gamertagsSnapshot = await app.database().ref(`members`).get();
	return Object.keys(gamertagsSnapshot?.val() ?? {});
};

/**
 * Gets the mode for the match
 * @param match the match
 * @returns the string mode
 */
const GetMode = (match: Match): string | undefined =>
{
	const playlist: string | undefined = match.details?.playlist?.name;
	const category: string | undefined = match.details?.category?.name;

	if (playlist === "Tactical Slayer" || playlist === "FFA Slayer")
	{
		return playlist;
	}

	return category;
}

/**
 * Adds the match outcome to the service record
 * @param sr the service record
 * @param outcome the outcome
 */
const AddOutcome = (sr: ServiceRecord, outcome: Outcome): void =>
{
	switch (outcome)
	{
		case Outcome.win: 
			sr.data.core.breakdowns.matches.wins += 1;
			break;
		case Outcome.lose: 
			sr.data.core.breakdowns.matches.losses += 1;
			break;
		case Outcome.tie: 
			sr.data.core.breakdowns.matches.draws += 1;
			break;
		case Outcome.left: 
			sr.data.core.breakdowns.matches.left += 1;
			break;
	}
};

/**
 * Creates a service record based on the match
 * @param match the match
 * @returns new service record
 */
const CreateServiceRecord = (match?: Match): ServiceRecord =>
{
	// Get core statistics
	const newCore = match?.player?.stats?.core;

	const sr: ServiceRecord = {
		data: {
			win_rate: 0,
			matches_played: match ? 1 : 0,
			core: {
				kda: 0,
				kdr: 0,
				total_score: newCore?.score ?? 0,
				summary: {
					kills: newCore?.summary?.kills ?? 0,
					deaths: newCore?.summary?.deaths ?? 0,
					assists: newCore?.summary?.assists ?? 0,
					medals: newCore?.summary?.medals ?? 0,
					suicides: newCore?.summary?.suicides ?? 0,
					betrayals: newCore?.summary?.betrayals ?? 0,
					vehicles: {
						destroys: newCore?.summary?.vehicles.destroys ?? 0,
						hijacks: newCore?.summary?.vehicles.hijacks ?? 0,
					}
				},
				breakdowns: {
					kills: {
						grenades: newCore?.breakdowns?.kills?.grenades ?? 0,
						headshots: newCore?.breakdowns?.kills?.headshots ?? 0,
						melee: newCore?.breakdowns?.kills?.melee ?? 0,
						power_weapons: newCore?.breakdowns?.kills?.power_weapons ?? 0,
					},
					assists: {
						callouts: newCore?.breakdowns?.assists?.callouts ?? 0,
						driver: newCore?.breakdowns?.assists?.driver ?? 0,
						emp: newCore?.breakdowns?.assists?.emp ?? 0,
					},
					matches: {
						wins: match?.player?.outcome === Outcome.win ? 1 : 0,
						losses: match?.player?.outcome === Outcome.lose ? 1 : 0,
						draws: match?.player?.outcome === Outcome.tie ? 1 : 0,
						left: match?.player?.outcome === Outcome.left ? 1 : 0,
					}
				},
				damage: {
					dealt: newCore?.damage?.dealt ?? 0,
					taken: newCore?.damage?.taken ?? 0,
				},
				shots: {
					fired: newCore?.shots?.fired ?? 0,
					landed: newCore?.shots?.landed ?? 0,
					missed: newCore?.shots?.missed ?? 0,
					accuracy: 0
				}
			},
			time_played: {
				seconds: match?.duration?.seconds ?? 0,
				human: ""
			}
		},
		additional: {}
	}

	// Get calculated properties
	UpdateCalculatedProperties(sr);
	return sr;
};

/**
 * Adds a match to the service record
 * @param sr the service record
 * @param match the match
 */
const AddMatch = (sr: ServiceRecord, match: Match): void =>
{
	// Get core statistics
	const newCore = match?.player?.stats?.core;
	if (!newCore) { return; }

	// Add outcome and matches played
	AddOutcome(sr, match.player.outcome);
	sr.data.matches_played += 1;

	// Add score
	sr.data.core.total_score += newCore.score;

	// Add summary stats
	sr.data.core.summary.kills += newCore.summary.kills;
	sr.data.core.summary.deaths += newCore.summary.deaths;
	sr.data.core.summary.assists += newCore.summary.assists;
	sr.data.core.summary.medals += newCore.summary.medals;
	sr.data.core.summary.suicides += newCore.summary.suicides;
	sr.data.core.summary.betrayals += newCore.summary.betrayals;
	sr.data.core.summary.vehicles.destroys += newCore.summary.vehicles.destroys;
	sr.data.core.summary.vehicles.hijacks += newCore.summary.vehicles.hijacks;

	// Add kill breakdowns
	sr.data.core.breakdowns.kills.grenades += newCore.breakdowns.kills.grenades;
	sr.data.core.breakdowns.kills.headshots += newCore.breakdowns.kills.headshots;
	sr.data.core.breakdowns.kills.melee += newCore.breakdowns.kills.melee;
	sr.data.core.breakdowns.kills.power_weapons += newCore.breakdowns.kills.power_weapons;

	// Add assist breakdowns
	sr.data.core.breakdowns.assists.callouts += newCore.breakdowns.assists.callouts;
	sr.data.core.breakdowns.assists.driver += newCore.breakdowns.assists.driver;
	sr.data.core.breakdowns.assists.emp += newCore.breakdowns.assists.emp;

	// Add damage stats
	sr.data.core.damage.dealt += newCore.damage.dealt;
	sr.data.core.damage.taken += newCore.damage.taken;

	// Add shot stats
	sr.data.core.shots.fired += newCore.shots.fired;
	sr.data.core.shots.landed += newCore.shots.landed;
	sr.data.core.shots.missed += newCore.shots.missed;

	// Add duration
	sr.data.time_played.seconds += match.duration?.seconds ?? 0;

	// Get calculated properties
	UpdateCalculatedProperties(sr);
};

/**
 * Calculates KDA, KDR, accuracy, and win rate
 * @param sr the service record to update
 */
const UpdateCalculatedProperties = (sr: ServiceRecord) =>
{
	// Exit if we don't have the necessary data
	if (!sr?.data?.core) { return; }

	const kills = sr.data.core.summary?.kills ?? 0;
	const assists = sr.data.core.summary?.assists ?? 0;
	const deaths = sr.data.core.summary?.deaths ?? 0;
	const wins = sr.data.core.breakdowns?.matches?.wins ?? 0;
	const matches = sr.data.matches_played ?? 0;
	const shotsLanded = sr.data.core.shots?.landed ?? 0;
	const shotsFired = sr.data.core.shots?.fired ?? 0;

	// Calculate win rate and KDA
	if (matches > 0)
	{
		sr.data.win_rate = (wins / matches) * 100;
		sr.data.core.kda = (kills + (assists / 3) - deaths) / matches;
	}

	// Calculate KDR
	if (deaths > 0)
	{
		sr.data.core.kdr = kills / deaths;
	}

	// Calculate accuracy
	if (shotsFired > 0)
	{
		sr.data.core.shots.accuracy = (shotsLanded / shotsFired) * 100;
	}
}

/**
 * Populates the map with the data for the given key
 * @param data the data JSON
 * @param key the key to loop through in data
 * @param map the map to populate
 */
const PopulateMap = (data: any, key: keyof any, map: Map<string, ServiceRecord>): void =>
{
	if (!data) { return; }
	const tree = data[key] ?? {};

	let k: keyof any;
	for (k in tree)
	{
		const sr: ServiceRecord = tree[k];
		if (sr) { map.set(k, sr); }
	}
};

/**
 * Sets the CSRS for the gamertag
 * @param app the firebase app
 * @param gamertag the gamertag
 */
const UpdateCSRS = async (app: admin.app.App, gamertag: string): Promise<void> =>
{
	// Get appearance from HaloDotAPI and then save into Firebase
	const seasonSnapshot = await app.database().ref(`season`).get();
	const newCSRS = await GetCSRSFromHaloDotAPI(gamertag, seasonSnapshot?.exists() ? seasonSnapshot.val() : 1);
	if (newCSRS) { await app.database().ref(`csrs/${gamertag}`).set(newCSRS); }
}

/**
 * Sets the appearance for the gamertag
 * @param app the firebase app
 * @param gamertag the gamertag
 */
const SetAppearance = async (app: admin.app.App, gamertag: string): Promise<void> =>
{
	// Get appearance from HaloDotAPI and then save into Firebase
	const newAppearance = await GetPlayerAppearanceFromHaloDotAPI(gamertag);
	if (newAppearance) { await app.database().ref(`appearance/${gamertag}`).set(newAppearance); }
}

const LoopThroughMatches = async (app: admin.app.App, gamertag: string, newMatchesPlayed: number, curMatchesPlayed?: number, curSR?: admin.database.DataSnapshot): Promise<void> =>
{
	// Setup maps to track filtered service records
	const mapSRs = new Map<string, ServiceRecord>();
	const modeSRs = new Map<string, ServiceRecord>();
	const outcomeSRs = new Map<string, ServiceRecord>();
	const isRankedSRs = new Map<string, ServiceRecord>();

	// Get previous filtered SRs
	if (curSR)
	{
		const filteredSRsSnapshot = await app.database().ref(`service_record/filtered/${gamertag}`).get();
		const filteredSRs = filteredSRsSnapshot?.exists() ? filteredSRsSnapshot.val() : {};
	
		// Populate maps
		PopulateMap(filteredSRs, "map", mapSRs);
		PopulateMap(filteredSRs, "mode", modeSRs);
		PopulateMap(filteredSRs, "outcome", outcomeSRs);
		PopulateMap(filteredSRs, "isRanked", isRankedSRs);
	}

	// Get number of matches played since last pull
	const matchesPlayedSinceLastPull: number = newMatchesPlayed - (curMatchesPlayed ?? 0);
	let remainingMatchesToQuery = matchesPlayedSinceLastPull;

	// Get latest SR over time
	const srOverTime: ServiceRecord = curSR?.exists() ? curSR?.val() : CreateServiceRecord();
	
	// Pull matches until we have the complete match history since the last query
	while (remainingMatchesToQuery > 0)
	{
		// Determine number of matches we need to query during this iteration of the loop (max is 25)
		const queryCount = Math.min(remainingMatchesToQuery, 25);
		const offset = remainingMatchesToQuery - queryCount;
		const matches = await GetMatchesFromHaloDotAPI(gamertag, queryCount, offset);
		const matchesArray = matches?.data ?? [];

		// Loop through all matches for this query, index them, and store details to gamertag
		let match: Match;
		for (match of matchesArray)
		{
			// Looping through
			remainingMatchesToQuery -= 1;

			// Match ID is required
			const id: string = match?.id;
			if (!id) { continue; }

			// Map
			const map = match.details?.map?.name;
			if (map)
			{
				// Service Record
				let sr = mapSRs.get(map);
				if (sr) { AddMatch(sr, match); }
				else
				{ 
					sr = CreateServiceRecord(match); 
					mapSRs.set(map, sr);
				}
			}

			// Mode
			const mode = GetMode(match);
			if (mode)
			{
				// Service Record
				let sr = modeSRs.get(mode);
				if (sr) { AddMatch(sr, match); }
				else
				{ 
					sr = CreateServiceRecord(match); 
					modeSRs.set(mode, sr);
				}
			}

			// Outcome
			const outcome = match.player?.outcome;
			if (outcome)
			{
				// Service Record
				let sr = outcomeSRs.get(outcome);
				if (sr) { AddMatch(sr, match); }
				else
				{ 
					sr = CreateServiceRecord(match); 
					outcomeSRs.set(outcome, sr);
				}
			}

			// Map
			const isRanked = String(match.details?.playlist?.properties?.ranked ?? false);
			if (true)
			{
				// Service Record
				let sr = isRankedSRs.get(isRanked);
				if (sr) { AddMatch(sr, match); }
				else
				{ 
					sr = CreateServiceRecord(match); 
					isRankedSRs.set(isRanked, sr);
				}
			}

			// Update service record overtime
			AddMatch(srOverTime, match);
			const game = newMatchesPlayed - remainingMatchesToQuery;
			if (game % 25 === 0)
			{
				TrimServiceRecord(srOverTime);
				await app.database().ref(`service_record/historic/${gamertag}`).update({ [game]: srOverTime });
			}
		}
	}

	// Populate maps
	await UpdateFilteredSR(app, gamertag, "map", mapSRs);
	await UpdateFilteredSR(app, gamertag, "mode", modeSRs);
	await UpdateFilteredSR(app, gamertag, "outcome", outcomeSRs);
	await UpdateFilteredSR(app, gamertag, "isRanked", isRankedSRs);
}

/**
 * Updates the filtered SRs for the gamertag
 * @param app the firebase app
 * @param gamertag the gamertag
 * @param key the key we are updating
 * @param map the map of data
 */
const UpdateFilteredSR = async (app: admin.app.App, gamertag: string, key: string, map: Map<string, ServiceRecord>): Promise<void> =>
{
	let data = Object.fromEntries(map);
	await app.database().ref(`service_record/filtered/${gamertag}/${key}`).update(data);
}
//#endregion

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const serviceRecords = functions
	.runWith({ 
		timeoutSeconds: 540, 
		memory: "512MB" 
	}).pubsub.schedule("every day 12:00")
	.timeZone("America/Chicago")
	.onRun(async (context) => 
{
	const app = admin.initializeApp();

	// Get the gamertags that we are going to update
	const gamertags = await GetGamertags(app);
	if (!gamertags || gamertags.length === 0) 
	{ 
		console.log("WARNING: no gamertags found, nothing to update."); 
		await app.delete();
		return; 
	}

	// Loop through all gamertags
	for (const gamertag of gamertags)
	{
		//#region Service Record
		// Get new service record from HaloDotAPI and current from Firebase
		const newSR = await GetServiceRecordFromHaloDotAPI(gamertag);
		if (newSR?.error)
		{
			console.log(`ERROR: could not get new service record for ${gamertag}: ${newSR.error.message}`);
			continue;
		}

		// Get matches played from both
		const newMatchesPlayed = newSR?.data?.matches_played;
		const curSR = await app.database().ref(`service_record/current/${gamertag}`).get();
		const curMatchesPlayed = curSR.exists() ? curSR?.val()?.data?.matches_played : 0;

		// If we don't have any new matches since last query, skip the other queries
		if (!newMatchesPlayed || newMatchesPlayed <= curMatchesPlayed) { continue; }
		console.log(`${gamertag} has ${newMatchesPlayed - curMatchesPlayed} new matches to process.`);

		// Delete extraneous medal data to keep it thin
		TrimServiceRecord(newSR);

		// Otherwise update the current service record
		await app.database().ref(`service_record/current/${gamertag}`).set(newSR);
		//#endregion

		await SetAppearance(app, gamertag);
		await UpdateCSRS(app, gamertag);
		await LoopThroughMatches(app, gamertag, newMatchesPlayed, curMatchesPlayed, curSR);
	}

	// Finally, update current pull and last update
	return app.database().ref(`query_facts`).set(
	{
		last_update: firestore.Timestamp.fromDate(new Date())
	}).then(res => 
	{
		app.delete().then(() => res).catch(() => null);
	}).catch(error =>
	{
		app.delete().then(() => Promise.reject(error)).catch(() => null);
	});
});

interface NewUserResponse
{
	success?: boolean;
	message?: string;
}

export const getNewUserStats = functions
	.runWith({ 
		timeoutSeconds: 540, 
		memory: "512MB" 
	}).https.onCall(async (data, context): Promise<NewUserResponse> =>
{
	// Check input
	const gamertag = data.gamertag;
	if (!gamertag) 
	{ 
		const result = { message: "No gamertag passed in." };
		console.log(result);
		return result; 
	}

	const app = admin.initializeApp();
	
	//#region Service Record
	// Get new service record from HaloDotAPI and current from Firebase
	const existsCheck = await app.database().ref(`members/${gamertag}`).get();
	if (existsCheck.exists()) 
	{ 
		await app.delete();
		const result = { success: true, message: "This gamertag is already part of the daily processing." };
		console.log(result.message);
		return result; 
	}

	// Add to member list
	await app.database().ref(`members`).update({ [gamertag]: true});

	// Get service record
	const newSR = await GetServiceRecordFromHaloDotAPI(gamertag);
	if (newSR?.error)
	{
		await app.delete();
		const result = { message: newSR.error.message };
		console.log(result.message);
		return result; 
	}

	const newMatchesPlayed = newSR?.data?.matches_played;

	// If we don't have any new matches since last query, skip the other queries
	console.log(`New user: ${gamertag} has ${newMatchesPlayed} matches to parse.`);
	if (!newMatchesPlayed) 
	{ 
		await app.delete();
		const result = { success: true, message: "This gamertag does not have any matches to parse." };
		console.log(result);
		return result; 
	}

	// Delete extraneous medal data to keep it thin
	TrimServiceRecord(newSR);

	// Otherwise update the current service record
	await app.database().ref(`service_record/current/${gamertag}`).set(newSR);
	//#endregion

	await SetAppearance(app, gamertag);
	await UpdateCSRS(app, gamertag);
	await LoopThroughMatches(app, gamertag, newMatchesPlayed);

	// Clean up
	await app.delete();

	return { success: true };
});