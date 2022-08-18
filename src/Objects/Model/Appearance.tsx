import { AutocodeAppearance } from "../../Database/Schemas/AutocodeAppearance";

export class Appearance
{
    /** The four character service tag */
    public serviceTag: string;
    /** The emblem URL */
    public emblemURL: string;
    /** The backdrop URL */
    public backdropURL: string;
    /** The nameplate URL */
    public nameplateURL: string;
    /** The raw autocode JSON */
    public raw?: AutocodeAppearance;

    constructor(appearance?: AutocodeAppearance)
    {
        this.raw = appearance;
        this.serviceTag = appearance?.data?.service_tag ?? "";
        this.emblemURL = appearance?.data?.emblem_url ?? "";
        this.backdropURL = appearance?.data?.backdrop_image_url ?? "";
        this.nameplateURL = appearance?.data?.nameplate_url ?? "";
    }
}