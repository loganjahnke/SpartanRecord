import { HaloOutcome } from "../../Database/ArrowheadFirebase";
import { AutocodePlayerMatchPlayer } from "../../Database/Schemas/AutocodePlayerMatch";
import { MatchCSRSummary } from "../Model/MatchCSRSummary";
import { Damage } from "./Damage";
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

    /** The damage efficiency per kill */
    public get damageEfficiency(): number
    {
        if (this.damage.dealt === 0 || this.summary.kills === 0) { return 0; }
        return this.PERFECT_KILL_DAMAGE / (this.damage.dealt / this.summary.kills);
    }

    /** The enemy damage efficiency per death */
    public get enemyDamageEfficiency(): number
    {
        if (this.damage.taken === 0 || this.summary.deaths === 0) { return 0; }
        return this.PERFECT_KILL_DAMAGE / (this.damage.taken / this.summary.deaths);
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

    constructor(data?: AutocodePlayerMatchPlayer)
    {
        this.team = new TeamDetails(data?.team);
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
            medals: data?.stats?.core?.summary?.medals ?? 0
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
            landed: data?.stats?.core?.shots?.landed ?? 0,
            missed: data?.stats?.core?.shots?.missed ?? 0,
            accuracy: data?.stats?.core?.shots?.accuracy ?? 0
        };

        this.csr = new MatchCSRSummary(data?.progression);
        this.kda = data?.stats?.core?.kda ?? 0;
        this.kdr = data?.stats?.core?.kdr ?? 0;
        this.rank = data?.rank ?? -1;
        this.won = data?.outcome === "win" || data?.outcome === "won";
        this.outcome = this.won ? HaloOutcome.Win
			: data?.outcome === "left" ? HaloOutcome.Left
			: data?.outcome === "loss" ? HaloOutcome.Loss
			: HaloOutcome.Draw;
    }
}