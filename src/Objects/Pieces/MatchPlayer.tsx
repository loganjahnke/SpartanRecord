import { HaloOutcome } from "../../Database/ArrowheadFirebase";
import { ServiceRecord } from "../Model/ServiceRecord";
import { Progression } from "./Progression";
import { TeamDetails } from "./TeamDetails";

export class MatchPlayer
{
    /** The player's gamertag */
    public gamertag: string;
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

    constructor(data?: any)
    {
        this.gamertag = data?.gamertag;
        this.team = new TeamDetails(data?.team);
        this.stats = new ServiceRecord(data?.stats);
        this.rank = data?.rank ?? -1;
        this.outcome = data?.outcome ?? "";
        this.won = this.outcome === HaloOutcome.Win;
        this.joinedInProgress = data?.participation?.joined_in_progress;
        this.progression = new Progression(data?.progression);
    }
}