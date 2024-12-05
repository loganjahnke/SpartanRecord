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
        if (this.human)
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

        const numdays = Math.floor((this.seconds % 31536000) / 86400); 
        let numhours: number | string = Math.floor(((this.seconds % 31536000) % 86400) / 3600);
        let numminutes: number | string = Math.floor((((this.seconds % 31536000) % 86400) % 3600) / 60);
        let numseconds: number | string = Math.floor((((this.seconds % 31536000) % 86400) % 3600) % 60);

        let daysStr = "";
        let timeStr = "";

        if (numhours > 0) { timeStr = numhours + "h " + numminutes + "m " + numseconds + "s "; }
        else if (numminutes > 0) { timeStr = numminutes + "m " + numseconds + "s "; }
        else { timeStr = numseconds + "s "; }

        if (numdays > 0)
        {
            daysStr = numdays + " days ";
        }

        return daysStr + timeStr;
    }

    /**
     * Adds a TimePlayed to this TimePlayed
     * @param other the other TimePlayed
     */
    public add(other?: TimePlayed): void
    {
        if (!other) { return; }
        this.seconds += other.seconds;
    }
}