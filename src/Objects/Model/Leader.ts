import { Appearance } from "./Appearance";

export class Leader
{
    /** The leader's gamertag */
    public gamertag: string;
    /** The leader's appearance */
    public appearance: Appearance;
    /** The leader's value */
    public value: number;
	/** The leader's total matches played */
    public matchesPlayed: number;

    constructor(gamertag?: string, appearance?: Appearance, value?: number, matchesPlayed?: number)
    {
        this.gamertag = gamertag ?? "";
        this.appearance = appearance ?? new Appearance();
		this.value = value ?? 0;
		this.matchesPlayed = matchesPlayed ?? 0;
    }
}

export class LeaderboardAverages
{
    /** The average */
    public mean: number;
    /** The median */
    public median: number;
	/** The q25 */
    public q25: number;
	/** The q75 */
    public q75: number;
	/** The min */
    public min: number;
	/** The max */
    public max: number;
	/** The standardDeviation */
    public standardDeviation: number;
	/** Get the range of the average */
	public get range() { return this.max - this.min; }

    constructor(json?: any)
    {
        this.mean = json?.mean ?? 0;
		this.median = json?.median ?? 0;
		this.q25 = json?.q25 ?? 0;
		this.q75 = json?.q75 ?? 0;
		this.min = json?.min ?? 0;
		this.max = json?.max ?? 0;
		this.standardDeviation = json?.sd ?? 0;
    }
}