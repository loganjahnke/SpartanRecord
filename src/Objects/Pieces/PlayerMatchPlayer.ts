import { HaloOutcome } from "../../Database/ArrowheadFirebase";
import { PlayerMatchPlayerSchema, Scores } from "../../Database/Schemas/PlayerMatchSchema";
import { CTFSchema, OddballSchema, ZoneSchema, EliminationSchema, StockpileSchema, ExtractionSchema, InfectionSchema, ZoneServiceRecordSchema, FirefightSchema } from "../../Database/Schemas/ServiceRecordSchema";
import { AllMedals } from "../Helpers/AllMedals";
import { MatchCSRSummary } from "../Model/MatchCSRSummary";
import { Damage } from "./Damage";
import { Expectation } from "./Expectation";
import { Medal, MedalRarity, MedalType } from "./Medal";
import { Shots } from "./Shots";
import { Summary } from "./Summary";
import { TeamDetails } from "./TeamDetails";

export class PlayerMatchPlayer
{
    /** The damage needed for a perfect kill */
    private readonly PERFECT_KILL_DAMAGE = 225;
    
    /** Team details */
    public team: TeamDetails;
	/** Contains summary information */
    public summary: Summary;
    /** Contains information about the damage taken and dealt */
    public damage: Damage;
    /** Accuracy statistics */
    public shots: Shots;
    /** Contains all medals */
    public medals: Medal[];
    /** Ranking in the match */
    public rank: number;
    /** Outcome */
    public outcome: HaloOutcome;
    /** Was this a win? */
    public won: boolean;    
    /** The KDA for the player */
    public kda: number;
    /** The KDR for the player */
    public kdr: number;
    /** The CSR for the player */
    public csr: MatchCSRSummary;
    /** The scores for the player */
    public scores: Scores;
    /** Expected kill performance */
    public killExpectations: Expectation;
    /** Expected death performance */
    public deathExpectations: Expectation;
    /** Mode statistics */
    public mode?: CTFSchema | OddballSchema | ZoneSchema | EliminationSchema | StockpileSchema | ExtractionSchema | InfectionSchema | ZoneServiceRecordSchema | FirefightSchema;
    /** Arena or BTB */
    public experience: string;

    /** The damage efficiency per kill */
    public get damageEfficiency(): number
    {
        if (this.damage.dealt === 0 || this.summary.kills === 0) { return 0; }
        return this.PERFECT_KILL_DAMAGE / (this.damage.dealt / this.summary.kills);
    }

    /** The total number of kills you could've gotten if your damage was 100% effective */
    public get maximumKillsFromDamage(): number
    {
        if (this.damage.dealt === 0) { return 0; }
        return Math.round((this.damage.dealt / this.PERFECT_KILL_DAMAGE) * 10) / 10;
    }

    /** The enemy damage efficiency per death */
    public get enemyDamageEfficiency(): number
    {
        if (this.damage.taken === 0 || this.summary.deaths === 0) { return 0; }
        return this.PERFECT_KILL_DAMAGE / (this.damage.taken / this.summary.deaths);
    }

    /** The total number of deaths you could've gotten if the enemy's damage was 100% effective */
    public get maximumDeathsFromDamage(): number
    {
        if (this.damage.taken === 0) { return 0; }
        return Math.round((this.damage.taken / this.PERFECT_KILL_DAMAGE) * 10) / 10;
    }

    /** The rank of the player in a string format */
    public get placement(): string
    {
        if (this.rank === 1) { return "1st"; }
        if (this.rank === 2) { return "2nd"; }
        if (this.rank === 3) { return "3rd"; }
        if (this.rank < 21) { return this.rank + "th"; }
        if (this.rank % 10 === 1) { return this.rank + "st"; }
        if (this.rank % 10 === 2) { return this.rank + "nd"; }
        if (this.rank % 10 === 3) { return this.rank + "rd"; }

        return this.rank + "th";
    }

    /** The XP for the player in the match */
    public get xp(): number
    {
        if (this.experience === "btb") 
        { 
            const modifiedXP = this.scores.personal * 1.8;
            return Math.floor(modifiedXP / 10) * 10; 
        }
        return this.scores.personal;
    }

    constructor(data?: PlayerMatchPlayerSchema, matchExperience?: string)
    {
        this.team = new TeamDetails(data?.properties?.team);
        this.summary = 
        {
            kills: data?.stats?.core?.summary?.kills ?? 0,
            deaths: data?.stats?.core?.summary?.deaths ?? 0,
            assists: data?.stats?.core?.summary?.assists ?? 0,
            betrayals: data?.stats?.core?.summary?.betrayals ?? 0,
            suicides: data?.stats?.core?.summary?.suicides ?? 0,
            vehicles:
            {
                destroys: data?.stats?.core?.summary?.vehicles?.destroys ?? 0,
                hijacks: data?.stats?.core?.summary?.vehicles?.hijacks ?? 0
            },
            medals: data?.stats?.core?.summary?.medals.total ?? 0,
            maxKillingSpree: data?.stats?.core?.summary?.max_killing_spree ?? 0
        };

        this.damage =
        {
            taken: data?.stats?.core?.damage?.taken ?? 0,
            dealt: data?.stats?.core?.damage?.dealt ?? 0,
            average: data?.stats?.core?.damage?.dealt ?? 0
        };

        this.shots = 
        {
            fired: data?.stats?.core?.shots?.fired ?? 0,
            landed: data?.stats?.core?.shots?.hit ?? 0,
            missed: data?.stats?.core?.shots?.missed ?? 0,
            accuracy: data?.stats?.core?.shots?.accuracy ?? 0
        };

        this.medals = [];
        if (data?.stats?.core?.breakdown?.medals && data?.stats?.core?.breakdown?.medals.length > 0)
        {
            this.medals = data?.stats?.core?.breakdown.medals.map((data: any) => 
            {
                const medal = new Medal(data);
                const parent = (AllMedals as any)[(medal.id)];
                medal.name = parent?.name ?? data?.name ?? data?.id ?? "";
                medal.rarity = parent?.type ?? MedalRarity.Normal;
                medal.type = parent?.category ?? MedalType.Unknown;
                medal.sort = parent?.sort ?? -1;
                medal.description = parent?.description ?? data?.description ?? "N/A";
                medal.images = {
                    small: parent?.image_urls?.small ?? "",
                    medium: parent?.image_urls?.medium ?? "",
                    large: parent?.image_urls?.large ?? ""
                };
                return medal;
            });
        }

        this.mode = data?.stats?.mode;
        this.killExpectations = new Expectation(data?.performances?.kills);
        this.deathExpectations = new Expectation(data?.performances?.deaths);
        this.csr = new MatchCSRSummary(data?.progression);
        this.kda = data?.stats?.core?.kda ?? 0;
        this.kdr = data?.stats?.core?.kdr ?? 0;
        this.rank = data?.rank ?? -1;
        this.won = data?.outcome === "win" || data?.outcome === "won";
        this.scores = data?.stats?.core?.scores ?? { personal: 0, points: 0 };
        this.experience = matchExperience ?? "arena";
        this.outcome = this.won ? HaloOutcome.Win
			: data?.outcome === "dnf" ? HaloOutcome.Left
			: data?.outcome === "loss" ? HaloOutcome.Loss
			: HaloOutcome.Draw;
    }
}