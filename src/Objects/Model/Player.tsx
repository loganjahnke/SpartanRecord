import { HaloMap, HaloMode } from "../../Database/ArrowheadFirebase";
import { Appearance } from "./Appearance";
import { Match, MatchFilter } from "./Match";
import { ServiceRecord } from "./ServiceRecord";

export class Player
{
    /** The player's gamertag */
    public gamertag: string;
    /** The player's current service record */
    public serviceRecord: ServiceRecord;
    /** The player's placement among their peers */
    public placement: ServiceRecord;
    /** The player's historic service records */
    public historicStats: ServiceRecord[] | undefined;
    /** The player's appearance */
    public appearance: Appearance;
    /** All matches */
    public matches: Match[];

    /** Match indexes for maps, stored locally */
    public MatchIDsToMatchIndex: Map<string, number> = new Map<string, number>();
    /** Match indexes for maps, stored locally */
    public MapToMatchIDs: Map<HaloMap, string[]> = new Map<HaloMap, string[]>();
    /** Match indexes for modes, stored locally */
    public ModeToMatchIDs: Map<HaloMode, string[]> = new Map<HaloMode, string[]>();
    /** Match indexes for is ranked, stored locally */
    public IsRankedToMatchIDs: Map<boolean, string[]> = new Map<boolean, string[]>();
    /** Match indexes for is win, stored locally */
    public IsWinToMatchIDs: Map<boolean, string[]> = new Map<boolean, string[]>();

    constructor(gamertag?: string, serviceRecord?: ServiceRecord, history?: ServiceRecord[], appearance?: Appearance, matches?: Match[])
    {
        this.gamertag = gamertag ?? "";
        this.serviceRecord = serviceRecord ?? new ServiceRecord();
        this.historicStats = history;
        this.appearance = appearance ?? new Appearance();
        this.matches = matches ?? [];
        this.placement = new ServiceRecord();
    }

    /**
     * Constructs a single service record based on the filters provided by looping through the match history
     * @param map The map
     * @param mode The game mode
     * @param isRanked Was the match ranked
     * @param isWin Was the match a win
     */
    public GetServiceRecordForFilter(filter: MatchFilter): ServiceRecord
    {
        if (!this.matches || this.matches.length === 0) { return new ServiceRecord(); }
        if (filter.IsEmpty()) { return this.serviceRecord; }

        const filtered = this.matches.filter(match => filter.DoesMatchMeetFilter(match))
        if (filtered.length === 0) { return new ServiceRecord(); }

        const mapped = filtered.map(match => match.player.stats);
        if (mapped.length === 0) { return new ServiceRecord(); }

        return mapped.reduce((prev, curr) => prev?.AddServiceRecord(curr) ?? curr);
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
}