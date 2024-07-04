import { AppearanceSchema } from "../../Database/Schemas/AppearanceSchema";
import { URLReducer } from "../Helpers/Statics/URLReducer";

export class Appearance
{
    /** The emblem URL */
    private __emblemURL: string = "";
    /** The four character service tag */
    public serviceTag: string;
    /** The backdrop URL */
    public backdropURL: string;
    /** The nameplate URL */
    public nameplateURL: string;
    /** The action pose URL */
    public actionPoseURL: string;
    /** The raw autocode JSON */
    public raw?: AppearanceSchema;

    /** Public getter for the emblem URL */
    public get emblemURL(): string
    {
        return this.__emblemURL;
    }

    /** Public setter for the emblem URL; intercepts broken emblems, may also set the nameplate */
    public set emblemURL(value: string)
    {
        const nameplate = URLReducer.GetNameplateForEmblem(value);
        if (nameplate)
        {
            this.nameplateURL = nameplate;
        }

        if (URLReducer.IsBrokenEmblem(value))
        {
            this.__emblemURL = "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoicHJvZ3Jlc3Npb24vSW52ZW50b3J5L0VtYmxlbXMvZGFuZGlfZmluZ2VyaGVhcnRzX3VuaXR5X2VtYmxlbS5wbmciLCJvcHRpb25zIjp7ImJyYW5jaCI6IkltYWdlcyJ9fQ%3D%3D";
            return;
        }

        this.__emblemURL = value;
    }

    constructor(appearance?: AppearanceSchema)
    {
        this.raw = appearance;
        this.serviceTag = appearance?.data?.service_tag ?? "";
        this.nameplateURL = URLReducer.ConstructURLForGruntAPI(appearance?.data?.image_urls?.nameplate ?? "");
        this.emblemURL = URLReducer.ConstructURLForGruntAPI(appearance?.data?.image_urls?.emblem ?? "");
        this.backdropURL = URLReducer.ConstructURLForGruntAPI(appearance?.data?.image_urls?.backdrop ?? "");
        this.actionPoseURL = URLReducer.ConstructURLForGruntAPI(appearance?.data?.image_urls?.action_pose ?? "");
    }
}
