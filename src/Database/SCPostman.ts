import moment from "moment";
import { Debugger } from "../Objects/Helpers/Debugger";
import { Appearance } from "../Objects/Model/Appearance";
import { CSRS } from "../Objects/Model/CSRS";
import { Player } from "../Objects/Model/Player";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { ServiceRecordType } from "./SCData";
import { CSRSchema } from "./Schemas/CSRSchema";
import { AutocodeMap, AutocodeMedal, HaloDotAPIPlaylist, HaloDotAPISeason, AutocodeTeam, HaloDotAPICategory, HaloDotAPIStoreOffering, HaloDotAPIStore } from "./Schemas/AutocodeMetadata";
import { ServiceRecordSchema } from "./Schemas/ServiceRecordSchema";
import axios from "axios";
import { PlayerMatchWithOddsSchema } from "./Schemas/PlayerMatchSchema";
import { MatchSchema } from "./Schemas/MatchSchema";
import { PlaylistWeights } from "../Objects/Pieces/PlaylistWeights";
import { HaloDotAPIClip, HaloDotAPIClips } from "./Schemas/HaloDotAPIClip";
import { CareerRankSchema } from "./Schemas/CareerRankSchema";

export class SCPostman
{
	private __playlists: HaloDotAPIPlaylist[];
	private __playlistWeights: Map<string, PlaylistWeights>;
	private __version: string;

	constructor() 
	{
		this.__playlists = [];
		this.__playlistWeights = new Map<string, PlaylistWeights>();
		this.__version = "";	
	}

	/**
	 * Gets the player from HaloDotAPI
	 * @param gamertag the gamertag
	 * @param season the season identifier
	 * @returns the player
	 */
	public async GetPlayer(gamertag: string, season?: string): Promise<Player>
	{
		const player = new Player(gamertag);
		await Promise.all([
			this.GetAppearance(player), 
			this.GetServiceRecord(player, season),
			this.GetCSRS(player, season),
			this.GetCareerRank(player)
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
	public async GetMMR(_player: Player): Promise<void>
	{
		
	}

	/**
	 * Gets the player's CSRS
	 * @param player the player
	 * @param season the CSR season identifier
	 */
	public async GetCSRS(player: Player, season?: string | null): Promise<void>
	{
		Debugger.Print("SCPostman", "GetCSRS()", player.gamertag);

		if (!season) 
		{ 
			const current = await this.__getCurrentSeason(); 
			season = current?.properties.csr;
		}
		if (!season) { return; }

		const csrsData = await this.__fetch(`/games/halo-infinite/stats/multiplayer/players/${player.gamertag}/csrs?season_csr=${season}`) as CSRSchema;
		
		if (!csrsData || !csrsData.data) { return; }
		player.csrs = csrsData.data.map(iter => new CSRS(iter));
	}
	//#endregion

	//#region Career Rank
	/**
	 * Sets the career rank for the player object
	 * @param player the player
	 */
	public async GetCareerRank(player: Player): Promise<void>
	{
		Debugger.Print("SCPostman", "GetCareerRank()", player.gamertag);
		const careerRankData = await this.__fetch(`/games/halo-infinite/stats/multiplayer/players/${player.gamertag}/career-rank`) as CareerRankSchema;
		player.careerRank = careerRankData;
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
		Debugger.Print("SCPostman", "GetAppearance()", player.gamertag);
		player.appearanceData = await this.__getPlayerAppearanceFromHaloDotAPI(player.gamertag);
		player.appearance = new Appearance(player.appearanceData);
	}
	//#endregion
 
	//#region Service Record
	/**
	 * Gets the service record for the gamertag from Autocode
	 * @param player the gamertag to get the service record of
	 * @param season the season identifier
	 * @param playlistId the playlist ID
	 * @param categoryId the category ID
	 * @param type the type of service record to get
	 * @returns the service record for the gamertag
	 */
	public async GetServiceRecord(player: Player, season?: string, playlistId?: string, categoryId?: string, type?: ServiceRecordType): Promise<void>
	{
		Debugger.Print("SCPostman", "GetServiceRecord()", player.gamertag);
		player.serviceRecordData = await this.GetServiceRecordData(player, season, playlistId, categoryId, type);
		player.serviceRecord = new ServiceRecord(player.serviceRecordData);
	}

	/**
	 * Gets the service record for the gamertag from Autocode
	 * @param player the gamertag to get the service record of
	 * @param season the season identifier
	 * @param playlistId the playlist ID
	 * @param categoryId the category ID
	 * @param type the type of service record to get
	 * @returns the service record for the gamertag
	 */
	public async GetServiceRecordData(player: Player, season?: string, playlistId?: string, categoryId?: string, type?: ServiceRecordType): Promise<ServiceRecordSchema>
	{
		Debugger.Print("SCPostman", "GetServiceRecordData()", player.gamertag);
		return await this.__getServiceRecordFromHaloDotAPI(player.gamertag, season, playlistId, categoryId, type);
	}

	/**
	 * Gets the previous seasons' service records for the gamertag from Autocode
	 * @param player the player to get the service records of
	 * @param seasons the season identifiers
	 * @returns the service records for the player
	 */
	public async GetOldSeasonsStats(player: Player, seasons: string[]): Promise<ServiceRecordSchema[]>
	{
		if (!seasons || seasons.length === 0) { return []; }

		Debugger.Print("SCPostman", "GetOldSeasonsStats()", player.gamertag);
		
		const srData: ServiceRecordSchema[] = [];
		for (let i = 0; i < seasons.length - 1; i++)
		{
			srData.push(await this.__getServiceRecordFromHaloDotAPI(player.gamertag, seasons[i]));
		}
		
		return srData;
	}

	/**
	 * Gets the current season's service record for the gamertag from Autocode
	 * @param player the player to get the current season's service record of
	 * @param currentSeason the current season identifier
	 * @returns the service record for the player
	 */
	public async GetCurrSeasonStats(player: Player, currentSeason: string): Promise<ServiceRecordSchema>
	{
		Debugger.Print("SCPostman", "GetCurrSeasonStats()", player.gamertag);
		return this.__getServiceRecordFromHaloDotAPI(player.gamertag, currentSeason);
	}
	//#endregion
 
	//#region Filters
	/**
	 * Gets the maps
	 */
	public async GetMaps(): Promise<AutocodeMap[]>
	{
		const result = await this.__fetch("/games/halo-infinite/metadata/multiplayer/maps");
		return result.data as AutocodeMap[];
	}

	/**
	 * Gets the playlists
	 */
	public async GetPlaylists(): Promise<HaloDotAPIPlaylist[]>
	{
		if (this.__playlists && this.__playlists.length > 0) { return this.__playlists; }

		const result = await this.__fetch("/games/halo-infinite/metadata/multiplayer/playlists");
		const playlists = result.data as HaloDotAPIPlaylist[];

		for (const playlist of playlists)
		{
			if (playlist.id === "0299adc1-f07a-4b6c-8126-0c35ac2fa08d")
			{
				playlist.name = "Last Spartan Standing (Event)";
			}
			else if (playlist.id === "edfef3ac-9cbe-4fa2-b949-8f29deafd483")
			{
				playlist.name = "Ranked Arena (Open Crossplay)";
			}
			else if (playlist.id === "f7f30787-f607-436b-bdec-44c65bc2ecef")
			{
				playlist.name = "Ranked Arena (Solo-Duo Controller)";
			}
			else if (playlist.id === "f7eb8c71-fedb-4696-8c0f-96025e285ffd")
			{
				playlist.name = "Ranked Arena (Solo-Duo MnK)";
			}
		}

		this.__playlists = playlists;
		return playlists;
	}

	/**
	 * Gets the playlist weights
	 */
	public async GetPlaylistWeights(): Promise<Map<string, PlaylistWeights>>
	{
		if (this.__playlistWeights && this.__playlistWeights.size > 0) { return this.__playlistWeights; }

		const playlists = await this.GetPlaylists();
		const playlistWeights = new Map<string, PlaylistWeights>();

		for (const playlist of playlists)
		{
			playlistWeights.set(playlist.id, new PlaylistWeights(playlist));
		}

		this.__playlistWeights = playlistWeights;
		return playlistWeights;
	}

	/**
	 * Gets the game variants
	 */
	public async GetVariants(): Promise<HaloDotAPICategory[]>
	{
		const result = await this.__fetch("/games/halo-infinite/metadata/multiplayer/modes/categories");
		return result.data as HaloDotAPICategory[];
	}

	/**
	 * Gets the medals
	 */
	public async GetMedals(): Promise<AutocodeMedal[]>
	{
		const result = await this.__fetch("/games/halo-infinite/metadata/multiplayer/medals");
		return result.data as AutocodeMedal[];
	}

	/**
	 * Gets the teams
	 */
	public async GetTeams(): Promise<AutocodeTeam[]>
	{
		const result = await this.__fetch("/games/halo-infinite/metadata/multiplayer/teams");
		return result.data as AutocodeTeam[];
	}

	/**
	 * Gets the seasons
	 * @returns the seasons
	 */
	public async GetSeasons(): Promise<HaloDotAPISeason[]>
	{
		const result = await this.__fetch("/games/halo-infinite/metadata/multiplayer/seasons");
		return result.data as HaloDotAPISeason[];
	}

	/**
	 * Gets the store
	 * @returns the store items
	 */
	public async GetStore(): Promise<HaloDotAPIStoreOffering[]>
	{
		const result = await this.__fetch("/games/halo-infinite/stores/main") as HaloDotAPIStore;
		return result.data.offerings;
	}

	/**
	 * Gets the clips for a gamertag
	 * @returns the clips
	 */
	public async GetClips(gamertag: string): Promise<HaloDotAPIClip[]>
	{
		const result = await this.__fetch(`/games/halo-infinite/media/players/${gamertag}/clips`) as HaloDotAPIClips;
		return result.data;
	}

	/**
	 * Gets the current season
	 * @returns the current season
	 */
	private async __getCurrentSeason(): Promise<HaloDotAPISeason | null>
	{
		const seasons = await this.GetSeasons();
		if (!seasons || seasons.length === 0) { return null; }
		return seasons[seasons.length - 1];
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
		Debugger.Print("SCPostman", "GetLastMatchID()", gamertag);
		 
		const lastMatch = await this.GetPlayerMatches(gamertag, 1, 0);
		if (lastMatch && lastMatch.length > 0)
		{
			return lastMatch[0].id;
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
	public async GetMatchesForDay(gamertag: string, date: Date): Promise<MatchSchema[]>
	{		  
		let loadedAllGamesForDay = false;
		let offset = 0;

		const matches: MatchSchema[] = [];
		
		while (!loadedAllGamesForDay)
		{
			Debugger.Print("SCPostman", "GetMatchesForDay()", `Gamertag: ${gamertag}, Offset: ${offset}`);

			const results = await this.GetMatchesForPlayer(gamertag, 25, offset);
			for (const r of results)
			{
				if (!r.data) { return matches; }

				const matchDate = new Date(r.data.started_at);
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
	 * @param count the number of matches to get
	 * @param offset the offset
	 * @param customs get custom games?
	 * @param local get local games?
	 */
	public async GetPlayerMatches(gamertag: string, count: number, offset: number, customs?: boolean, local?: boolean): Promise<PlayerMatchWithOddsSchema[]>
	{
		// Prepare params
		const typeParam = SCPostman.__param("type", customs ? "custom" : local ? "local" : "matchmaking");
		const countParam = SCPostman.__param("count", count, true);
		const offsetParam = SCPostman.__param("offset", offset, true);
		
		// Get matches
		const results = await this.__fetch(`/games/halo-infinite/stats/multiplayer/players/${gamertag}/matches${typeParam}${countParam}${offsetParam}`);
		if (customs || local) { return results.data; }

		// Get playlists to see the likelihood of that match experience
		const odds = await this.GetPlaylistWeights();

		// Set the odds
		const matches = results.data as PlayerMatchWithOddsSchema[];
		for (const match of matches)
		{
			if (!odds.has(match.details.playlist.id)) { continue; }
			const weights = odds.get(match.details.playlist.id);

			const key = match.details.ugcgamevariant.name + " on " + match.details.map.name;
			if (!weights || !weights.odds.has(key)) { continue; }

			match.odds = weights.odds.get(key) ?? 0;
		}

		return matches;
	}

	/**
	 * This gets the AutocodeMatch array for the player given a count and offset. This method is slow, requires two requests
	 * @param gamertag the gamertag
	 * @param count the number of matches to load, max of 25
	 * @param offset the offset
	 */
	public async GetMatchesForPlayer(gamertag: string, count: number, offset: number): Promise<MatchSchema[]>
	{
		const playerMatches = await this.GetPlayerMatches(gamertag, count, offset);
		return await this.GetMatches(playerMatches.map(match => match.id));
	}

	/**
	 * Gets the match from HaloDotAPI
	 * @param id the match ID
	 */
	public async GetMatch(id: string): Promise<MatchSchema | undefined>
	{
		const matches = await this.GetMatches([id]);
		if (matches.length > 0)
		{
			return matches[0];
		}
	}

	/**
	 * Gets the matches from HaloDotAPI
	 * @param ids the match IDs
	 */
	public async GetMatches(ids: string[]): Promise<MatchSchema[]>
	{
		return await Promise.all(ids.map(id => this.__fetch(`/games/halo-infinite/stats/multiplayer/matches/${id}`)));
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
		const details = await this.__fetch(`/tooling/xbox-network/players/${gamertag}/details`);
		return details?.data?.gamertag ?? "";
	}

	/**
	 * Gets the API version
	 */
	public async GetVersion(): Promise<string>
	{
		if (this.__version) { return this.__version; }
		const details = await this.__fetch("/tooling/api/details");
		this.__version = details?.data?.versions?.latest;
		return this.__version;
	}

	/**
	 * Gets the campaign record from HaloDotAPI for a specific gamertag
	 * @param gamertag the gamertag
	 * @returns JSON result of the campaign record for a gamertag
	 */
	private async __getSCampaignRecordFromHaloDotAPI(gamertag: string): Promise<any>
	{
		return await this.__fetch(`/games/halo-infinite/stats/campaign/players/${gamertag}/service-record`);
	}

	/**
	 * Gets the service record for the gamertag from Autocode
	 * @param gamertag the gamertag to get the service record of
	 * @param season the season identifier
	 * @param playlistId the playlist ID
	 * @param categoryId the category ID
	 * @param type the type of service record to get
	 * @returns the service record for the gamertag
	 */
	private async __getServiceRecordFromHaloDotAPI(gamertag: string, season?: string, playlistId?: string, categoryId?: string, type?: ServiceRecordType): Promise<ServiceRecordSchema>
	{
		let node = "";
		let filterParam = "";
		
		switch (type)
		{
			case ServiceRecordType.ranked:
				node = "matchmade";
				filterParam = SCPostman.__param("filter", "ranked");
				break;
			case ServiceRecordType.social:
				node = "matchmade";
				filterParam = SCPostman.__param("filter", "social");
				break;
			case ServiceRecordType.local:
				node = "non-matchmade";
				filterParam = SCPostman.__param("type", "local");
				break;
			case ServiceRecordType.custom:
				node = "non-matchmade";
				filterParam = SCPostman.__param("type", "custom");
				break;
			case ServiceRecordType.all:
			default:
				node = "matchmade";
				filterParam = SCPostman.__param("filter", "all");
				break;
		}

		const playlistParam = SCPostman.__param("playlist_id", playlistId, true);
		const seasonParam = SCPostman.__param("season_id", season, true);
		const categoryParam = SCPostman.__param("category_id", categoryId, true);
		
		Debugger.Simple("SCPostman", "__getServiceRecord...", `${node}${filterParam}${playlistParam}${categoryParam}${seasonParam}`);

		return await this.__fetch(`/games/halo-infinite/stats/multiplayer/players/${gamertag}/service-record/${node}${filterParam}${playlistParam}${categoryParam}${seasonParam}`);
	}

	/**
	 * Gets the appearance from HaloDotAPI for a specific gamertag
	 * @param gamertag the gamertag
	 * @returns the URLs for the player appearance
	 */
	private async __getPlayerAppearanceFromHaloDotAPI(gamertag: string): Promise<any>
	{
		return await this.__fetch(`/games/halo-infinite/appearance/players/${gamertag}/spartan-id`);
	}
	//#endregion

	//#region Private Static
	/**
	 * Fetches the JSON of a URL
	 * @param node the node to fetch
	 * @returns the JSON result
	 */
	private async __fetch(node: string): Promise<any>
	{
		node = encodeURIComponent(node);

		let config = {
			method: "get",
			maxBodyLength: Infinity,
			url: "https://sr-nextjs.vercel.app/api/halodotapi?path=" + node,
		};

		let result: any;
		try
		{
			result = await axios.request(config);
		}
		catch (error: any)
		{
			console.log(error);
		}

		return result?.data;
	}

	/**
	 * Creates a param
	 * @param node the node
	 * @param value the value
	 * @returns the param string
	 */
	private static __param(node: string, value?: string | number, append?: boolean): string
	{
		if (!node || value === undefined || value === "") { return ""; }
		return `${append ? "&" : "?"}${node}=${value}`;
	}
	//#endregion
}