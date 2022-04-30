import { AutocodeGameMap } from "../../Database/Schemas/AutocodePlayerMatch";
import { Asset } from "./Asset";

export class Map
{
    /** The name of the map */
    public name: string;
    /** Map assets */
    public asset: Asset;

    constructor(data?: AutocodeGameMap)
    {
        this.name = data?.name ?? "";
        this.asset = new Asset(data?.asset);
    }
}