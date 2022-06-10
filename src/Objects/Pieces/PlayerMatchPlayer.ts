import { HaloOutcome } from "../../Database/ArrowheadFirebase";
import { AutocodePlayerMatchPlayer } from "../../Database/Schemas/AutocodePlayerMatch";
import { TeamDetails } from "./TeamDetails";

export class PlayerMatchPlayer
{
    /** Team details */
    public team: TeamDetails;
	/** Number of kills */
	public kills: number;
	/** Number of deaths */
	public deaths: number;
	/** Number of assists */
	public assists: number;
    /** Ranking in the match */
    public rank: number;
    /** Outcome */
    public outcome: HaloOutcome;
    /** Was this a win? */
    public won: boolean;
    
    /** The KDA for the player */
    public get kda(): number
    {
        return (this.kills + (this.assists / 3)) - this.deaths;
    }

    /** The KDR for the player */
    public get kdr(): number
    {
        return this.deaths > 0 ? this.kills / this.deaths : this.kills;
    }

    constructor(data?: AutocodePlayerMatchPlayer)
    {
        this.team = new TeamDetails(data?.team);
		this.kills = data?.stats?.core?.summary?.kills ?? 0;
		this.deaths = data?.stats?.core?.summary?.deaths ?? 0;
		this.assists = data?.stats?.core?.summary?.assists ?? 0;
        this.rank = data?.rank ?? -1;
        this.won = data?.outcome === "win" || data?.outcome === "won";
        this.outcome = this.won ? HaloOutcome.Win
			: data?.outcome === "left" ? HaloOutcome.Left
			: data?.outcome === "loss" ? HaloOutcome.Loss
			: HaloOutcome.Draw;
    }
}