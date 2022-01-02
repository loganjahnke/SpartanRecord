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
}