import { PlaylistSchema } from "../../Database/Schemas/PlayerMatchSchema";
import { Asset } from "./Asset";

export class Playlist
{
    /** The name of the playlist */
    public name: string;
    /** Playlist assets */
    public asset: Asset;
    /** Playlist queue type */
    public queue: string;
    /** Playlist input type */
    public input: string;
    /** Was this a ranked playlist? */
    public ranked: boolean;

    /** Gets the short name */
    public get short(): string
    {
        const colon = this.name.indexOf(":");
        if (colon === -1) { return this.name; }
        return this.name.substring(colon + 2);
    }

    constructor(data?: PlaylistSchema)
    {
        this.name = data?.name ?? "";
        this.asset = new Asset(data?.image_urls);
        this.queue = data?.properties?.queue ?? "";
        this.input = data?.properties?.input ?? "";
        this.ranked = (data?.attributes?.ranked ?? false) || this.name === "Ranked FFA";
    }
}