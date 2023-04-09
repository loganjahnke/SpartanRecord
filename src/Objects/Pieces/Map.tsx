import { MapSchema } from "../../Database/Schemas/PlayerMatchSchema";
import { Asset } from "./Asset";

export class Map
{
    /** The name of the map */
    public name: string;
    /** Map assets */
    public asset: Asset;
    /** The unique level ID */
    public levelId: string;
    /** The owner type (343 vs Forge) */
    public ownerType: string;
    /** The asset ID */
    public id: string;
    /** The asset version */
    public version: string;

    constructor(data?: MapSchema)
    {
        this.id = data?.id ?? "";
        this.version = data?.version ?? "";
        this.name = data?.name ?? "";

        this.levelId = data?.properties?.level_id ?? "";
        this.ownerType = data?.properties?.owner_type ?? "";

        this.asset = new Asset(data?.image_urls);
    }
}