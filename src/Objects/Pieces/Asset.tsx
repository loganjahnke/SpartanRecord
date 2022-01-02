export class Asset
{
    /** Asset ID */
    public id: string;
    /** Version of the asset */
    public version: string;
    /** Asset thumbnail */
    public thumbnail: string;

    constructor(data?: any)
    {
        this.id = data?.id ?? ""; 
        this.version = data?.version ?? ""; 
        this.thumbnail = data?.thumbnail_url ?? "";
    }
}