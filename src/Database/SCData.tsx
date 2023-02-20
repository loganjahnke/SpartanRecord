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
import { SCHaloDotAPI } from "./SCHaloDotAPI";
import { AutocodeHelpers } from "./Schemas/AutocodeHelpers";
import { AutocodeMap, AutocodeMedal, AutocodePlaylist, AutocodeTeam, AutocodeVariant } from "./Schemas/AutocodeMetadata";
import { AutocodeMultiplayerServiceRecord } from "./Schemas/AutocodeMultiplayerServiceRecord";
import { FirebaseBest } from "./Schemas/FirebaseBest";

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
    public halodapi: SCHaloDotAPI;

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
        this.halodapi = new SCHaloDotAPI();
        this.__currentlySyncing = new Set<string>();
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
    public IsValidGamertag = async (gamertag: string): Promise<string> => this.halodapi.IsValidGamertag(gamertag);

    /**
     * Gets the player's appearance from firebase
     * @param gamertag the gamertag
     * @returns the player
     */
    public async GetPlayerAppearanceOnly(gamertag: string): Promise<Player>
    {
        const player = new Player(gamertag);
        player.appearance = await this.firebase.GetAppearance(gamertag);
        return player;
    }

    /**
     * Gets a player from firebase
     * @param gamertag the gamertag
     * @param season the season
     * @param historic the historic SRs
     * @returns player object
     */
    public async GetPlayerFromFirebase(gamertag: string, season?: number, historic?: boolean): Promise<Player>
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
    public DoesPlayerHavePrevSeasons = async (gamertag: string): Promise<boolean> => this.firebase.HasHistoricSeasonsCached(gamertag);

    /**
	 * Sets a previous season's statistics
	 * @param gamertag the gamertag to set the historic statistics for
	 * @param season the season we are saving
	 * @param sr the service record
	 */
	public SetPreviousSeasonStats = async (gamertag: string, season: number, sr: AutocodeMultiplayerServiceRecord): Promise<void> => this.firebase.SetPreviousSeasonStats(gamertag, season, sr);

    /**
     * Sets a player into firebase
     * @param player the player
     * @param season the multiplayer season
     * @param oldSR the old service record
     */
    public async SetPlayerIntoFirebase(player: Player, season?: number, oldSR?: ServiceRecord): Promise<void>
	{
        if (!player.gamertag) { return; }

        if (season !== undefined && season !== -1 && season !== 0)
        {
            await Promise.all([
                this.firebase.SetAppearance(player.gamertag, player.appearanceData),
                this.firebase.SetServiceRecord(player.gamertag, player.serviceRecordData, season),
                this.firebase.SetCSRS(player.gamertag, season, player.csrs.map(iter => iter.GetJSON())),
            ]);
        }
        else if (oldSR && player.serviceRecord.matchesPlayed !== oldSR.matchesPlayed)
        {
            await Promise.all([
                this.firebase.SetAppearance(player.gamertag, player.appearanceData),
                this.firebase.SetServiceRecord(player.gamertag, player.serviceRecordData, season),
                this.firebase.SetCSRS(player.gamertag, season, player.csrs.map(iter => iter.GetJSON())),
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
     * @param season the season
     */
	public async GetPlayerFromHaloDotAPI(gamertag: string, season?: number): Promise<Player> 
    {
        const player = await this.halodapi.GetPlayer(gamertag, season);
        if ((player.serviceRecordData as any)?.error) { this.logger.LogError(); }
        return player;
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
	public async GetServiceRecordFromAutocode(gamertag: string, season?: number, playlistId?: string, categoryId?: string, type?: ServiceRecordType): Promise<ServiceRecord> 
    {
        const player = new Player(gamertag);
        await this.halodapi.GetServiceRecord(player, season, playlistId, categoryId, type);
        return player.serviceRecord;
    }

    /**
	 * Gets the service record data for the gamertag from HaloDotAPI
	 * @param player the gamertag to get the service record of
	 * @param season the season number
	 * @param playlistId the playlist ID
	 * @param categoryId the category ID
	 * @param type the type of service record to get
	 * @returns the service record for the gamertag
	 */
	public async GetServiceRecordData(gamertag: string, season?: number, playlistId?: string, categoryId?: string, type?: ServiceRecordType): Promise<AutocodeMultiplayerServiceRecord> 
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
        for (const match of result.data) { playerMatches.push(new PlayerMatch(match)); }

        return playerMatches;
    }

    /**
     * Gets the last 25 player matches for a gamertag
     * @param gamertag the gamertag
     * @param offset the number of matches to get
     * @returns the array of player matches
     */
    public async GetPlayerMatches(gamertag: string, offset: number): Promise<PlayerMatch[]>
    {
        const result = await this.halodapi.GetPlayerMatches(gamertag, 25, offset);
        
        let playerMatches: PlayerMatch[] = [];
        for (const match of result.data) { playerMatches.push(new PlayerMatch(match)); }

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
	 * Gets all the matches for a player for a given date
	 * @param gamertag the gamertag
	 * @param date the date
	 * @returns the array of matches from that day
	 */
	public async GetMatchesForDay(gamertag: string, date: Date): Promise<ServiceRecord> 
    {
        // Try get from Firebase first
        const sr = await this.firebase.GetServiceRecordForDate(gamertag, date.toDateString());
        if (sr) { return new ServiceRecord(sr); }

        // Otherwise loop through games
        const overall = AutocodeHelpers.CreateEmptyServiceRecord(gamertag);
        const matches = await this.halodapi.GetMatchesForDay(gamertag, date);

        // Add matches together to get service record
        for (const m of matches)
		{
			if (!m || !m.match) { continue; }
			
			const details = AutocodeHelpers.GetPlayerDetailsForGamertag(gamertag, m);
			if (!details) { continue; }

			AutocodeHelpers.AddMatchToServiceRecord(overall, details, m.match.duration.seconds);			
		}

        // If getting today's stats, don't save into firebase since the player may play more games today
        if (!moment(date.toDateString()).isSame(new Date())) { await this.firebase.SetServiceRecordForDate(gamertag, overall, date.toDateString()); }

        return new ServiceRecord(overall);
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
	public GetMaps = async (): Promise<AutocodeMap[]> => this.halodapi.GetMaps();
	/** Gets the playlists */
	public GetPlaylists = async (): Promise<AutocodePlaylist[]> => this.halodapi.GetPlaylists();
	/** Gets the game variants */
	public GetVariants = async (): Promise<AutocodeVariant[]> => this.halodapi.GetVariants();
	/** Gets the medals */
	public GetMedals = async (ids: string[] = []): Promise<AutocodeMedal[]> => this.halodapi.GetMedals(ids);
	/** Gets the teams */
	public GetTeams = async (): Promise<AutocodeTeam[]> => this.halodapi.GetTeams();
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
}