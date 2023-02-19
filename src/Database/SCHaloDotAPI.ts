import moment from "moment";
import { Debugger } from "../Objects/Helpers/Debugger";
import { SR } from "../Objects/Helpers/Statics/SR";
import { Appearance } from "../Objects/Model/Appearance";
import { CSRS } from "../Objects/Model/CSRS";
import { Player } from "../Objects/Model/Player";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { MMR } from "../Objects/Pieces/MMR";
import { ServiceRecordType } from "./SCData";
import { AutocodeCSRS } from "./Schemas/AutocodeCSRS";
import { AutocodeMatch, AutocodeMatchResults } from "./Schemas/AutocodeMatch";
import { AutocodeMap, AutocodeMedal, AutocodePlaylist, AutocodeTeam, AutocodeVariant } from "./Schemas/AutocodeMetadata";
import { AutocodeMMR } from "./Schemas/AutocodeMMR";
import { AutocodeMultiplayerServiceRecord } from "./Schemas/AutocodeMultiplayerServiceRecord";
import { AutocodePlayerMatchResults } from "./Schemas/AutocodePlayerMatch";
import { AutocodeXboxProfile } from "./Schemas/AutocodeXboxProfile";

export class SCHaloDotAPI
{
	/** Turns on or off debugging mode */
	private readonly IS_DEBUGGING = process.env.NODE_ENV !== "production";

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
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCHaloDotAPI.GetMMR()", player.gamertag); }

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
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCHaloDotAPI.GetCSRS()", player.gamertag); }

		// Put this back to where it belongs
		if (season === -1) { season = undefined; }

		const csrsData = await this.__lib.halo.infinite["@" + (process.env.REACT_APP_HALO_API_VERSION ?? "1.4.0")].stats.players.csrs({
			gamertag: player.gamertag,
			season: season,
			version: !season ? undefined : (season === 1 ? 2 : 1)
		}) as AutocodeCSRS;
		
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
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCHaloDotAPI.GetAppearance()", player.gamertag); }
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
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCHaloDotAPI.GetServiceRecord()", player.gamertag); }
		player.serviceRecordData = await this.GetServiceRecordData(player, season === -1 ? undefined : season, playlistId, categoryId, type);
		player.serviceRecord = new ServiceRecord(player.serviceRecordData);
		player.gamertag = player.serviceRecordData?.additional?.parameters?.gamertag ?? player.gamertag;
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
	public async GetServiceRecordData(player: Player, season?: number, playlistId?: string, categoryId?: string, type?: ServiceRecordType): Promise<AutocodeMultiplayerServiceRecord>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCHaloDotAPI.GetServiceRecordData()", player.gamertag); }
		return await this.__getServiceRecordFromHaloDotAPI(player.gamertag, season === -1 ? undefined : season, playlistId, categoryId, type);
	}

	/**
	 * Gets the previous seasons' service records for the gamertag from Autocode
	 * @param player the player to get the service records of
	 * @returns the service records for the player
	 */
	public async GetOldSeasons(player: Player): Promise<AutocodeMultiplayerServiceRecord[]>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCHaloDotAPI.GetOldSeasons()", player.gamertag); }
		
		const srData: AutocodeMultiplayerServiceRecord[] = [];
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
	public async GetCurrentSeason(player: Player): Promise<AutocodeMultiplayerServiceRecord>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCHaloDotAPI.GetCurrentSeason()", player.gamertag); }
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
	 * Gets the playlists
	 */
	public async GetPlaylists(): Promise<AutocodePlaylist[]>
	{
		let result = await this.__lib.halo.infinite["@" + (process.env.REACT_APP_HALO_API_VERSION ?? "1.4.0")].metadata.multiplayer.playlists();		
		const playlists = result.data as AutocodePlaylist[];

		for (const playlist of playlists)
		{
			if (playlist.asset.id === "0299adc1-f07a-4b6c-8126-0c35ac2fa08d")
			{
				playlist.name = "Last Spartan Standing (Event)";
			}
			else if (playlist.asset.id === "edfef3ac-9cbe-4fa2-b949-8f29deafd483")
			{
				playlist.name = "Ranked Arena (Open Crossplay)";
			}
			else if (playlist.asset.id === "f7f30787-f607-436b-bdec-44c65bc2ecef")
			{
				playlist.name = "Ranked Arena (Solo-Duo Controller)";
			}
			else if (playlist.asset.id === "f7eb8c71-fedb-4696-8c0f-96025e285ffd")
			{
				playlist.name = "Ranked Arena (Solo-Duo MnK)";
			}
		}

		return playlists;
	}

	/**
	 * Gets the game variants
	 */
	public async GetVariants(): Promise<AutocodeVariant[]>
	{
		let result = await this.__lib.halo.infinite["@" + (process.env.REACT_APP_HALO_API_VERSION ?? "1.4.0")].metadata.multiplayer.gamevariants();		
		return result.data as AutocodeVariant[];
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

	 //#region Last Match
	/**
	 * Gets the last stored match ID in firebase
	 * @param gamertag the gamertag to get the last match ID of
	 * @returns the last match ID or "" if there is none
	 */
	public async GetLastMatchID(gamertag: string): Promise<string>
	{
		if (this.IS_DEBUGGING) { Debugger.Print(true, "SCHaloDotAPI.GetLastMatchID()", gamertag); }
		 
		const lastMatch = await this.GetPlayerMatches(gamertag, 1, 0);
		if (lastMatch?.data && lastMatch.data.length > 0)
		{
			return lastMatch.data[0].id;
		}

		return "";
	}
	//#endregion

	//#region Matches
	/**
	 * Gets all the matches for a player for a given date
	 * @param gamertag the gamertag
	 * @param date the date
	 * @returns the array of matches from that day
	 */
	public async GetMatchesForDay(gamertag: string, date: Date): Promise<AutocodeMatch[]>
	{		  
		let loadedAllGamesForDay = false;
		let offset = 0;

		const matches: AutocodeMatch[] = [];
		
		while (!loadedAllGamesForDay)
		{
			if (this.IS_DEBUGGING) { Debugger.Print(true, "SCHaloDotAPI.GetMatchesForDay()", `Gamertag: ${gamertag}, Offset: ${offset}`); }

			const results = await this.GetMatchesForPlayer(gamertag, 25, offset);
			for (const r of results.data)
			{
				if (!r.match) { return matches; }

				const matchDate = new Date(r.match.played_at);
				if (moment(date.toDateString()).isAfter(matchDate.toDateString()))
				{
					loadedAllGamesForDay = true;
					break;
				}
				
				if (moment(date.toDateString()).isSame(matchDate.toDateString())) { matches.push(r); }
			}

			offset += 25;
			if (offset > 125) { return matches; } // too much data!
		} 

		return matches;
	}

	/**
	 * Gets the matches from HaloDotAPI for a specific gamertag
	 * @param gamertag the gamertag
	 */
	public async GetPlayerMatches(gamertag: string, count: number, offset: number): Promise<AutocodePlayerMatchResults>
	{
		return await this.__lib.halo.infinite["@" + (process.env.REACT_APP_HALO_API_VERSION ?? "1.4.0")].stats.players.matches({
			gamertag: gamertag, // required
			type: "matchmaking",
			language: "en-us",
			count: count,
			offset: offset
		});
	}

	/**
	 * This gets the AutocodeMatch array for the player given a count and offset. This method is slow, requires two requests
	 * @param gamertag the gamertag
	 * @param count the number of matches to load, max of 25
	 * @param offset the offset
	 */
	public async GetMatchesForPlayer(gamertag: string, count: number, offset: number): Promise<AutocodeMatchResults>
	{
		const playerMatches = await this.GetPlayerMatches(gamertag, count, offset);
		return await this.GetMatches(playerMatches.data.map(match => match.id));
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
		return await this.__lib.halo.infinite["@" + (process.env.REACT_APP_HALO_API_VERSION ?? "1.4.0")].stats.matches({
			ids: ids,
			language: 'en-us'
		});
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
	private async __getServiceRecordFromHaloDotAPI(gamertag: string, season?: number, playlistId?: string, categoryId?: string, type?: ServiceRecordType): Promise<AutocodeMultiplayerServiceRecord>
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