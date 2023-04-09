import { UGCGameVariantSchema } from "../../Database/Schemas/PlayerMatchSchema";
import { Asset } from "./Asset";

export class GameVariant
{
    /** The ID of the game mode */
    public id: string;
    /** The version of the game mode */
    public version: string;
    /** The name of the game mode */
    public name: string;
    /** Game mode assets */
    public asset: Asset;
    /** The standard released category ID */
    public categoryId: number;
    /** The standard released engine ID */
    public engineVariantId: string;
    /** The owner type */
    public ownerType: string;

    /** Gets the short name */
    public get short(): string
    {
        const colon = this.name.indexOf(":");
        if (colon === -1) { return this.name; }
        return this.name.substring(colon + 2);
    }

    constructor(data?: UGCGameVariantSchema)
    {
        this.id = data?.id ?? "";
        this.version = data?.version ?? "";
        this.name = data?.name ?? "";

        this.categoryId = data?.properties?.category_id ?? 0;
        this.engineVariantId = data?.properties?.engine_variant_id ?? "";
        this.ownerType = data?.properties?.owner_type ?? "";

        if (this.name) 
        { 
            const splits = this.name.split(":"); 
            if (splits.length > 1)
            {
                this.name = splits[0] + ": " + splits[1];
            }
        }
        this.asset = new Asset(data?.image_urls);
    }
}