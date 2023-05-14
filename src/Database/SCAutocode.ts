import moment from "moment";
import { Debugger } from "../Objects/Helpers/Debugger";
import { SR } from "../Objects/Helpers/Statics/SR";
import { Appearance } from "../Objects/Model/Appearance";
import { CSRS } from "../Objects/Model/CSRS";
import { Player } from "../Objects/Model/Player";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { ServiceRecordType } from "./SCData";
import { CSRSchema } from "./Schemas/CSRSchema";
import { AutocodeMap, AutocodeMedal, AutocodeTeam } from "./Schemas/AutocodeMetadata";
import { AutocodeMMR } from "./Schemas/AutocodeMMR";
import { ServiceRecordSchema } from "./Schemas/ServiceRecordSchema";
import { AutocodeXboxProfile } from "./Schemas/AutocodeXboxProfile";

export class SCAutocode
{
	private __lib: any;

	constructor() 
	{
		this.__lib = require("lib")({token: process.env.REACT_APP_HALO_API_TOKEN});
	}

	/**
	 * Gets the player from HaloDotAPI
	 * @param gamertag the gamertag
	 * @param season the season
	 * @returns the player
	 */
	public async GetPlayer(gamertag: string, season?: number): Promise<Player>
	{
		const player = new Player(gamertag);
		await Promise.all([
			this.GetAppearance(player), 
			this.GetServiceRecord(player, season),
			this.GetCSRS(player, season)
		]).catch(error => {
			player.serviceRecord.error = error?.message ?? "Could not load player";
		});
		return player;
	}

	/**
	 * Gets the player from HaloDotAPI for leaderboard population
	 * @param gamertag the gamertag
	 * @returns the player
	 */
	public async GetPlayerForLeaderboard(gamertag: string): Promise<Player>
	{
		const player = new Player(gamertag);
		await Promise.all([this.GetServiceRecord(player), this.GetCSRS(player)]).catch(error => {
			player.serviceRecord.error = error?.message ?? "Could not load player";
		});
		return player;
	}

	//#region MMR and CSRS
	/**
	 * Gets the MMR of the gamertag
	 * @param player the player to get the MMR of
	 */
	public async GetMMR(player: Player): Promise<void>
	{
		Debugger.Print("SCAutocode", "GetMMR()", player.gamertag);

		const mmrData = await this.__lib.halo.infinite["@" + (process.env.REACT_APP_HALO_API_VERSION ?? "1.4.0")].stats.players.mmr({
			gamertag: player.gamertag,
			kind: "free-for-all"
		}) as AutocodeMMR;

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
	public async GetCSRS(player: Player, season?: number): Promise<void>
	{
		Debugger.Print("SCAutocode", "GetCSRS()", player.gamertag);

		// Put this back to where it belongs
		if (season === -1) { season = undefined; }

		const csrsData = await this.__lib.halo.infinite["@" + (process.env.REACT_APP_HALO_API_VERSION ?? "1.4.0")].stats.players.csrs({
			gamertag: player.gamertag,
			season: season,
			version: !season ? undefined : (season === 1 ? 2 : 1)
		}) as CSRSchema;
		
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
		Debugger.Print("SCAutocode", "GetAppearance()", player.gamertag);
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
		Debugger.Print("SCAutocode", "GetServiceRecord()", player.gamertag);
		player.serviceRecordData = await this.GetServiceRecordData(player, season === -1 ? undefined : season, playlistId, categoryId, type);
		player.serviceRecord = new ServiceRecord(player.serviceRecordData);
		//player.gamertag = player.serviceRecordData?.additional?.parameters?.gamertag ?? player.gamertag;
	}

	/**
	 * Gets the service record for the gamertag from Autocode
	 * @param player the gamertag to get the service record of
	 * @param season the season number
	 * @param playlistId the playlist ID
	 * @param categoryId the category ID
	 * @param type the type of service record to get
	 * @returns the service record for the gamertag
	 */
	public async GetServiceRecordData(player: Player, season?: number, playlistId?: string, categoryId?: string, type?: ServiceRecordType): Promise<ServiceRecordSchema>
	{
		Debugger.Print("SCAutocode", "GetServiceRecordData()", player.gamertag);
		return await this.__getServiceRecordFromHaloDotAPI(player.gamertag, season === -1 ? undefined : season, playlistId, categoryId, type);
	}

	/**
	 * Gets the previous seasons' service records for the gamertag from Autocode
	 * @param player the player to get the service records of
	 * @returns the service records for the player
	 */
	public async GetOldSeasons(player: Player): Promise<ServiceRecordSchema[]>
	{
		Debugger.Print("SCAutocode", "GetOldSeasons()", player.gamertag);
		
		const srData: ServiceRecordSchema[] = [];
		for (let i = 0; i < SR.Season - 1; i++)
		{
			srData.push(await this.__getServiceRecordFromHaloDotAPI(player.gamertag, i + 1));
		}
		
		return srData;
	}

	/**
	 * Gets the current season's service record for the gamertag from Autocode
	 * @param player the player to get the current season's service record of
	 * @returns the service record for the player
	 */
	public async GetCurrentSeason(player: Player): Promise<ServiceRecordSchema>
	{
		Debugger.Print("SCAutocode", "GetCurrentSeason()", player.gamertag);
		return this.__getServiceRecordFromHaloDotAPI(player.gamertag, SR.Season);
	}
	//#endregion
 
	//#region Filters
	/**
	 * Gets the maps
	 */
	public async GetMaps(): Promise<AutocodeMap[]>
	{
		let result = await this.__lib.halo.infinite["@" + (process.env.REACT_APP_HALO_API_VERSION ?? "1.4.0")].metadata.multiplayer.maps();		
		return result.data as AutocodeMap[];
	}

	/**
	 * Gets the medals
	 */
	public async GetMedals(ids: string[] = []): Promise<AutocodeMedal[]>
	{
		let result = await this.__lib.halo.infinite["@" + (process.env.REACT_APP_HALO_API_VERSION ?? "1.4.0")].metadata.multiplayer.medals({
			ids: ids
		});

		return result.data as AutocodeMedal[];
	}

	/**
	 * Gets the teams
	 */
	public async GetTeams(): Promise<AutocodeTeam[]>
	{
		let result = await this.__lib.halo.infinite["@" + (process.env.REACT_APP_HALO_API_VERSION ?? "1.4.0")].metadata.multiplayer.teams();		
		return result.data as AutocodeTeam[];
	}
	//#endregion

	//#region Communication with Autocode
	/**
	 * Checks if a gamertag is a valid gamertag
	 * @param gamertag the gamertag
	 * @returns the gamertag in its official form if valid, empty string otherwise
	 */
	public async IsValidGamertag(gamertag: string): Promise<string>
	{
		const json = await this.__lib.halo.infinite["@" + (process.env.REACT_APP_HALO_API_VERSION ?? "1.4.0")].tooling['xbox-network'].players.profile({
			gamertag: gamertag // required
		}) as AutocodeXboxProfile;
		
		return json?.data?.player?.gamertag || "";
	}

	/**
	 * Gets the campaign record from HaloDotAPI for a specific gamertag
	 * @param gamertag the gamertag
	 * @returns JSON result of the campaign record for a gamertag
	 */
	private async __getSCampaignRecordFromHaloDotAPI(gamertag: string): Promise<any>
	{
		const response = await fetch(`https://${"@" + process.env.REACT_APP_HALO_API_VERSION}--ArrowheadCompany.loganjahnke.autocode.gg/campaign_record`, {
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
	private async __getServiceRecordFromHaloDotAPI(gamertag: string, season?: number, playlistId?: string, categoryId?: string, type?: ServiceRecordType): Promise<ServiceRecordSchema>
	{
		const params: any = {};
		params.gamertag = gamertag;
		if (season !== undefined && season !== -1) { params.season = season; }
		if (playlistId) { params.playlist_id = playlistId; }
		if (categoryId) { params.category_id = +categoryId; }
		  
		let result;
		
		switch (type)
		{
			case ServiceRecordType.all:
				result = await this.__lib.halo.infinite["@" + (process.env.REACT_APP_HALO_API_VERSION ?? "1.4.0")].stats.players['service-record'].multiplayer.matchmade.all(params);
				break;
			case ServiceRecordType.ranked:
				result = await this.__lib.halo.infinite["@" + (process.env.REACT_APP_HALO_API_VERSION ?? "1.4.0")].stats.players['service-record'].multiplayer.matchmade.ranked(params);
				break;
			case ServiceRecordType.social:
				result = await this.__lib.halo.infinite["@" + (process.env.REACT_APP_HALO_API_VERSION ?? "1.4.0")].stats.players['service-record'].multiplayer.matchmade.social(params);
				break;
			case ServiceRecordType.local:
				result = await this.__lib.halo.infinite["@" + (process.env.REACT_APP_HALO_API_VERSION ?? "1.4.0")].stats.players['service-record'].multiplayer['non-matchmade'].local(params);
				break;
			case ServiceRecordType.custom:
				result = await this.__lib.halo.infinite["@" + (process.env.REACT_APP_HALO_API_VERSION ?? "1.4.0")].stats.players['service-record'].multiplayer['non-matchmade'].custom(params);
				break;
			default:
				result = await this.__lib.halo.infinite["@" + (process.env.REACT_APP_HALO_API_VERSION ?? "1.4.0")].stats.players['service-record'].multiplayer.matchmade.all(params);
				break;
		}
		
		
		return result;
	}

	/**
	 * Gets the appearance from HaloDotAPI for a specific gamertag
	 * @param gamertag the gamertag
	 * @returns the URLs for the player appearance
	 */
	private async __getPlayerAppearanceFromHaloDotAPI(gamertag: string): Promise<any>
	{
		return await this.__lib.halo.infinite["@" + (process.env.REACT_APP_HALO_API_VERSION ?? "1.4.0")].appearance.players['spartan-id']({
			gamertag: gamertag
		});
	}
	//#endregion
}