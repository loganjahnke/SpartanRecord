import { HaloOutcome } from "../../Database/ArrowheadFirebase";
import { Assists, Breakdown, Kills } from "../../Database/Schemas/PlayerMatchSchema";
import { ServiceRecordMatchesSchema } from "../../Database/Schemas/ServiceRecordSchema";

export enum BreakdownCategory
{
     melee,
     grenades,
     headshots,
     powerWeapons,
     assassinations,
     splatters,
     repulsor,
     fusionCoil,
     sticks,
}

export class Breakdowns
{
    /** Breakdowns on kills */
    public kills: BreakdownKills;
    /** Breakdowns on assists */
    public assists: BreakdownAssists;
    /** Breakdowns on matches */
    public matches: BreakdownMatches;

    constructor(breakdown?: Breakdown, matches?: ServiceRecordMatchesSchema)
    {
        this.kills = new BreakdownKills(breakdown?.kills);
        this.assists = new BreakdownAssists(breakdown?.assists);
        this.matches = new BreakdownMatches(matches);
    }

    /** Adds one Breakdowns to this one */
    public add(other: Breakdowns): void
    {
        this.kills.add(other.kills);
        this.assists.add(other.assists);
        this.matches.add(other.matches);
    }

    /** Adds one Breakdowns to this one */
    public addMatch(outcome: HaloOutcome): void
    {
        this.matches.addMatch(outcome);
    }
}

export class BreakdownKills
{
    /** Melee kills */
    public melee: number = 0;
    /** Kills with frag, plasma, spike, and shock grenades */
    public grenades: number = 0;
    /** Kills on the head */
    public headshots: number = 0;
    /** Big boy weapon kills */
    public powerWeapons: number = 0;
    /** Beat em from behind */
    public assassinations: number = 0;
    /** Splat */
    public splatters: number = 0;
    /** Backup please */
    public repulsor: number = 0;
    /** Kong */
    public fusionCoil: number = 0;
    /** Plasma sticks */
    public sticks: number = 0;

    constructor(data?: Kills)
    {
        this.melee = data?.melee ?? 0;
        this.grenades = data?.grenades ?? 0;
        this.headshots = data?.headshots ?? 0;
        this.powerWeapons = data?.power_weapons ?? 0;
        this.assassinations = data?.assassinations ?? 0;
        this.splatters = data?.vehicles?.splatters ?? 0;
        this.repulsor = data?.miscellaneous?.repulsor ?? 0;
        this.fusionCoil = data?.miscellaneous?.fusion_coils ?? 0;
        this.sticks = data?.sticks ?? 0;
    }

    /** Returns the top category */
    public getTopCategory(): BreakdownCategory
    {
        let topCategory = BreakdownCategory.melee;
        let topCount = this.melee;

        if (this.grenades > topCount) { topCategory = BreakdownCategory.grenades; topCount = this.grenades; }
        if (this.headshots > topCount) { topCategory = BreakdownCategory.headshots; topCount = this.headshots; }
        if (this.powerWeapons > topCount) { topCategory = BreakdownCategory.powerWeapons; topCount = this.powerWeapons; }
        if (this.assassinations > topCount) { topCategory = BreakdownCategory.assassinations; topCount = this.assassinations; }
        if (this.splatters > topCount) { topCategory = BreakdownCategory.splatters; topCount = this.splatters; }
        if (this.repulsor > topCount) { topCategory = BreakdownCategory.repulsor; topCount = this.repulsor; }
        if (this.fusionCoil > topCount) { topCategory = BreakdownCategory.fusionCoil; topCount = this.fusionCoil; }
        if (this.sticks > topCount) { topCategory = BreakdownCategory.sticks; topCount = this.sticks; }

        return topCategory;
    }

    /** Adds one BreakdownKills to this one */
    public add(other: BreakdownKills): void
    {
        this.melee += other.melee;
        this.grenades += other.grenades;
        this.headshots += other.headshots;
        this.powerWeapons += other.powerWeapons;
        this.assassinations += other.assassinations;
        this.splatters += other.splatters;
        this.repulsor += other.repulsor;
        this.fusionCoil += other.fusionCoil;
        this.sticks += other.sticks;
    }
}

export class BreakdownAssists
{
    /** EMP assists (plasma pistol, etc) */
    public emp: number;
    /** Driving assists, you go Forza player */
    public driver: number;
    /** Callout assists */
    public callouts: number;

    constructor(data?: Assists)
    {
        this.emp = data?.emp ?? 0;
        this.driver = data?.driver ?? 0;
        this.callouts = data?.callouts ?? 0;
    }

    /** Adds one BreakdownAssists to this one */
    public add(other: BreakdownAssists): void
    {
        this.emp += other.emp;
        this.driver += other.driver;
        this.callouts += other.callouts;
    }
}

export class BreakdownMatches
{
    /** Total wins */
    public wins: number;
    /** Total losses */
    public losses: number;
    /** Total matches left */
    public left: number;
    /** Total ties */
    public draws: number;

    constructor(data?: ServiceRecordMatchesSchema)
    {
        this.wins = data?.wins ?? 0;
        this.losses = data?.losses ?? 0;
        this.draws = data?.ties ?? 0;
        this.left = 0;
    }

    /** Adds one BreakdownMatches to this one */
    public add(other: BreakdownMatches): void
    {
        this.wins += other.wins;
        this.losses += other.losses;
        this.left += other.left;
        this.draws += other.draws;
    }

    /** Adds one match to this */
    public addMatch(outcome: HaloOutcome): void
    {
        this.wins += (outcome === HaloOutcome.Win ? 1 : 0);
        this.losses += (outcome === HaloOutcome.Loss ? 1 : 0);
        this.left += (outcome === HaloOutcome.Draw ? 1 : 0);
        this.draws += (outcome === HaloOutcome.Left ? 1 : 0);
    }
}