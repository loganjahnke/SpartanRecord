import { HaloOutcome } from "../../Database/ArrowheadFirebase";
import { MatchPlayerSchema } from "../../Database/Schemas/MatchSchema";
import { Scores } from "../../Database/Schemas/PlayerMatchSchema";
import { MatchCSRSummary } from "../Model/MatchCSRSummary";
import { ServiceRecord } from "../Model/ServiceRecord";
import { Expectation } from "./Expectation";
import { Progression } from "./Progression";
import { TeamDetails } from "./TeamDetails";

export class MatchPlayer
{
    /** The damage needed for a perfect kill */
    private readonly PERFECT_KILL_DAMAGE = 225;

    /** The player's gamertag */
    public gamertag: string;
    /** Player type */
    public type: string;
    /** Team details */
    public team: TeamDetails;
    /** Player statistics */
    public stats: ServiceRecord;
    /** Ranking in the match */
    public rank: number;
    /** Outcome */
    public outcome: HaloOutcome;
    /** Was this a win? */
    public won: boolean;
    /** Was this game joined after it started? */
    public joinedInProgress: boolean;
    /** Progression */
    public progression: Progression;
    /** MMR */
    public mmr: number = 0;
    /** Expected kill performance */
    public killExpectations: Expectation;
    /** Expected death performance */
    public deathExpectations: Expectation;
    /** Left early? */
    public leftEarly: boolean;
    /** The CSR for the player */
    public csr: MatchCSRSummary;
    /** The scores for the player */
    public scores: Scores;

    /** The damage efficiency per kill */
    public get damageEfficiency(): number
    {
        if (this.stats.damage.dealt === 0 || this.stats.summary.kills === 0) { return 0; }
        return this.PERFECT_KILL_DAMAGE / (this.stats.damage.dealt / this.stats.summary.kills);
    }

    /** The total number of kills you could've gotten if your damage was 100% effective */
    public get maximumKillsFromDamage(): number
    {
        if (this.stats.damage.dealt === 0) { return 0; }
        return Math.round((this.stats.damage.dealt / this.PERFECT_KILL_DAMAGE) * 10) / 10;
    }

    /** The enemy damage efficiency per death */
    public get enemyDamageEfficiency(): number
    {
        if (this.stats.damage.taken === 0 || this.stats.summary.deaths === 0) { return 0; }
        return this.PERFECT_KILL_DAMAGE / (this.stats.damage.taken / this.stats.summary.deaths);
    }

    /** The total number of deaths you could've gotten if the enemy's damage was 100% effective */
    public get maximumDeathsFromDamage(): number
    {
        if (this.stats.damage.taken === 0) { return 0; }
        return Math.round((this.stats.damage.taken / this.PERFECT_KILL_DAMAGE) * 10) / 10;
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

    constructor(data?: MatchPlayerSchema, isRanked: boolean = false, timePlayedInSeconds: number = 0)
    {
        this.gamertag = "";
        this.type = "player";
        this.team = new TeamDetails();
        this.stats = new ServiceRecord();
        this.rank = -1
        this.outcome = HaloOutcome.Draw;
        this.won = false;
        this.joinedInProgress = false;
        this.progression = new Progression();
        this.killExpectations = new Expectation();
        this.deathExpectations = new Expectation();
        this.leftEarly = false;
        this.csr = new MatchCSRSummary();
        this.scores = { personal: 0, points: 0 };
        
        if (!data) { return; }
        
        this.gamertag = data.name;
        this.type = data.properties.type;
        this.team = new TeamDetails(data.properties.team);
        this.stats = new ServiceRecord(data.stats);
        this.rank = data.rank;
        this.joinedInProgress = data.participation.joined_in_progress;
        this.progression = new Progression(data.progression);
        this.killExpectations = new Expectation(data.performances?.kills);
        this.deathExpectations = new Expectation(data.performances?.deaths);
        this.mmr = data.stats.mmr ?? 0;
        this.won = data.outcome === "win" || data.outcome === "won";
        this.leftEarly = !data.participation.presence.completion;
        this.csr = new MatchCSRSummary(data.progression);
        this.scores = data.stats.core.scores;
        this.outcome = this.won ? HaloOutcome.Win
            : data?.outcome === "left" ? HaloOutcome.Left
            : data?.outcome === "loss" ? HaloOutcome.Loss
            : HaloOutcome.Draw;
    }
}