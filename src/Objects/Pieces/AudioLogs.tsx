export class AudioLogs
{
    unsc: number;
    banished: number;
    spartans: number;

    constructor(data?: any)
    {
        this.unsc = data?.unsc;
        this.banished = data?.banished;
        this.spartans = data?.spartans;
    }
}