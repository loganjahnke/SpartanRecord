import { Analytics, logEvent } from "firebase/analytics";
import { Database } from "firebase/database";
import { getFunctions, httpsCallable } from "firebase/functions";
import { Match } from "../Objects/Model/Match";
import { Player } from "../Objects/Model/Player";
import { PlayerMatch } from "../Objects/Model/PlayerMatch";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { HaloMap, HaloMode, HaloOutcome, HaloRanked, ServiceRecordFilter } from "./ArrowheadFirebase";
import { SCAutocode } from "./SCAutocode";
import { SCFirebase } from "./SCFirebase";
import { AutocodeMultiplayerServiceRecord } from "./Schemas/AutocodeMultiplayerServiceRecord";

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
     * @returns player object
     */
    public async GetPlayerFromFirebase(gamertag: string): Promise<Player>
	{
		const player = new Player(gamertag);
		await this.__firebase.GetPlayer(player);
		return player;
	}

    /**
     * Updates the player from autocode, if needed
     * @param player the player object
     * @param lastMatchNumber the last match number we have stored
     * @returns the number of matches since the last autocode to firebase sync
     */
	public async GetPlayerFromAutocode(player: Player, lastMatchNumber: number): Promise<number>
	{
		return await this.__autocode.GetPlayerIfNeeded(player, lastMatchNumber);
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
     * @returns the array of player matches
     */
    public async GetMatch(matchID: string): Promise<Match>
    {
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
    public LogViewServiceRecord(gamertag: string, filter?: ServiceRecordFilter, param?: HaloMap | HaloMode | HaloOutcome | HaloRanked): void
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