import { Analytics, logEvent } from "firebase/analytics";
import { Database } from "firebase/database";
import { getFunctions, httpsCallable } from "firebase/functions";
import { Match } from "../Objects/Model/Match";
import { Player } from "../Objects/Model/Player";
import { PlayerMatch } from "../Objects/Model/PlayerMatch";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { SRFilter } from "../Objects/Pieces/SRFilter";
import { HaloMap, HaloMode, HaloOutcome, HaloRanked, ServiceRecordFilter } from "./ArrowheadFirebase";
import { SCAutocode, ServiceRecordType } from "./SCAutocode";
import { SCFirebase } from "./SCFirebase";
import { AutocodeMap, AutocodeMedal, AutocodePlaylist, AutocodeTeam, AutocodeVariant } from "./Schemas/AutocodeMetadata";
import { AutocodeMultiplayerServiceRecord } from "./Schemas/AutocodeMultiplayerServiceRecord";
import { FirebaseBest } from "./Schemas/FirebaseBest";

export class SCData
{
    private __firebase: SCFirebase;
    private __autocode: SCAutocode;
    private __analytics: Analytics;
    private __currentlySyncing: Set<string>;

    /**
     * Creates a new arrowhead application
     * @param database the database manager
     * @param analytics the analytics manager
     */
    constructor(database: Database, analytics: Analytics)
    {
        this.__analytics = analytics;
        this.__firebase = new SCFirebase(database);
        this.__autocode = new SCAutocode();
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

    //#region Firebase Functions
    /**
	 * Process the statistics for a new user
	 * @param gamertag the gamertag
	 * @returns error message if there is one
	 */
	public async SyncPlayer(gamertag: string): Promise<boolean>
	{
        // Check if firebase is already doing this
        if (await this.__firebase.GetIsSyncing(gamertag)) { return true; }

		// Get statistics
		const GetLatestStatistics = httpsCallable(getFunctions(), "GetLatestStatistics");
		const result: any = await GetLatestStatistics({ gamertag: gamertag });
		return result;
	}
    //#endregion

    //#region Gets
    /**
     * Gets the player's appearance from firebase
     * @param gamertag the gamertag
     * @returns the player
     */
    public async GetPlayerAppearanceOnly(gamertag: string): Promise<Player>
    {
        const player = new Player(gamertag);
        player.appearance = await this.__firebase.GetAppearance(gamertag);
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
		const player = new Player(gamertag);
		await this.__firebase.GetPlayer(player, season, historic);
		return player;
	}

    /**
     * Sets a player into firebase
     * @param player the player
     */
    public async SetPlayerIntoFirebase(player: Player, season?: number): Promise<void>
	{
        if (!player.gamertag) { return; }
		await Promise.all([
            this.__firebase.SetAppearance(player.gamertag, player.appearanceData),
            this.__firebase.SetServiceRecord(player.gamertag, player.serviceRecordData, season),
            this.__firebase.SetMMR(player.gamertag, player.mmr)
        ]);
	}

    /**
     * Gets the player from Autocode
     * @param gamertag the gamertag
     */
	public GetPlayerFromAutocode = async (gamertag: string, season: number): Promise<Player> => this.__autocode.GetPlayer(gamertag, season);

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
        await this.__autocode.GetServiceRecord(player, season, playlistId, categoryId, type);
        return player.serviceRecord;
    }

    /**
     * Gets a historic service record for a specific game number
     * @param player the player
     * @param game the game number
     * @returns the service record
     */
    public async GetHistoricServiceRecord(player: Player, game: number): Promise<ServiceRecord>
    {
        return await this.__firebase.GetHistoricStatisticsForGameNumber(player.gamertag, game);
    }

    /**
     * Gets the available filters for a node
     * @param gamertag the gamertag
     * @param node the game number
     * @returns the available filters
     */
    public async GetFilteredServiceRecord(gamertag: string, node: ServiceRecordFilter, filter: string): Promise<ServiceRecord | undefined>
    {
        return await this.__firebase.GetFilteredServiceRecord(gamertag, node, filter);
    }

    /**
     * Gets the last 25 player matches for a gamertag
     * @param gamertag the gamertag
     * @returns the array of player matches
     */
    public async GetLast25PlayerMatches(gamertag: string): Promise<PlayerMatch[]>
    {
        const result = await this.__autocode.GetPlayerMatches(gamertag, 25, 0);
        
        let playerMatches: PlayerMatch[] = [];
        for (const match of result.data.matches) { playerMatches.push(new PlayerMatch(match)); }

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
        const result = await this.__autocode.GetPlayerMatches(gamertag, 25, offset);
        
        let playerMatches: PlayerMatch[] = [];
        for (const match of result.data.matches) { playerMatches.push(new PlayerMatch(match)); }

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
        let match = await this.__firebase.GetMatch(matchID);
        if (match) { return match; }

        // Now check autocode
        const result = await this.__autocode.GetMatch(matchID);
        if (!result) { return new Match(); }

        // Set match into firebase for faster lookup next time
        await this.__firebase.SetMatch(matchID, result);

        return new Match(result);
    }

    /**
	 * The current best (or worst) values for the gamer
	 * @param gamertag the gamertag
	 * @returns the best values object
	 */
	public async GetBest(gamertag: string): Promise<FirebaseBest>
    {
        return await this.__firebase.GetBest(gamertag);
    }

    /**
	 * The current best (or worst) values for the gamer
	 * @param gamertag the gamertag
	 * @param map the map name
	 * @returns the best values object
	 */
	public async GetBestForMap(gamertag: string, map: string): Promise<FirebaseBest>
    {
        return await this.__firebase.GetBestForMap(gamertag, map);
    }

    /**
	 * Sees if this gamertag is allowed to see filters
	 * @param gamertag the gamertag to check the permissions of
	 * @returns true if allowed to see filters
	 */
	public async GetIsAllowed(gamertag: string): Promise<boolean>
    {
        return await this.__firebase.GetIsAllowed(gamertag);
    }
    //#endregion

    //#region Filters
    /**
     * Gets the available filters for a node
     * @param gamertag the gamertag
     * @param node the game number
     * @returns the available filters
     */
     public GetAvailableFilters = async (gamertag: string, node: ServiceRecordFilter): Promise<SRFilter[]> => this.__firebase.GetAvailableFilters(gamertag, node);
    /** Gets the maps */
	public GetMaps = async (): Promise<AutocodeMap[]> => this.__autocode.GetMaps();
	/** Gets the playlists */
	public GetPlaylists = async (): Promise<AutocodePlaylist[]> => this.__autocode.GetPlaylists();
	/** Gets the game variants */
	public GetVariants = async (): Promise<AutocodeVariant[]> => this.__autocode.GetVariants();
	/** Gets the medals */
	public GetMedals = async (ids: string[] = []): Promise<AutocodeMedal[]> => this.__autocode.GetMedals(ids);
	/** Gets the teams */
	public GetTeams = async (): Promise<AutocodeTeam[]> => this.__autocode.GetTeams();
    //#endregion

    //#region Event logging
    /**
     * Logs an event in Firebase analytics for viewing the gamertag's medals
     * @param gamertag the gamertag
     */
    public LogViewMedals(gamertag: string): void
    {
        this.LogEvent("view_medals", { gamertag: gamertag });
    }

    /**
     * Logs an event in Firebase analytics for viewing the gamertag's matches
     * @param gamertag the gamertag
     */
    public LogViewMatches(gamertag: string): void
    {
        this.LogEvent("view_matches", { gamertag: gamertag });
    }

    /**
     * Logs an event in Firebase analytics for viewing the gamertag's service record
     * @param gamertag the gamertag
     */
    public LogViewServiceRecord(gamertag: string, filter?: ServiceRecordFilter, param?: string): void
    {
        if (filter && param)
        {
            this.LogEvent("view_service_record", { gamertag: gamertag, filter: `${filter}|${param}` });
        }
        else
        {
            this.LogEvent("view_service_record", { gamertag: gamertag });
        }
    }

    /**
     * Logs an event in Firebase analytics for viewing the spartan company
     * @param company the spartan company
     */
    public LogViewSpartanCompany(company: string): void
    {
        this.LogEvent("view_spartan_company", { spartan_company: company });
    }

    /**
     * Logs an event in Firebase analytics
     * @param event the event name
     * @param params the optional parameters
     */
    public LogEvent(event: string, params?: any): void
    {
        logEvent(this.__analytics, event, params);
    }
    //#endregion
}