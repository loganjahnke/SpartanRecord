import { Player } from "./Player";
import { ServiceRecord } from "./ServiceRecord";

export class SpartanCompany
{
    /** The company's name */
    public name: string;
    /** The players in the company */
    public players: Player[] = [];
    /** The company's members */
    public members: UID2Gamertag[];
    /** The company medal */
    public emblem: string;
    /** The admin of the company */
    public adminUID: string = "";
    /** The list of gamertags who have requested permission to join the spartan company */
    public requested: UID2Gamertag[];
    
    /** Index of gamertag to player index */
    private __gamertagToPlayerIndex: Map<string, number> = new Map<string, number>();

    constructor(name: string)
    {
        this.name = name;
        this.members = [];
        this.requested = [];
        this.emblem = "https://assets.halo.autocode.gg/static/infinite/images/multiplayer/medals/medium/gunner.png";
    }

    /**
     * Adds a player to the spartan company
     * @param player the player to add
     */
    public AddPlayer(player: Player): void
    {
        const index = this.__gamertagToPlayerIndex.get(player.gamertag);
        if (index !== undefined && index < this.players.length)
        {
            this.players[index] = player;
        }
        else
        {
            const index = this.players.push(player);
            this.__gamertagToPlayerIndex.set(player.gamertag, index - 1);
        }
    }

    /**
     * Gets a player from the company
     * @param gamertag the gamertag to get the player object for
     * @returns player
     */
    public GetPlayer(gamertag?: string): Player | undefined
    {
        if (!gamertag) { return undefined; }
        const index = this.__gamertagToPlayerIndex.get(gamertag);
        if (index !== undefined)
        {
            return this.players[index];
        }
    }

    /**
     * Checks if we have the gamertag stored
     * @param gamertag the gamertag to check
     * @returns true if the gamertag is stored
     */
    public HasPlayer(gamertag: string): boolean
    {
        return this.__gamertagToPlayerIndex.get(gamertag) !== undefined;
    }

    /**
     * Gets the service record of the entire company
     * @returns Service Record
     */
    public GetServiceRecord(): ServiceRecord
    {
        let sr = new ServiceRecord();
        for (const player of this.players)
        {
            sr.AddServiceRecord(player.serviceRecord);
        }

        return sr;
    }

    /** Does this spartan company exist? */
    public Exists(): boolean { return this.members?.length > 0; }
}

export class UID2Gamertag
{
    public userID: string;
    public gamertag: string;

    constructor(uid: string, gamertag: string)
    {
        this.userID = uid;
        this.gamertag = gamertag;
    }

    public IsGuest(): boolean
    {
        return this.userID === "true";
    }
}