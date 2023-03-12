import { AutocodeAppearance } from "../../Database/Schemas/AutocodeAppearance";
import { URLReducer } from "../Helpers/Statics/URLReducer";

export class Appearance
{
    /** The prefix of the URLs */
    private readonly __prefix: string = "https://assets.halo.autocode.gg/externals/infinite/cms-images/?hash=";

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
        this.emblemURL = URLReducer.ConstructAppearanceURL(appearance?.data?.emblem_url ?? "");
        this.backdropURL = URLReducer.ConstructAppearanceURL(appearance?.data?.backdrop_image_url ?? "");
        this.nameplateURL = URLReducer.ConstructAppearanceURL(appearance?.data?.nameplate_url ?? "");
    }
}