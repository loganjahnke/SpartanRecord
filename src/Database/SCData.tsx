import { App } from "firebase-admin/app";
import { Analytics } from "firebase/analytics";
import { Database } from "firebase/database";
import moment from "moment";
import { Leader, LeaderboardAverages } from "../Objects/Model/Leader";
import { Match } from "../Objects/Model/Match";
import { Player } from "../Objects/Model/Player";
import { PlayerMatch } from "../Objects/Model/PlayerMatch";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { SRFilter } from "../Objects/Pieces/SRFilter";
import { Leaderboard, ServiceRecordFilter } from "./ArrowheadFirebase";
import { Logger } from "./Logger";
import { SCFirebase } from "./SCFirebase";
import { AutocodeMap, AutocodeMedal, HaloDotAPIPlaylist, AutocodeTeam, HaloDotAPICategory, HaloDotAPISeason, HaloDotAPIStoreOffering } from "./Schemas/AutocodeMetadata";
import { ServiceRecordSchema } from "./Schemas/ServiceRecordSchema";
import { FirebaseBest } from "./Schemas/FirebaseBest";
import { SCPostman } from "./SCPostman";
import { PlaylistWeights } from "../Objects/Pieces/PlaylistWeights";
import { HaloDotAPIClip } from "./Schemas/HaloDotAPIClip";

/** The types of service records */
export enum ServiceRecordType
{
	all = "ALL",
	ranked = "RANKED",
	social = "SOCIAL",
	local = "LOCAL",
	custom = "CUSTOM"
}

export class SCData
{
    public app: App;
    public logger: Logger;
    public firebase: SCFirebase;
    public halodapi: SCPostman;
    private __seasons: HaloDotAPISeason[];

    private __currentlySyncing: Set<string>;

    /**
     * Creates a new application manager
     * @param app the firebase app
     * @param database the database manager
     * @param analytics the analytics manager
     */
    constructor(app: App, database: Database, analytics: Analytics)
    {
        this.app = app;
        this.logger = new Logger(analytics);
        this.firebase = new SCFirebase(database);
        this.halodapi = new SCPostman(this.firebase);
        this.__seasons = [];
        this.__currentlySyncing = new Set<string>();

        this.SetVersion();
    }

    //#region Sync Check
    /** Adds a gamertag to the sync set */
    public AddToSyncing = (gamertag: string) => this.__currentlySyncing.add(gamertag);

    /** Removes a gamertag from the sync set */
    public RemoveFromSyncing = (gamertag: string) => this.__currentlySyncing.delete(gamertag);
    
    /** Tells the caller if the gamertag is currently being synced */
    public IsSyncing = (gamertag: string) => this.__currentlySyncing.has(gamertag);
    //#endregion

    //#region Gets
    /**
	 * Checks if a gamertag is a valid gamertag
	 * @param gamertag the gamertag
	 * @returns the gamertag in its official form if valid, empty string otherwise
	 */
    public async IsValidGamertag(gamertag: string): Promise<string>
    {
        const valid = await this.halodapi.IsValidGamertag(gamertag);
        return valid;
    }

    /**
     * Gets the player's appearance from firebase
     * @param gamertag the gamertag
     * @returns the player
     */
    public async GetPlayerAppearanceOnly(gamertag: string): Promise<Player>
    {
        const player = new Player(gamertag);
        
        // Try to get from firebase
        const [firebaseAppearance] = await Promise.all([
            this.firebase.GetAppearance(gamertag)
        ]);

        if (firebaseAppearance) { player.appearance = firebaseAppearance; }
        if (firebaseAppearance) { return player; }

        if (!await this.CanUpdate()) { return player; }

        // Otherwise get from HaloDotAPI
        await Promise.all([this.halodapi.GetAppearance(player)]);
        if (player.appearanceData) { this.firebase.SetAppearance(gamertag, player.appearanceData); }

        // Update counter

        return player;
    }

    /**
     * Gets the player's appearance from firebase
     * @param gamertag the gamertag
     * @returns the player
     */
    public async GetPlayerAppearanceAndCROnly(gamertag: string): Promise<Player>
    {
        const player = new Player(gamertag);
        
        // Try to get from firebase
        const [firebaseAppearance, firebaseCareerRank] = await Promise.all([
            this.firebase.GetAppearance(gamertag),
            this.firebase.GetCareerRank(gamertag)
        ]);

        if (firebaseAppearance) { player.appearance = firebaseAppearance; }
        if (firebaseCareerRank) { player.careerRank = firebaseCareerRank; }
        if (firebaseAppearance && firebaseCareerRank) { return player; }

        // Otherwise get from HaloDotAPI
        await Promise.all([this.halodapi.GetAppearance(player), this.halodapi.GetCareerRank(player)])
        if (player.appearanceData) { this.firebase.SetAppearance(gamertag, player.appearanceData); }
        if (player.careerRank) { this.firebase.SetCareerRank(gamertag, player.careerRank); }

        // Update counter
        this.firebase.CountAPIUsage(2);

        return player;
    }

    /**
     * Gets a player from firebase
     * @param gamertag the gamertag
     * @param season the season identifier
     * @param historic the historic SRs
     * @returns player object
     */
    public async GetPlayerFromFirebase(gamertag: string, season?: string, historic?: boolean): Promise<Player>
	{
        const correct = await this.firebase.GetGamertag(gamertag);
		const player = new Player(correct);
		await this.firebase.GetPlayer(player, season, historic);
		return player;
	}

    /**
	 * Determines if the previous season's are cached for a given gamertag
	 * @param gamertag the gamertag to evaluate
	 * @returns true if we have these seasons saved in Firebase
	 */
    public async DoesPlayerHavePrevSeasons(gamertag: string): Promise<boolean> 
    {
        const seasons = await this.GetSeasons();
        return await this.firebase.HasHistoricSeasonsCached(gamertag, seasons);
    }

    /**
	 * Sets a previous season's statistics
	 * @param gamertag the gamertag to set the historic statistics for
	 * @param season the season identifier we are saving
	 * @param sr the service record
	 */
	public SetPreviousSeasonStats = async (gamertag: string, season: string, sr: ServiceRecordSchema): Promise<void> => this.firebase.SetPreviousSeasonStats(gamertag, season, (await this.GetCurrentSeason())!.properties.identifier, sr);

    /**
     * Sets a player into firebase
     * @param player the player
     * @param season the multiplayer season identifier
     * @param oldSR the old service record
     */
    public async SetPlayerIntoFirebase(player: Player, season?: string, oldSR?: ServiceRecord): Promise<void>
	{
        if (!player.gamertag) { return; }

        if (season)
        {
            await Promise.all([
                this.firebase.SetAppearance(player.gamertag, player.appearanceData),
                this.firebase.SetServiceRecord(player.gamertag, player.serviceRecordData, season),
                this.firebase.SetCSRS(player.gamertag, season, player.csrs.map(iter => iter.GetJSON())),
                this.firebase.SetCareerRank(player.gamertag, player.careerRank)
            ]);
        }
        else if (oldSR && player.serviceRecord.matchesPlayed !== oldSR.matchesPlayed)
        {
            await Promise.all([
                this.firebase.SetAppearance(player.gamertag, player.appearanceData),
                this.firebase.SetServiceRecord(player.gamertag, player.serviceRecordData, season),
                this.firebase.SetCSRS(player.gamertag, season, player.csrs.map(iter => iter.GetJSON())),
                this.firebase.SetCareerRank(player.gamertag, player.careerRank),
                this.firebase.UpdateLeaderboard(player)
            ]);
        }
        else
        {
            await this.firebase.SetAppearance(player.gamertag, player.appearanceData);
        }
	}

    /**
     * Syncs a player from HaloDotAPI to Firebase
     * @param gamertag the gamertag
     */
    public async SyncPlayerIntoFirebase(gamertag: string): Promise<void>
	{
        if (!gamertag) { return; }

        const player = await this.GetPlayerFromHaloDotAPI(gamertag);
        await this.SetPlayerIntoFirebase(player);
	}

    /**
     * Sets a reference from the incorrect gamertag (likely casing) to the correct gamertag
     * @param correct the correct gamertag
     * @param incorrect the incorrect gamertag
     */
    public UpdateGamertagReference = async (correct: string, incorrect: string): Promise<void> => this.firebase.SetGamertagPointer(correct, incorrect);

    /**
     * Gets the player from HaloDotAPI
     * @param gamertag the gamertag
     * @param season the season identifier
     * @param oldSR the current service record
     */
	public async GetPlayerFromHaloDotAPI(gamertag: string, season?: string, oldSR?: ServiceRecord): Promise<Player> 
    {
        const player = await this.halodapi.GetPlayer(gamertag, season, oldSR);
        if ((player.serviceRecordData as any)?.error) { this.logger.LogError(); }

        // Update counter
        this.firebase.CountAPIUsage(player?.serviceRecord?.matchesPlayed === oldSR?.matchesPlayed ? 1 : 4);

        return player;
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
	public async GetServiceRecordFromAutocode(gamertag: string, season?: string, playlistId?: string, categoryId?: string, type?: ServiceRecordType): Promise<ServiceRecord> 
    {
        const player = new Player(gamertag);
        await this.halodapi.GetServiceRecord(player, season, playlistId, categoryId, type);
        return player.serviceRecord;
    }

    /**
	 * Gets the service record data for the gamertag from HaloDotAPI
	 * @param player the gamertag to get the service record of
	 * @param season the season identifier
	 * @param playlistId the playlist ID
	 * @param categoryId the category ID
	 * @param type the type of service record to get
	 * @returns the service record for the gamertag
	 */
	public async GetServiceRecordData(gamertag: string, season?: string, playlistId?: string, categoryId?: string, type?: ServiceRecordType): Promise<ServiceRecordSchema> 
    {
        const player = new Player(gamertag);
        return await this.halodapi.GetServiceRecordData(player, season, playlistId, categoryId, type);
    }

    /**
     * Gets a historic service record for a specific game number
     * @param player the player
     * @param game the game number
     * @returns the service record
     */
    public async GetHistoricServiceRecord(player: Player, game: number): Promise<ServiceRecord>
    {
        return await this.firebase.GetHistoricStatisticsForGameNumber(player.gamertag, game);
    }

    /**
     * Gets the available filters for a node
     * @param gamertag the gamertag
     * @param node the game number
     * @returns the available filters
     */
    public async GetFilteredServiceRecord(gamertag: string, node: ServiceRecordFilter, filter: string): Promise<ServiceRecord | undefined>
    {
        return await this.firebase.GetFilteredServiceRecord(gamertag, node, filter);
    }

    /**
     * Gets the last 25 player matches for a gamertag
     * @param gamertag the gamertag
     * @returns the array of player matches
     */
    public async GetLast25PlayerMatches(gamertag: string): Promise<PlayerMatch[]>
    {
        const result = await this.halodapi.GetPlayerMatches(gamertag, 25, 0);
        
        let playerMatches: PlayerMatch[] = [];
        for (const match of result) { playerMatches.push(new PlayerMatch(match)); }

        return playerMatches;
    }

    /**
     * Gets the last 25 player matches for a gamertag
     * @param gamertag the gamertag
     * @param count the count
     * @param offset the number of matches to get
     * @param customs custom game?
     * @param local LAN game?
     * @returns the array of player matches
     */
    public async GetPlayerMatches(gamertag: string, count: number, offset: number, customs?: boolean, local?: boolean): Promise<PlayerMatch[]>
    {
        const result = await this.halodapi.GetPlayerMatches(gamertag, count, offset, customs, local);
        
        let playerMatches: PlayerMatch[] = [];
        for (const match of result) { playerMatches.push(new PlayerMatch(match)); }

        return playerMatches;
    }

    /**
     * Gets the match
     * @param matchID the match ID
     * @returns the match details and statistics
     */
    public async GetMatch(matchID: string): Promise<Match>
    {
        if (!matchID) { return new Match(); }
        
        // Check if available in firebase
        let match = await this.firebase.GetMatch(matchID);
        if (match) { return match; }

        // Now check HaloDotAPI
        const result = await this.halodapi.GetMatch(matchID);
        if (!result) { return new Match(); }

        // Set match into firebase for faster lookup next time
        await this.firebase.SetMatch(matchID, result);

        return new Match(result);
    }

    /**
     * Gets the matches and saves them to Firebase
     * @param ids the match IDs
     * @returns the matches
     */
    public async GetMatches(ids: string[]): Promise<Match[]>
    {
        if (!ids) { return []; }

        // Check with HaloDotAPI
        const matches = await this.halodapi.GetMatches(ids);
        this.firebase.CountAPIUsage(ids.length);
        if (!matches) { return []; }

        // Store into Firebase if appropriate
        for (const match of matches)
        {
            if (await this.firebase.GetMatchIsStored(match.data.id)) { continue; }
            await this.firebase.SetMatch(match.data.id, match);
        }

        return matches.map(m => new Match(m));
    }

    /**
	 * The current best (or worst) values for the gamer
	 * @param gamertag the gamertag
	 * @returns the best values object
	 */
	public async GetBest(gamertag: string): Promise<FirebaseBest>
    {
        return await this.firebase.GetBestMatches(gamertag);
    }

    /**
	 * The current best (or worst) values for the gamer
	 * @param gamertag the gamertag
	 * @param map the map name
	 * @returns the best values object
	 */
	public async GetBestForMap(gamertag: string, map: string): Promise<FirebaseBest>
    {
        return await this.firebase.GetBestMatchesForMap(gamertag, map);
    }

    /**
	 * Sees if this gamertag is allowed to see filters
	 * @param gamertag the gamertag to check the permissions of
	 * @returns true if allowed to see filters
	 */
	public async GetIsAllowed(gamertag: string): Promise<boolean>
    {
        return await this.firebase.GetIsPremiumUser(gamertag);
    }

    /**
     * Get all available seasons
     * @returns the available seasons in an array
     */
    public async GetSeasons(): Promise<HaloDotAPISeason[]>
    {
        if (this.__seasons && this.__seasons.length > 0) { return this.__seasons; }
        this.__seasons = await this.halodapi.GetSeasons();

        // Add parts to season 1 names
        this.__seasons[0].name += " Part I";
        this.__seasons[1].name += " Part II";

        return this.__seasons;
    }

    /**
     * Get the current season
     * @returns the current season
     */
    public async GetCurrentSeason(): Promise<HaloDotAPISeason | undefined>
    {
        const seasons = await this.GetSeasons();
        if (!seasons || seasons.length === 0) { return; }
        return seasons[seasons.length - 1];
    }
    //#endregion

    //#region Version
    /**
     * Gets the HaloDotAPI version
     */
    public async GetVersion(): Promise<string>
    {
        return await this.halodapi.GetVersion();
    }
    //#endregion

    //#region Filters
    /**
     * Gets the available filters for a node
     * @param gamertag the gamertag
     * @param node the game number
     * @returns the available filters
     */
    public GetAvailableFilters = async (gamertag: string, node: ServiceRecordFilter): Promise<SRFilter[]> => this.firebase.GetAvailableFilters(gamertag, node);
    
    /** Gets the maps */
	public async GetMaps(): Promise<AutocodeMap[]>
    {
        return await this.halodapi.GetMaps();
    }

	/** Gets the playlists */
	public async GetPlaylists(): Promise<HaloDotAPIPlaylist[]>
    {
        return await this.halodapi.GetPlaylists();
    } 

    /** Gets the playlist weights */
	public async GetPlaylistWeights(): Promise<Map<string, PlaylistWeights>>
    {
        return await this.halodapi.GetPlaylistWeights();
    } 

	/** Gets the game variants */
	public async GetVariants(): Promise<HaloDotAPICategory[]>
    {
        return await this.halodapi.GetVariants();
    } 

	/** Gets the medals */
	public async GetMedals(): Promise<AutocodeMedal[]>
    {
        return await this.halodapi.GetMedals();
    } 

	/** Gets the teams */
	public async GetTeams(): Promise<AutocodeTeam[]>
    {
        return await this.halodapi.GetTeams();
    } 

    /** Gets the store */
	public async GetStore(): Promise<HaloDotAPIStoreOffering[]>
    {
        return await this.halodapi.GetStore();
    } 

    /** Gets the clips for a gamertag */
	public async GetClips(gamertag: string): Promise<HaloDotAPIClip[]>
    {
        return await this.halodapi.GetClips(gamertag);
    }
    //#endregion

    //#region Leaderboards
    /**
	 * Gets a leaderboard for a certain category
	 * @param leaderboard the leaderboard to get
	 * @returns the player's with the highest values in the leaderboard
	 */
	public GetLeaderboard = async (leaderboard: Leaderboard): Promise<Leader[]> => this.firebase.GetLeaderboard(leaderboard);

    /**
	 * Gets a leader for a certain category
	 * @param leaderboard the leaderboard to get
     * @param gamertag the gamertag
	 * @returns the leader object for the gamertag
	 */
	public GetLeader = async (leaderboard: Leaderboard, gamertag: string): Promise<Leader> => this.firebase.GetLeader(leaderboard, gamertag);

    /**
	 * Gets leaderboard averages for a certain category
	 * @param leaderboard the leaderboard to get averages for
	 * @returns the averages for a leaderboard
	 */
	public GetLeaderboardAverages = async (leaderboard: Leaderboard): Promise<LeaderboardAverages> => this.firebase.GetLeaderboardAverages(leaderboard);
    //#endregion

    //#region API Usage
    /**
     * Sets the version counter
     */
    public async SetVersion(): Promise<void>
    {
        await this.firebase.SetVersion();
    }

    /**
     * Returns an error message if we cannot update from the API
     */
    public async CanUpdate(): Promise<boolean>
    {
        return await this.CurrentAPIUsage() < 7500;
    }

    /**
	 * Gets the current API usage
	 */
	public async CurrentAPIUsage(): Promise<number>
	{
		return await this.firebase.CurrentAPIUsage();
	}
    //#endregion
}