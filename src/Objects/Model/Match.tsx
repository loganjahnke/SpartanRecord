import { HaloMap, HaloMode, YesNoAll } from "../../Database/ArrowheadFirebase";
import { Converter } from "../Helpers/Converter";
import { GameMode } from "../Pieces/GameMode";
import { Map } from "../Pieces/Map";
import { MatchPlayer } from "../Pieces/MatchPlayer";
import { Playlist } from "../Pieces/Playlist";
import { TimePlayed } from "../Pieces/TimePlayed";

export class Match
{
    /** The match ID */
    public id: string;
    /** The game mode details */
    public mode: GameMode;
    /** The map the match was played on */
    public haloMap: Map;
    /** The playlist */
    public playlist: Playlist;
    /** Was this a teams game? */
    public teamGame: boolean;
    /** Player statistics and results */
    public player: MatchPlayer;
    /** Arena or BTB */
    public experience: string;
    /** The datetime the match was played */
    public date: Date;
    /** The total duration of the match */
    public duration: TimePlayed;

    constructor(data?: any)
    {
        this.id = data?.id ?? "";
        this.mode = new GameMode(data?.details?.category);
        this.haloMap = new Map(data?.details?.map);
        this.playlist = new Playlist(data?.details?.playlist);
        this.teamGame = data?.teams?.enabled;
        this.player = new MatchPlayer(data?.player);
        this.experience = data?.experience ?? "";
        this.date = data?.played_at ? new Date(data.played_at) : new Date();
        this.duration = new TimePlayed(data?.duration);
    }
}

export class MatchFilter
{
    public map = HaloMap.All;
    public mode = HaloMode.All;
    public isRanked = YesNoAll.All;
    public isWin = YesNoAll.All;

    /** Determines if we are filtering on map */
    public HasMapFilter(): boolean { return this.map !== HaloMap.All; }
    /** Determines if we are filtering on mode */
    public HasModeFilter(): boolean { return this.mode !== HaloMode.All; }
    /** Determines if we are filtering on isRanked */
    public HasIsRankedFilter(): boolean { return this.isRanked !== YesNoAll.All; }
    /** Determines if we are filtering on isWin */
    public HasIsWinFilter(): boolean { return this.isWin !== YesNoAll.All; }

    /**
     * If all the filters are set to All, then the filter is empty
     * @returns true if all filters are set to All
     */
    public IsEmpty(): boolean
    {
        return !this.HasMapFilter()
            && !this.HasModeFilter()
            && !this.HasIsRankedFilter()
            && !this.HasIsWinFilter();
    }

    /**
     * Determines if a match meets the filter
     * @param match the match to evaluate
     * @returns true if the match meets the filter
     */
    public DoesMatchMeetFilter(match: Match): boolean
    {
        const conditionMaps = !this.HasMapFilter() || match.haloMap.name === this.map;
        const conditionMode = !this.HasModeFilter() || match.mode.name === this.mode;
        const conditionRank = !this.HasIsRankedFilter() || Converter.BooleanToYesNoAll(match.playlist.ranked) === this.isRanked;
        const conditionWins = !this.HasIsWinFilter() || Converter.BooleanToYesNoAll(match.player.outcome === "win") === this.isWin;

        return conditionMaps && conditionMode && conditionRank && conditionWins;
    }
}