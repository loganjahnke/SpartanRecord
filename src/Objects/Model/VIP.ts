import { Appearance } from "./Appearance";

export class VIP
{
    /** The player's gamertag */
    public gamertag: string;
    /** The player's appearance */
    public appearance: Appearance;

    constructor(gamertag?: string, appearance?: Appearance)
    {
        this.gamertag = gamertag ?? "";
        this.appearance = appearance ?? new Appearance();
    }
}