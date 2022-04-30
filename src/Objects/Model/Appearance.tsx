import { AutocodeAppearance } from "../../Database/Schemas/AutocodeAppearance";

export class Appearance
{
    /** The four character service tag */
    public serviceTag: string;
    /** The emblem URL */
    public emblemURL: string;
    /** The backdrop URL */
    public backdropURL: string;
    /** The raw autocode JSON */
    public raw?: AutocodeAppearance;

    constructor(cryptum?: AutocodeAppearance)
    {
        this.raw = cryptum;
        this.serviceTag = cryptum?.data?.service_tag ?? "";
        this.emblemURL = cryptum?.data?.emblem_url ?? "";
        this.backdropURL = cryptum?.data?.backdrop_image_url ?? "";
    }
}