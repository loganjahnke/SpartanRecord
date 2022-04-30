import { AutocodePlaylist } from "../../Database/Schemas/AutocodePlayerMatch";
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

    constructor(data?: AutocodePlaylist)
    {
        this.name = data?.name ?? "";
        this.asset = new Asset(data?.asset);
        this.queue = data?.properties?.queue ?? "";
        this.input = data?.properties?.input ?? "";
        this.ranked = data?.properties?.ranked ?? false;
    }
}