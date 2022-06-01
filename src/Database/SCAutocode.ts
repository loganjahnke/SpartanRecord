import { Debugger } from "../Objects/Helpers/Debugger";
import { Appearance } from "../Objects/Model/Appearance";
import { CSRS } from "../Objects/Model/CSRS";
import { Player } from "../Objects/Model/Player";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { MMR } from "../Objects/Pieces/MMR";
import { AutocodeAppearance } from "./Schemas/AutocodeAppearance";
import { AutocodeCSRS } from "./Schemas/AutocodeCSRS";
import { AutocodeMatch, AutocodeMatchResults } from "./Schemas/AutocodeMatch";
import { AutocodeMap, AutocodeMedal, AutocodePlaylist, AutocodeTeam, AutocodeVariant } from "./Schemas/AutocodeMetadata";
import { AutocodeMMR } from "./Schemas/AutocodeMMR";
import { AutocodeMultiplayerServiceRecord } from "./Schemas/AutocodeMultiplayerServiceRecord";
import { AutocodePlayerMatchResults } from "./Schemas/AutocodePlayerMatch";

export enum ServiceRecordType
{
	all = "ALL",
	ranked = "RANKED",
	social = "SOCIAL",
	local = "LOCAL",
	custom = "CUSTOM"
}

export class SCAutocode
{
	/** Turns on or off debugging mode */
	private readonly IS_DEBUGGING = process.env.NODE_ENV !== "production";
	/** The HaloDotAPI version */
	private readonly AUTOCODE_VERSION = "1-4-8";

	constructor() {}

	/**
	 * Gets the player from autocode
	 * @param gamertag the gamertag
	 * @param season the season
	 * @returns 
	 */
	public async GetPlayer(gamertag: string, season: number): Promise<Player>
	{
		const player = new Player(gamertag);
		await Promise.all([this.GetAppearance(player), this.GetServiceRecord(player, season), this.GetMMR(player), this.GetCSRS(player, season)]);
		return player;
	}

	//#region Combined Result
	/**
	 * Gets a player from autocode
	 * @param gamertag the gamertag
	 * @param season the season
	 * @param mmr
	 * @returns the player
	 */
	public async GetAllPlayerEndpoints(gamertag: string, season: number, mmr: MMR): Promise<Player>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCAutocode.GetAllPlayerEndpoints()", gamertag); }

		const player = new Player(gamertag, undefined, undefined, undefined, mmr);

		const response = await fetch(`https://${this.AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/player`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				gamertag: gamertag,
				season: season === -1 ? undefined : season
			})
		});

		const data = await response.json() as { service_record: AutocodeMultiplayerServiceRecord, appearance: AutocodeAppearance, csrs: AutocodeCSRS, mmr: AutocodeMMR };
		if (!data) { return player; }

		player.serviceRecord = new ServiceRecord(data.service_record);
		player.appearance = new Appearance(data.appearance);

		player.serviceRecordData = data.service_record;
		player.appearanceData = data.appearance;

		player.gamertag = player.serviceRecordData?.additional?.parameters?.gamertag ?? player.gamertag;

		// CSRS
		if (data.csrs) { player.csrs = data.csrs.data.map(iter => new CSRS(iter)); }
		
		// MMR
		if (data.mmr)
		{
			if (data.mmr.data.playlist?.name === "Last Spartan Standing")
			{
				player.mmr.lastSpartanStanding = data.mmr.data.value ?? 0;
			}
			else
			{
				player.mmr.ffa = data.mmr.data.value ?? 0;
			}
		}

		return player;
	}
	//#endregion

	//#region MMR and CSRS
	/**
	 * Gets the MMR of the gamertag
	 * @param player the player to get the MMR of
	 */
	public async GetMMR(player: Player): Promise<void>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCAutocode.GetMMR()", player.gamertag); }

		const response = await fetch(`https://${this.AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/mmr`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				gamertag: player.gamertag
			})
		});

		const mmrData = await response.json() as AutocodeMMR;

		if (mmrData && mmrData.data)
		{
			if (mmrData.data.playlist?.name === "Last Spartan Standing")
			{
				player.mmr.lastSpartanStanding = mmrData.data.value ?? 0;
			}
			else
			{
				player.mmr.ffa = mmrData.data.value ?? 0;
			}
		}
	}

	/**
	 * Gets the player's CSRS
	 * @param player the player
	 * @param season the season
	 */
	public async GetCSRS(player: Player, season: number): Promise<void>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCAutocode.GetCSRS()", player.gamertag); }

		const response = await fetch(`https://${this.AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/csrs`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				gamertag: player.gamertag,
				season: season === -1 ? undefined : season
			})
		});

		if (!response) { return; }
		const csrsData = await response.json() as AutocodeCSRS;
		
		if (!csrsData || !csrsData.data) { return; }
		player.csrs = csrsData.data.map(iter => new CSRS(iter));
	}
	//#endregion

	//#region Appearance
	/**
	 * Gets the gamertag's appearance from Firebase
	 * @param player the player to set the appearance of
	 * @returns the appearance
	 */
	public async GetAppearance(player: Player): Promise<void>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCAutocode.GetAppearance()", player.gamertag); }
		player.appearanceData = await this.__getPlayerAppearanceFromHaloDotAPI(player.gamertag);
		player.appearance = new Appearance(player.appearanceData);
	}
	//#endregion
 
	//#region Service Record
	/**
	 * Gets the service record for the gamertag from Autocode
	 * @param player the gamertag to get the service record of
	 * @param season the season number
	 * @param playlistId the playlist ID
	 * @param categoryId the category ID
	 * @param type the type of service record to get
	 * @returns the service record for the gamertag
	 */
	public async GetServiceRecord(player: Player, season?: number, playlistId?: string, categoryId?: string, type?: ServiceRecordType): Promise<void>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCAutocode.GetServiceRecord()", player.gamertag); }
		player.serviceRecordData = await this.__getServiceRecordFromHaloDotAPI(player.gamertag, season === -1 ? undefined : season, playlistId, categoryId, type);
		player.serviceRecord = new ServiceRecord(player.serviceRecordData);
		player.gamertag = player.serviceRecordData?.additional?.parameters?.gamertag ?? player.gamertag;
	}
	//#endregion
 
	//#region Filters
	/**
	 * Gets the maps
	 */
	public async GetMaps(): Promise<AutocodeMap[]>
	{
		const response = await fetch(`https://${this.AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/metadata/maps`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				ids: []
			})
		});

		return await response.json() as AutocodeMap[];
	}

	/**
	 * Gets the maps
	 */
	public async GetPlaylists(): Promise<AutocodePlaylist[]>
	{
		const response = await fetch(`https://${this.AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/metadata/playlists`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				ids: []
			})
		});

		const data = await response.json();

		return data as AutocodePlaylist[];
	}

	/**
	 * Gets the game variants
	 */
	public async GetVariants(): Promise<AutocodeVariant[]>
	{
		const response = await fetch(`https://${this.AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/metadata/variants`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				ids: []
			})
		});

		return await response.json() as AutocodeVariant[];
	}

	/**
	 * Gets the medals
	 */
	public async GetMedals(ids: string[] = []): Promise<AutocodeMedal[]>
	{
		const response = await fetch(`https://${this.AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/metadata/medals`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				ids: ids
			})
		});

		return await response.json() as AutocodeMedal[];
	}

	/**
	 * Gets the teams
	 */
	public async GetTeams(): Promise<AutocodeTeam[]>
	{
		const response = await fetch(`https://${this.AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/metadata/teams`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				ids: []
			})
		});

		return await response.json() as AutocodeTeam[];
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
	 * Gets the service record for the gamertag from Autocode
	 * @param gamertag the gamertag to get the service record of
	 * @param season the season number
	 * @param playlistId the playlist ID
	 * @param categoryId the category ID
	 * @param type the type of service record to get
	 * @returns the service record for the gamertag
	 */
	private async __getServiceRecordFromHaloDotAPI(gamertag: string, season?: number, playlistId?: string, categoryId?: string, type?: ServiceRecordType): Promise<AutocodeMultiplayerServiceRecord>
	{
		const response = await fetch(`https://${this.AUTOCODE_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/service_record`, {
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