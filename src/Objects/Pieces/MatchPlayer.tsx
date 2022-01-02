import { ServiceRecord } from "../Model/ServiceRecord";
import { Team } from "./Team";

export class MatchPlayer
{
    /** Team details */
    public team: Team;
    /** Player statistics */
    public stats: ServiceRecord;
    /** Ranking in the match */
    public rank: number;
    /** Outcome */
    public outcome: string;
    /** Was this a win? */
    public won: boolean;
    /** Was this game joined after it started? */
    public joinedInProgress: boolean;

    constructor(data?: any)
    {
        this.team = new Team(data?.team);
        this.stats = new ServiceRecord(data?.stats);
        this.rank = data?.rank ?? -1;
        this.outcome = data?.outcome ?? "";
        this.won = this.outcome === "win";
        this.joinedInProgress = data?.participation?.joined_in_progress;
    }
}