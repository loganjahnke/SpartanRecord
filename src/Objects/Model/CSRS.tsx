export class CSRS
{
    /** The ranked queue */
    public queue: string;
    /** The input (mouse/keyboard or controller) */
    public input: string;
    /** The three different types of ranks */
    public ranks: Ranks;

    constructor(data?: any)
    {
        this.queue = data?.queue ?? "Unknown";
        this.input = data?.input ?? "Unknown";
        this.ranks = new Ranks(data?.response);
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
    public initialMeasurementMatches: number;
    public tierImageUrl: string;

    constructor(data?: any)
    {
        this.value = data?.value;
        this.measurementMatchesRemaining = data?.measurement_matches_remaining;
        this.tier = data?.tier;
        this.tierStart = data?.tier_start;
        this.subTier = data?.sub_tier;
        this.nextTier = data?.next_tier;
        this.nextTierStart = data?.next_tier_start;
        this.nextSubTier = data?.next_sub_tier;
        this.initialMeasurementMatches = data?.initial_measurement_matches;
        this.tierImageUrl = data?.tier_image_url;
    }
}

export class Ranks 
{
    public current: Rank;
    public season: Rank;
    public allTime: Rank;

    constructor(data?: any)
    {
        this.current = new Rank(data?.current);
        this.season = new Rank(data?.season);
        this.allTime = new Rank(data?.all_time);
    }
}