import { AutocodeAppearance } from "./Schemas/AutocodeAppearance";
import { AutocodeMatch, AutocodeMatchResults } from "./Schemas/AutocodeMatch";
import { AutocodeMultiplayerServiceRecord } from "./Schemas/AutocodeMultiplayerServiceRecord";
import { AutocodePlayerMatchResults } from "./Schemas/AutocodePlayerMatch";

import fetch from "node-fetch";

/** The HaloDotAPI version */
const AUTOCODE_VERSION = "1-5-3";

/** The types of service records */
export enum ServiceRecordType
{
	all = "ALL",
	ranked = "RANKED",
	social = "SOCIAL",
	local = "LOCAL",
	custom = "CUSTOM"
}

//#region Appearance
/**
 * Gets the gamertag's appearance from Firebase
 * @param gamertag the gamertag to get the appearance of
 * @returns the appearance
 */
export const GetAppearance = async (gamertag: string): Promise<AutocodeAppearance> =>
{
	const response = await fetch(`https://${AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/appearance`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({gamertag: gamertag})
	});

	return await response.json() as AutocodeAppearance;
}
//#endregion

//#region Service Record
/**
 * Gets the service record for the gamertag from Autocode
 * @param gamertag the gamertag to get the service record of
 * @param season the season number
 * @param playlistId the playlist ID
 * @param categoryId the category ID
 * @param type the type of service record to get
 * @returns the service record for the gamertag
 */
export const GetServiceRecord = async (gamertag: string, season?: number, playlistId?: string, categoryId?: string, type?: ServiceRecordType): Promise<AutocodeMultiplayerServiceRecord> =>
{
	const response = await fetch(`https://${AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/service_record`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			gamertag: gamertag, 
			season: season ?? null,
			playlistId: playlistId ?? null,
			categoryId: categoryId ? +categoryId : null,
			type: type ?? ServiceRecordType.all
		})
	});

	return await response.json() as AutocodeMultiplayerServiceRecord;
}
//#endregion

	//#region Last Match
/**
 * Gets the last stored match ID in firebase
 * @param gamertag the gamertag to get the last match ID of
 * @returns the last match ID or "" if there is none
 */
export const GetLastMatchID = async (gamertag: string): Promise<string> =>
{		 
	const lastMatch = await GetPlayerMatches(gamertag, 1, 0);
	if (lastMatch?.data && lastMatch.data.length > 0)
	{
		return lastMatch.data[0].id;
	}

	return "";
}
//#endregion

//#region CSRS
/**
 * Gets the CSRS for the gamertag for the specified season
 * @param gamertag the gamertag
 * @param season the season
 * @returns the CSRS results
 */
export const GetCSRS = async (gamertag: string, season: number): Promise<any> =>
{
	const response = await fetch(`https://${AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/csrs`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			gamertag: gamertag,
			season: season
		})
	});

	return await response.json() as any;
}
//#endregion

//#region Communication with Autocode
/**
 * Gets the matches from HaloDotAPI for a specific gamertag
 * @param gamertag the gamertag
 */
export const GetPlayerMatches = async (gamertag: string, count: number, offset: number): Promise<AutocodePlayerMatchResults> =>
{
	const response = await fetch(`https://${AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/matches`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			gamertag: gamertag,
			count: count,
			offset: offset
		})
	});

	return await response.json() as AutocodePlayerMatchResults;
}

/**
 * This gets the AutocodeMatch array for the player given a count and offset. This method is slow, requires to requests
 * @param gamertag the gamertag
 * @param count the number of matches to load, max of 25
 * @param offset the offset
 */
export const GetMatchesForPlayer = async (gamertag: string, count: number, offset: number): Promise<AutocodeMatchResults> =>
{
	const playerMatches = await GetPlayerMatches(gamertag, count, offset);
	return await GetMatches(playerMatches.data.map(match => match.id));
}

/**
 * Gets the match from HaloDotAPI
 * @param id the match ID
 */
export const GetMatch = async (id: string): Promise<AutocodeMatch | undefined> =>
{
	const matches = await GetMatches([id]);
	if (matches.data.length > 0)
	{
		return matches.data[0];
	}

	return undefined;
}

/**
 * Gets the matches from HaloDotAPI
 * @param ids the match IDs
 */
export const GetMatches = async (ids: string[]): Promise<AutocodeMatchResults> =>
{
	const response = await fetch(`https://${AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/match`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			ids: ids
		})
	});

	return await response.json() as AutocodeMatchResults;
}
//#endregion