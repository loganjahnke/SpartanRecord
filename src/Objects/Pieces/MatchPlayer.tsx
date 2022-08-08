import { HaloOutcome } from "../../Database/ArrowheadFirebase";
import { AutocodeHelpers } from "../../Database/Schemas/AutocodeHelpers";
import { AutocodeMatchPlayer } from "../../Database/Schemas/AutocodeMatch";
import { ServiceRecord } from "../Model/ServiceRecord";
import { Expectation } from "./Expectation";
import { Progression } from "./Progression";
import { TeamDetails } from "./TeamDetails";

export class MatchPlayer
{
    /** The player's gamertag */
    public gamertag: string;
    /** Player type */
    public type: "bot" | "player";
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

    constructor(data?: AutocodeMatchPlayer, isRanked: boolean = false, timePlayedInSeconds: number = 0)
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
        
        if (!data) { return; }
        
        this.gamertag = data.details.name;
        this.type = data.details.type;
        this.team = new TeamDetails(data.team);
        this.stats = new ServiceRecord(AutocodeHelpers.CreateServiceRecordFromMatch(this.gamertag, data, timePlayedInSeconds));
        this.rank = data.rank;
        this.joinedInProgress = data.participation.joined_in_progress;
        this.progression = new Progression(data.progression);
        this.killExpectations = new Expectation(data.performances?.kills);
        this.deathExpectations = new Expectation(data.performances?.deaths);
        this.mmr = data.stats.mmr ?? 0;
        this.won = data.outcome === "win" || data.outcome === "won";
        this.outcome = this.won ? HaloOutcome.Win
            : data?.outcome === "left" ? HaloOutcome.Left
            : data?.outcome === "loss" ? HaloOutcome.Loss
            : HaloOutcome.Draw;
    }
}