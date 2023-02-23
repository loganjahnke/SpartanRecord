import { ReactElement } from "react";

import { AutocodeCSRSData, AutocodeRank } from "../../Database/Schemas/AutocodeCSRS";

import MouseRoundedIcon from '@mui/icons-material/MouseRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';
import MilitaryTechRoundedIcon from '@mui/icons-material/MilitaryTechRounded';
import { Tooltip } from "@mui/material";

export class CSRS
{
    /** The name */
    public name: string;
    /** The ranked queue */
    public queue: string;
    /** The input (mouse/keyboard or controller) */
    public input: string;
    /** The three different types of ranks */
    public ranks: Ranks;

    constructor(data?: AutocodeCSRSData)
    {
        this.name = data?.name ?? "";
        this.queue = data?.queue ?? "Unknown";
        this.input = data?.input ?? "Unknown";
        this.ranks = new Ranks(data?.response);
    }

    /** Gets the header */
    public GetHeader(): string
    {
        if (this.name.startsWith("Ranked")) { return this.name.substring("Ranked ".length); }
        return this.name;
    }

    /** Gets the header icon */
    public GetHeaderIcon(): ReactElement
    {
        return <Tooltip title={this.__getIconTooltip()}>
            {this.queue === "open" ? <ShuffleRoundedIcon fontSize="small" color="primary" /> :
            this.input === "mnk" ? <MouseRoundedIcon fontSize="small" color="primary" /> :
            this.input === "controller" ? <SportsEsportsRoundedIcon fontSize="small" color="primary" /> : 
            <MilitaryTechRoundedIcon fontSize="small" color="primary" />}
        </Tooltip>
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

    /** Gets the header */
    private __getIconTooltip(): string
    {
        //queue: "open" | "solo-duo" | null;
	    //input: "controller" | "mnk" | "crossplay" | null;
        
        const q = this.queue === "open" ? "Open" : this.queue === "solo-duo" ? "Solo-Duo" : "N/A";
        const i = this.input === "mnk" ? "MNK" : this.input === "controller" ? "Controller" : this.input === "crossplay" ? "Crossplay" : "N/A";

        return q + " | " + i;
    }
}

export class Rank 
{
    public value: number;
    public measurementMatchesRemaining: number;
    public tier: string;
    public subTier: number;
    public nextTier: string;
    public nextSubTier: number;
    public tierImageUrl: string;

    public get tierStart(): number 
    { 
        if (this.tier === "Unranked") { return 0; }

        let startingValue = 0;
        switch (this.tier)
        {
            case "Bronze": startingValue = 0; break;
            case "Silver": startingValue = 300; break;
            case "Gold": startingValue = 600; break;
            case "Platinum": startingValue = 900; break;
            case "Diamond": startingValue = 1200; break;
            case "Onyx": startingValue = 1500; break;
        }
        if (this.tier === "Bronze") { return 0; }
        
        return startingValue + (50 * this.subTier - 50); 
    }

    public get nextTierStart(): number 
    { 
        return this.tierStart + 50;
    }

    constructor(data?: Partial<AutocodeRank>)
    {
        this.value = data?.value ?? 0;
        this.measurementMatchesRemaining = data?.measurement_matches_remaining ?? 0;
        this.tier = data?.tier ?? "Unranked";
        this.subTier = data?.sub_tier ?? 0;
        this.nextTier = data?.next_tier ?? "";
        this.nextSubTier = data?.next_sub_tier ?? 0;

        let tierImageSuffix = this.tier?.toLowerCase() || "unranked";
        if (tierImageSuffix !== "unranked") { tierImageSuffix += "-" + this.subTier; }
        this.tierImageUrl = data?.tier_image_url || "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/playlist-csrs/" + tierImageSuffix + ".png";
    }
 
    /** Gets the title */
    public GetTitle(): string
    {
        return this.tier === "Unranked" ? this.tier 
            : this.tier === "Onyx" ? this.tier + " " + this.value
            : this.tier + " " + this.subTier;
    }

    /** Gets the inline display */
    public GetDisplay(): string
    {
        if (this.tier === "Unranked") { return this.GetTitle(); }
        return this.GetTitle() + " - " + this.value.toLocaleString();
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