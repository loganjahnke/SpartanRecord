import { HaloMap, HaloMode, HaloOutcome, HaloRanked, ServiceRecordFilter } from "../../Database/ArrowheadFirebase";
import { Appearance } from "./Appearance";
import { CampaignRecord } from "./CampaignRecord";
import { CSRS } from "./CSRS";
import { Match } from "./Match";
import { ServiceRecord } from "./ServiceRecord";

export class Player
{
    /** The player's gamertag */
    public gamertag: string;
    /** The player's current service record */
    public serviceRecord: ServiceRecord;
    /** The player's placement among their peers */
    public campaignRecord: CampaignRecord | undefined;
    /** The player's historic service records */
    public historicStats: ServiceRecord[] | undefined;
    /** The player's appearance */
    public appearance: Appearance;
    /** All matches */
    public matches: Match[];
    /** The player's ranks */
    public ranks: CSRS[];

    /** Match indexes for maps, stored locally */
    public MatchIDsToMatchIndex: Map<string, number> = new Map<string, number>();
    /** Service record filtered per map, stored locally */
    public MapToServiceRecord: Map<HaloMap, ServiceRecord> = new Map<HaloMap, ServiceRecord>();
    /** Service record filtered per mode, stored locally */
    public ModeToServiceRecord: Map<HaloMode, ServiceRecord> = new Map<HaloMode, ServiceRecord>();
    /** Service record filtered per ranked, stored locally */
    public IsRankedToServiceRecord: Map<string, ServiceRecord> = new Map<HaloRanked, ServiceRecord>();
    /** Service record filtered per outcome, stored locally */
    public OutcomeToServiceRecord: Map<string, ServiceRecord> = new Map<HaloOutcome, ServiceRecord>();

    constructor(gamertag?: string, serviceRecord?: ServiceRecord, history?: ServiceRecord[], appearance?: Appearance, matches?: Match[], ranks?: CSRS[], campaignRecord?: CampaignRecord)
    {
        this.gamertag = gamertag ?? "";
        this.serviceRecord = serviceRecord ?? new ServiceRecord();
        this.historicStats = history;
        this.appearance = appearance ?? new Appearance();
        this.matches = matches ?? [];
        this.campaignRecord = campaignRecord;
        this.ranks = ranks ?? [];
    }

    /**
     * Gets a service record containing the matches
     * @returns combined service record
     */
    public GetServiceRecordOfMatches(): ServiceRecord
    {
        let sr = new ServiceRecord();
        for (const match of this.matches)
        {
            const stats = match.player?.stats;
            const outcome = match.player?.outcome;
            sr.AddServiceRecord(stats, outcome);
        }
        return sr;
    }

    /**
     * Gets the match from the match ID, if we have it
     * @param matchID the match ID to find
     * @returns match object or undefined if we don't have it
     */
    public GetMatchFromID(matchID: string): Match | undefined
    {
        const matchIndex = this.MatchIDsToMatchIndex.get(matchID);
        if (matchIndex && this.matches.length > matchIndex)
        {
            return this.matches[matchIndex];
        }
    }

    /**
     * Adds a match to the match array and indexes the ID
     * @param match the match to add
     */
    public AddMatch(match: Match): void
    {
        const matchID = match.id;
        const matchIndex = this.matches.push(match) - 1;
        this.MatchIDsToMatchIndex.set(matchID, matchIndex);
    } 

    /**
	 * Sets the service record for the filter locally
	 * @param tree the filter tree
	 * @param filter the map/mode/outcome/rank filter
	 */
    public SetFilteredServiceRecord(tree: ServiceRecordFilter, filter: HaloMap | HaloMode | HaloRanked | HaloOutcome, serviceRecord: ServiceRecord): void
    {
        switch (tree)
        {
            case ServiceRecordFilter.Map:
                this.MapToServiceRecord.set(filter as HaloMap, serviceRecord);
                break;
            case ServiceRecordFilter.Mode:
                this.ModeToServiceRecord.set(filter as HaloMode, serviceRecord);
                break;
            case ServiceRecordFilter.IsRanked:
                this.IsRankedToServiceRecord.set(filter as HaloRanked, serviceRecord);
                break;
            case ServiceRecordFilter.Outcome:
                this.OutcomeToServiceRecord.set(filter as HaloOutcome, serviceRecord);
                break;
        }
    }

    /**
	 * Gets the service record for the filter locally, if possible
	 * @param gamertag: the gamertag to get
	 * @param tree the filter tree
	 * @param filter the map/mode/outcome/rank filter
	 * @returns the service record for the filter
	 */
    public GetFilteredServiceRecord(tree: ServiceRecordFilter, filter: HaloMap | HaloMode | HaloRanked | HaloOutcome): ServiceRecord | undefined
    {
        switch (tree)
        {
            case ServiceRecordFilter.Map:
                return this.MapToServiceRecord.get(filter as HaloMap);
            case ServiceRecordFilter.Mode:
                return this.ModeToServiceRecord.get(filter as HaloMode);
            case ServiceRecordFilter.IsRanked:
                return this.IsRankedToServiceRecord.get(filter as HaloRanked);
            case ServiceRecordFilter.Outcome:
                return this.OutcomeToServiceRecord.get(filter as HaloOutcome);
        }
    }

    /**
     * Gets the highest current CSRS
     * @returns the highest current CSRS
     */
    public GetHighestCurrentRank(): CSRS | undefined
    {
        if (!this.ranks || this.ranks.length <= 0) { return undefined; }

        let highest: CSRS = this.ranks[0];
        for (const rank of this.ranks)
        {
            if (rank.ranks.current.value > highest.ranks.current.value)
            {
                highest = rank;
            }
        }

        return highest;
    }
}