import { Player } from "./Player";
import { ServiceRecord } from "./ServiceRecord";

export class Company
{
    /** The company's name */
    public name: string;
    /** The players in the company */
    public players: Player[] = [];
    
    /** Index of gamertag to player index */
    private __gamertagToPlayerIndex: Map<string, number> = new Map<string, number>();

    constructor(name: string)
    {
        this.name = name;
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
            sr = sr.AddServiceRecord(player.serviceRecord);
        }

        return sr;
    }
}