import { HaloOutcome } from "../../Database/ArrowheadFirebase";
import { AutocodePlayerMatchPlayer } from "../../Database/Schemas/AutocodePlayerMatch";
import { Damage } from "./Damage";
import { Shots } from "./Shots";
import { Summary } from "./Summary";
import { TeamDetails } from "./TeamDetails";

export class PlayerMatchPlayer
{
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