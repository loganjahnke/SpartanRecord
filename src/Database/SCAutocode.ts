import { Debugger } from "../Objects/Helpers/Debugger";
import { Appearance } from "../Objects/Model/Appearance";
import { Player } from "../Objects/Model/Player";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { AutocodeMatch, AutocodeMatchResults } from "./Schemas/AutocodeMatch";
import { AutocodeMultiplayerServiceRecord } from "./Schemas/AutocodeMultiplayerServiceRecord";
import { AutocodePlayerMatchResults } from "./Schemas/AutocodePlayerMatch";

export class SCAutocode
{
	/** Turns on or off debugging mode */
	private readonly IS_DEBUGGING = process.env.NODE_ENV !== "production";
	/** The HaloDotAPI version */
	private readonly AUTOCODE_VERSION = "1-3-2";
	/** The HaloDotAPI version */
	private readonly SEASON = 2;

	constructor() {}

	/**
	 * Gets the player from autocode if needed
	 * @param player the player
	 * @param matchCount the match count stored in firebase
	 * @returns 
	 */
	public async GetPlayerIfNeeded(player: Player, matchCount: number): Promise<number>
	{
		// Check if we need to update the service record
		if (player.gamertag && player.lastMatchID !== await this.GetLastMatchID(player.gamertag))
		{
			let newSR: ServiceRecord;
			[player.appearance, newSR] = await Promise.all([this.GetAppearance(player.gamertag), this.GetServiceRecord(player.gamertag)]);

			const gameDifference = newSR.matchesPlayed - matchCount;
			player.serviceRecord = newSR;
			
			return gameDifference;
		}

		return 0;
	}

	//#region Appearance
	/**
	 * Gets the gamertag's appearance from Firebase
	 * @param gamertag the gamertag to get the appearance of
	 * @returns the appearance
	 */
	public async GetAppearance(gamertag: string): Promise<Appearance>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCAutocode.GetAppearance()", gamertag); }
		return new Appearance(await this.__getPlayerAppearanceFromHaloDotAPI(gamertag));
	}
	//#endregion
 
	//#region Service Record
	/**
	 * Gets the service record for the gamertag from Firebase
	 * @param gamertag the gamertag to get the service record of
	 * @returns the service record for the gamertag
	 */
	public async GetServiceRecord(gamertag: string, season: number = this.SEASON): Promise<ServiceRecord>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCAutocode.GetServiceRecord()", gamertag); }
		return new ServiceRecord(await this.__getServiceRecordFromHaloDotAPI(gamertag, season));
	}
 
	/**
	 * Gets the historic statistics for a gamertag
	 * @param gamertag the gamertag to get the historic statistics of
	 * @returns an array of service records
	 */
	public async GetHistoricStatistics(gamertag: string): Promise<ServiceRecord[]>
	{
		return [];
	}
	//#endregion
 
	 //#region Last Match
	/**
	 * Gets the last stored match ID in firebase
	 * @param gamertag the gamertag to get the last match ID of
	 * @returns the last match ID or "" if there is none
	 */
	public async GetLastMatchID(gamertag: string): Promise<string>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCAutocode.GetLastMatchID()", gamertag); }
		 
		const lastMatch = await this.GetPlayerMatches(gamertag, 1, 0);
		if (lastMatch?.data && lastMatch.data.matches.length > 0)
		{
			return lastMatch.data.matches[0].id;
		}

		return "";
	}
	//#endregion

	//#region Communication with Autocode
	/**
	 * Gets the matches from HaloDotAPI for a specific gamertag
	 * @param gamertag the gamertag
	 */
	public async GetPlayerMatches(gamertag: string, count: number, offset: number): Promise<AutocodePlayerMatchResults>
	{
		const response = await fetch(`https://${this.AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/matches`, {
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
	public async GetMatchesForPlayer(gamertag: string, count: number, offset: number): Promise<AutocodeMatchResults>
	{
		const playerMatches = await this.GetPlayerMatches(gamertag, count, offset);
		return await this.GetMatches(playerMatches.data.matches.map(match => match.id));
	}

	/**
	 * Gets the match from HaloDotAPI
	 * @param id the match ID
	 */
	public async GetMatch(id: string): Promise<AutocodeMatch | undefined>
	{
		const matches = await this.GetMatches([id]);
		if (matches.data.length > 0)
		{
			return matches.data[0];
		}
	}

	/**
	 * Gets the matches from HaloDotAPI
	 * @param ids the match IDs
	 */
	public async GetMatches(ids: string[]): Promise<AutocodeMatchResults>
	{
		const response = await fetch(`https://${this.AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/match`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				ids: ids
			})
		});
	
		return await response.json();
	}

	/**
	 * Gets the campaign record from HaloDotAPI for a specific gamertag
	 * @param gamertag the gamertag
	 * @returns JSON result of the campaign record for a gamertag
	 */
	private async __getSCampaignRecordFromHaloDotAPI(gamertag: string): Promise<any>
	{
		const response = await fetch(`https://${this.AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/campaign_record`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({gamertag: gamertag})
		});

		return await response.json();
	}

	/**
	 * Gets the service record from HaloDotAPI for a specific gamertag
	 * @param gamertag the gamertag
	 * @returns JSON result of the service record for a gamertag
	 */
	private async __getServiceRecordFromHaloDotAPI(gamertag: string, season: number): Promise<AutocodeMultiplayerServiceRecord>
	{
		const response = await fetch(`https://${this.AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/service_record`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({gamertag: gamertag, season: season})
		});

		return await response.json() as AutocodeMultiplayerServiceRecord;
	}

	/**
	 * Gets the appearance from HaloDotAPI for a specific gamertag
	 * @param gamertag the gamertag
	 * @returns the URLs for the player appearance
	 */
	private async __getPlayerAppearanceFromHaloDotAPI(gamertag: string): Promise<any>
	{
		const response = await fetch(`https://${this.AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/appearance`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({gamertag: gamertag})
		});

		return await response.json();
	}
	//#endregion
}