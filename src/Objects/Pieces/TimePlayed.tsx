export class TimePlayed
{
    /** Number of seconds played */
    public seconds: number;
    /** Nice formatted string of time played */
    public human: string;

    constructor(data?: any)
    {
        this.seconds = data?.seconds ?? 0;
        this.human = data?.human ?? "";
    }

    /**
     * Translates the seconds into a nice human readable string
     */
    public readable(): string
    {
        return this.seconds >= 3600
            ? this.human
            : this.seconds >= 600
            ? this.human.substring(4)
            : this.seconds >= 60
            ? this.human.substring(5)
            : this.seconds >= 10
            ? this.human.substring(8)
            : this.human.substring(9);
    }
}