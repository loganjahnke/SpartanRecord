export class Team
{
    /** Team ID */
    public id: number;
    /** Name of the Team */
    public name: string;
    /** Team emblem */
    public emblem: string;

    constructor(data?: any)
    {
        this.id = data?.id ?? -1; 
        this.name = data?.name ?? ""; 
        this.emblem = data?.emblem_url ?? "";
    }
}