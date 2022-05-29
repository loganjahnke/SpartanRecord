import { AutocodeCSRSData, AutocodeRank } from "../../Database/Schemas/AutocodeCSRS";

export class CSRS
{
    /** The ranked queue */
    public queue: string;
    /** The input (mouse/keyboard or controller) */
    public input: string;
    /** The three different types of ranks */
    public ranks: Ranks;

    constructor(data?: AutocodeCSRSData)
    {
        this.queue = data?.queue ?? "Unknown";
        this.input = data?.input ?? "Unknown";
        this.ranks = new Ranks(data?.response);
    }

    /** Gets the header */
    public GetHeader(): string
    {
        //queue: "open" | "solo-duo" | null;
	    //input: "controller" | "mnk" | "crossplay" | null;
        
        const q = this.queue === "open" ? "Open" : this.queue === "solo-duo" ? "Solo-Duo" : "N/A";
        const i = this.input === "mnk" ? "MNK" : this.input === "controller" ? "Controller" : this.input === "crossplay" ? "Crossplay" : "N/A";

        return q + " | " + i;
    }

    /** Gets the subtitle */
    public GetSubtitle(): string
    {
        return this.ranks.current.tier === "Unranked" ? this.ranks.current.tier 
            : this.ranks.current.tier === "Onyx" ? this.ranks.current.tier + " " + this.ranks.current.value
            : this.ranks.current.tier + " " + this.ranks.current.subTier;
    }

    /** Gets the JSON representation of the CSRS */
    public GetJSON(): Partial<AutocodeCSRSData>
    {
        return {
            queue: (this.queue as any),
            input: (this.input as any),
            response: {
                current: this.ranks.current.GetJSON(),
                season: this.ranks.season.GetJSON(),
                all_time: this.ranks.allTime.GetJSON()
            }
        }
    }
}

export class Rank 
{
    public value: number;
    public measurementMatchesRemaining: number;
    public tier: string;
    public tierStart: number;
    public subTier: number;
    public nextTier: string;
    public nextTierStart: number;
    public nextSubTier: number;
    public tierImageUrl: string;

    constructor(data?: Partial<AutocodeRank>)
    {
        this.value = data?.value ?? 0;
        this.measurementMatchesRemaining = data?.measurement_matches_remaining ?? 0;
        this.tier = data?.tier ?? "Unranked";
        this.tierStart = data?.tier_start ?? 0;
        this.subTier = data?.sub_tier ?? 0;
        this.nextTier = data?.next_tier ?? "";
        this.nextTierStart = data?.next_tier_start ?? 0;
        this.nextSubTier = data?.next_sub_tier ?? 0;

        let tierImageSuffix = this.tier?.toLowerCase() || "unranked";
        if (tierImageSuffix !== "unranked") { tierImageSuffix += "-" + this.subTier; }
        this.tierImageUrl = data?.tier_image_url || "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/playlist-csrs/" + tierImageSuffix + ".png";
    }

    /** Gets the JSON representation of the rank */
    public GetJSON(): Partial<AutocodeRank>
    {
        if (this.measurementMatchesRemaining && this.measurementMatchesRemaining > 0)
        {
            return {
                measurement_matches_remaining: this.measurementMatchesRemaining
            }
        }

        return {
            value: this.value,
            tier: this.tier,
            tier_start: this.tierStart,
            sub_tier: this.subTier,
            next_tier: this.nextTier,
            next_tier_start: this.nextTierStart,
            next_sub_tier: this.nextSubTier
        }
    }
}

export class Ranks 
{
    public current: Rank;
    public season: Rank;
    public allTime: Rank;

    constructor(data?: { current: Partial<AutocodeRank>, season: Partial<AutocodeRank>, all_time: Partial<AutocodeRank> })
    {
        this.current = new Rank(data?.current);
        this.season = new Rank(data?.season);
        this.allTime = new Rank(data?.all_time);
    }
}