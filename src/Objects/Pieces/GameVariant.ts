import { AutocodeGameVariant } from "../../Database/Schemas/AutocodePlayerMatch";
import { Asset } from "./Asset";

export class GameVariant
{
    /** The name of the game mode */
    public name: string;
    /** Game mode assets */
    public asset: Asset;

    constructor(data?: AutocodeGameVariant)
    {
        this.name = data?.name ?? "";
        if (this.name) 
        { 
            const splits = this.name.split(":"); 
            if (splits.length > 1)
            {
                this.name = splits[0] + ": " + splits[1];
            }
        }
        this.asset = new Asset(data?.asset);
    }
}