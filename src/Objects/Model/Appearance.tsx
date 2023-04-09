import { AppearanceSchema } from "../../Database/Schemas/AppearanceSchema";
import { URLReducer } from "../Helpers/Statics/URLReducer";

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
    /** The action pose URL */
    public actionPoseURL: string;
    /** The raw autocode JSON */
    public raw?: AppearanceSchema;

    constructor(appearance?: AppearanceSchema)
    {
        this.raw = appearance;
        this.serviceTag = appearance?.data?.service_tag ?? "";
        this.emblemURL = URLReducer.ConstructAppearanceURL(appearance?.data?.image_urls?.emblem ?? "");
        this.backdropURL = URLReducer.ConstructAppearanceURL(appearance?.data?.image_urls?.backdrop ?? "");
        this.nameplateURL = URLReducer.ConstructAppearanceURL(appearance?.data?.image_urls?.nameplate ?? "");
        this.actionPoseURL = URLReducer.ConstructAppearanceURL(appearance?.data?.image_urls?.action_pose ?? "");
    }
}