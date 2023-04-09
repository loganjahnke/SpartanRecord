import { ImagesSchema } from "../../Database/Schemas/PlayerMatchSchema";

export class Asset
{
    /** The big image? */
    public hero: string;
    /** Asset thumbnail */
    public thumbnail: string;
    /** Array of screenshots */
    public screenshots: string[];

    constructor(data?: ImagesSchema)
    {
        this.hero = data?.hero ?? ""; 
        this.thumbnail = data?.thumbnail ?? "";
        this.screenshots = data?.screenshots ?? [];
    }
}