import { ReactElement } from "react";

import { CSRDataSchema, AutocodeRank } from "../../Database/Schemas/CSRSchema";
import { Tooltip } from "@mui/material";

import MouseRoundedIcon from '@mui/icons-material/MouseRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';
import MilitaryTechRoundedIcon from '@mui/icons-material/MilitaryTechRounded';

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

    constructor(data?: CSRDataSchema)
    {
        this.name = data?.name ?? "";
        this.queue = data?.properties?.queue ?? (data as any)?.queue ?? "Unknown";
        this.input = data?.properties?.input ?? (data as any)?.input ?? "Unknown";
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
        return <Tooltip disableFocusListener arrow title={this.__getIconTooltip()}>
            {this.queue === "open-queue" ? <ShuffleRoundedIcon fontSize="small" color="primary" /> :
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
    public GetJSON(): Partial<CSRDataSchema>
    {
        return {
            properties: {
                queue: (this.queue as any),
                input: (this.input as any),
                experience: "",
            },
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
        //queue: "open-queue" | "solo-duo" | null;
	    //input: "controller" | "mnk" | "crossplay" | null;
        
        const q = this.queue === "open-queue" ? "Open" : this.queue === "solo-duo" ? "Solo-Duo" : "N/A";
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
        if (this.tier === "Unranked") { return this.tier; }
        if (this.tier === "Onyx") { return this.tier + " - " + this.value.toLocaleString(); }
        return this.tier + " " + this.subTier + " - " + this.value.toLocaleString();
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

    /** Gets the outline color for a tier */
    public GetOutline(): string
    {
        return this.tier === "Onyx" ? "1px solid #5E3D19 !important" : "";
    }

    /** Gets the background gradient for a tier */
    public GetBackground(): string
    {
        return this.tier === "Bronze" 
            ? "linear-gradient(to right, #a16447 0%, #a16447 20%, #633522 50%, #7e462e 80%, #7e462e 100%)" :
        this.tier === "Silver" 
            ? "linear-gradient(to right, #d3d3d3 0%, #d3d3d3 20%, #a6a6a6 50%, #b8b8b8 80%, #b8b8b8 100%)" :
        this.tier === "Gold" 
            ? "linear-gradient(to right, #b9aa57 0%, #b9aa57 20%, #583e1b 50%, #a2854e 80%, #a2854e 100%)" :
        this.tier === "Platinum" 
            ? "linear-gradient(to right, #8e93cc 0%, #8e93cc 20%, #c1d0d0 50%, #5a6276 80%, #5a6276 100%)" :
        this.tier === "Diamond" 
            ? "linear-gradient(to right, #88c6f9 0%, #88c6f9 20%, #58beed 50%, #5078c0 80%, #5078c0 100%)" :
        this.tier === "Onyx" 
            ? "linear-gradient(to left, #bb8c41 0%, #bb8c41 20%, #8c6e34 50%, #ffffba 80%, #ffffba 100%)"
        /* Unranked */ 
            : "linear-gradient(to left, #FFFFFF 0%, #ffffda 20%, #EFEFEF 50%, #ffffda 80%, #FCFCFC 100%)"
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