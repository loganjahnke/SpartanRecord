import { Asset } from "./Asset";

export class GameMode
{
    /** The name of the game mode */
    public name: string;
    /** Game mode assets */
    public asset: Asset;

    constructor(data?: any)
    {
        this.name = data?.name ?? "";
        this.asset = new Asset(data?.asset);
    }
}