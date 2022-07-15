import { App } from "firebase-admin/app";
import { Analytics, logEvent } from "firebase/analytics";
import { Database } from "firebase/database";
import { AllGamertags } from "../Objects/Helpers/AllGamertags";
import { Match } from "../Objects/Model/Match";
import { Player } from "../Objects/Model/Player";
import { PlayerMatch } from "../Objects/Model/PlayerMatch";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { MMR } from "../Objects/Pieces/MMR";
import { SRFilter } from "../Objects/Pieces/SRFilter";
import { ServiceRecordFilter } from "./ArrowheadFirebase";
import { SCAutocode, ServiceRecordType } from "./SCAutocode";
import { SCFirebase } from "./SCFirebase";
import { SCHaloDotAPI } from "./SCHaloDotAPI";
import { AutocodeMap, AutocodeMedal, AutocodePlaylist, AutocodeTeam, AutocodeVariant } from "./Schemas/AutocodeMetadata";
import { FirebaseBest } from "./Schemas/FirebaseBest";

export class SCData
{
    public app: App;
    private __firebase: SCFirebase;
    private __autocode: SCAutocode;
    private __halodapi: SCHaloDotAPI;
    private __analytics: Analytics;
    private __currentlySyncing: Set<string>;

    /**
     * Creates a new arrowhead application
     * @param database the database manager
     * @param analytics the analytics manager
     */
    constructor(app: App, database: Database, analytics: Analytics)
    {
        this.app = app;
        this.__analytics = analytics;
        this.__firebase = new SCFirebase(database);
        this.__autocode = new SCAutocode();
        this.__halodapi = new SCHaloDotAPI();
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
    public IsValidGamertag = async (gamertag: string): Promise<string> => this.__halodapi.IsValidGamertag(gamertag);

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
        const correct = await this.__firebase.GetGamertag(gamertag);
		const player = new Player(correct);
		await this.__firebase.GetPlayer(player, season, historic);
		return player;
	}

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
                this.__firebase.SetAppearance(player.gamertag, player.appearanceData),
                this.__firebase.SetServiceRecord(player.gamertag, player.serviceRecordData, season),
                this.__firebase.SetMMR(player.gamertag, player.mmr),
                this.__firebase.SetCSRS(player.gamertag, season, player.csrs.map(iter => iter.GetJSON())),
            ]);
        }
        else if (oldSR && player.serviceRecord.matchesPlayed !== oldSR.matchesPlayed)
        {
            await Promise.all([
                this.__firebase.SetAppearance(player.gamertag, player.appearanceData),
                this.__firebase.SetServiceRecord(player.gamertag, player.serviceRecordData, season),
                this.__firebase.SetMMR(player.gamertag, player.mmr),
                this.__firebase.SetCSRS(player.gamertag, season, player.csrs.map(iter => iter.GetJSON())),
                this.__firebase.UpdateLeaderboard(player)
            ]);
        }
        else
        {
            await this.__firebase.SetAppearance(player.gamertag, player.appearanceData);
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
    public UpdateGamertagReference = async (correct: string, incorrect: string): Promise<void> => this.__firebase.SetGamertagPointer(correct, incorrect);

    /**
     * Gets the player from HaloDotAPI
     * @param gamertag the gamertag
     * @param season the season
     * @param mmr the MMR
     */
	public GetPlayerFromHaloDotAPI = async (gamertag: string, season?: number, mmr?: MMR): Promise<Player> => this.__halodapi.GetPlayer(gamertag, season, mmr);

    /**
     * Gets the player from Autocode
     * @param gamertag the gamertag
     * @param season the season
     * @param mmr the MMR
     */
	public GetPlayerFromAutocode = async (gamertag: string, season: number, mmr: MMR): Promise<Player> => this.__autocode.GetAllPlayerEndpoints(gamertag, season, mmr);

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
        await this.__halodapi.GetServiceRecord(player, season, playlistId, categoryId, type);
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
        const result = await this.__halodapi.GetPlayerMatches(gamertag, 25, 0);
        
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
        const result = await this.__halodapi.GetPlayerMatches(gamertag, 25, offset);
        
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
        const result = await this.__halodapi.GetMatch(matchID);
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

    //#region Leaderboards
    public async SetLeaderboard(setProgress: ((percent: number) => void)): Promise<void>
    {
        //const gamertags = ["Bang402", "BoundlessEcho", "CaptainExquisit", "CrankyStankyLeg", "ItzEmoneyyy"];
        let index = 0;
        const total = AllGamertags.length;
        
        for (const gamertag of AllGamertags)
        {
            setProgress(index / total);

            const player = await this.__halodapi.GetPlayerForLeaderboard(gamertag);
            if (!player.serviceRecordData || (player.serviceRecordData as any).error) 
            { 
                index += 1; 
                continue; 
            }

            await Promise.all([
                this.__firebase.SetServiceRecord(player.gamertag, player.serviceRecordData),
                this.__firebase.SetCSRS(player.gamertag, undefined, player.csrs.map(iter => iter.GetJSON())),
                this.__firebase.UpdateLeaderboard(player)
            ]);

            index += 1;
        }
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
	public GetMaps = async (): Promise<AutocodeMap[]> => this.__halodapi.GetMaps();
	/** Gets the playlists */
	public GetPlaylists = async (): Promise<AutocodePlaylist[]> => this.__halodapi.GetPlaylists();
	/** Gets the game variants */
	public GetVariants = async (): Promise<AutocodeVariant[]> => this.__halodapi.GetVariants();
	/** Gets the medals */
	public GetMedals = async (ids: string[] = []): Promise<AutocodeMedal[]> => this.__halodapi.GetMedals(ids);
	/** Gets the teams */
	public GetTeams = async (): Promise<AutocodeTeam[]> => this.__halodapi.GetTeams();
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