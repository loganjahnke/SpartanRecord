import { HaloMap, HaloMode, HaloOutcome, HaloRanked } from "../../Database/ArrowheadFirebase";
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
    public map: Map;
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
        this.map = new Map(data?.details?.map);
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
    public map = HaloMap.Aquarius;
    public mode = HaloMode.CTF;
    public isRanked = HaloRanked.No;
    public outcome = HaloOutcome.Win;

    public static IsMapFilter(filter?: string)
    {
        return filter === HaloMap.Aquarius 
            || filter === HaloMap.Bazaar 
            || filter === HaloMap.Behemoth 
            || filter === HaloMap.Deadlock 
            || filter === HaloMap.Fragmentation 
            || filter === HaloMap.Highpower 
            || filter === HaloMap.LaunchSite 
            || filter === HaloMap.LiveFire 
            || filter === HaloMap.Recharge 
            || filter === HaloMap.Streets;
    }

    public static IsModeFilter(filter?: string)
    {
        return filter === HaloMode.CTF 
            || filter === HaloMode.FFASlayer 
            || filter === HaloMode.Fiesta 
            || filter === HaloMode.Oddball 
            || filter === HaloMode.Slayer 
            || filter === HaloMode.Stockpile 
            || filter === HaloMode.Strongholds 
            || filter === HaloMode.TacticalSlayer 
            || filter === HaloMode.TotalControl;
    }

    public static IsOutcomeFilter(filter?: string)
    {
        return filter === HaloOutcome.Win 
            || filter === HaloOutcome.Loss 
            || filter === HaloOutcome.Draw  
            || filter === HaloOutcome.Left;
    }

    public static IsRankedFilter(filter?: string)
    {
        return filter === HaloRanked.Yes 
            || filter === HaloRanked.No;
    }

    public static GetFilterSubTab(filter?: string)
    {
        return filter === HaloMap.Aquarius || filter === HaloMode.CTF || filter === HaloOutcome.Win || filter === HaloRanked.Yes
            ? 0 
        : filter === HaloMap.Bazaar || filter === HaloMode.FFASlayer || filter === HaloOutcome.Loss || filter === HaloRanked.No
            ? 1
        : filter === HaloMap.Behemoth || filter === HaloMode.Fiesta || filter === HaloOutcome.Draw
            ? 2
        : filter === HaloMap.Deadlock || filter === HaloMode.Oddball || filter === HaloOutcome.Left
            ? 3
        : filter === HaloMap.Fragmentation || filter === HaloMode.Slayer
            ? 4
        : filter === HaloMap.Highpower || filter === HaloMode.Stockpile
            ? 5
        : filter === HaloMap.LaunchSite || filter === HaloMode.Strongholds
            ? 6
        : filter === HaloMap.LiveFire || filter === HaloMode.TacticalSlayer
            ? 7
        : filter === HaloMap.Recharge || filter === HaloMode.TotalControl
            ? 8
        : filter === HaloMap.Streets
            ? 9
        : -1;
    }

    public static GetFilterTitle(filter?: string): string
    {
        if (MatchFilter.IsMapFilter(filter) || MatchFilter.IsModeFilter(filter)) { return filter ?? ""; }
        if (filter === HaloOutcome.Win) { return "Wins"; }
        if (filter === HaloOutcome.Loss) { return "Losses"; }
        if (filter === HaloOutcome.Draw) { return "Draws"; }
        if (filter === HaloOutcome.Left) { return "Left Early"; }
        if (filter === HaloRanked.Yes) { return "Ranked"; }
        if (filter === HaloRanked.No) { return "Social"; }

        return "";
    }
}