import { HaloMap, HaloMode, HaloOutcome, HaloRanked } from "../../Database/ArrowheadFirebase";
import { AutocodeMatch } from "../../Database/Schemas/AutocodeMatch";
import { AutocodePlayerMatch } from "../../Database/Schemas/AutocodePlayerMatch";
import { GameVariant } from "../Pieces/GameVariant";
import { Map } from "../Pieces/Map";
import { MatchPlayer } from "../Pieces/MatchPlayer";
import { Playlist } from "../Pieces/Playlist";
import { Team } from "../Pieces/Team";
import { TimePlayed } from "../Pieces/TimePlayed";

export class Match
{
    /** The match ID */
    public id: string;
    /** The game mode details */
    public mode: GameVariant;
    /** The map the match was played on */
    public map: Map;
    /** The playlist */
    public playlist: Playlist;
    /** Was this a teams game? */
    public teamGame: boolean;
    /** Arena or BTB */
    public experience: string;
    /** Matchmaking, custom, or local */
    public type: string;
    /** The datetime the match was played */
    public date: Date;
    /** The total duration of the match */
    public duration: TimePlayed;
    /** The teams (for team games) */
    public teams: Team[];
    /** The players (for FFA games) */
    public players: MatchPlayer[];
    /** High scores */
    public best: { score: number, points: number, kills: number, deaths: number, assists: number };

    constructor(match?: AutocodeMatch)
    {
        this.id = match?.id ?? "";
        this.mode = new GameVariant(match?.match?.details?.gamevariant);
        this.map = new Map(match?.match?.details?.map);
        this.playlist = new Playlist(match?.match?.details?.playlist);
        this.teamGame = !!match?.match?.teams?.enabled;
        this.experience = match?.match?.experience ?? "";
        this.type = match?.match?.type === "custom" 
            ? "Custom"
            : match?.match?.type === "local" 
            ? "Local"
            : "Matchmaking";
        this.date = match?.match?.played_at ? new Date(match.match?.played_at) : new Date();
        this.duration = new TimePlayed(match?.match?.duration);
        this.teams = [];
        this.players = [];
        this.best = { score: 0, points: 0, kills: 0, deaths: Number.MAX_VALUE, assists: 0 };

        if (match?.match?.teams?.details)
        {
            for (const team of match.match.teams.details)
            {
                const t = new Team(team, match.match.players);
                this.teams.push(t);
                for (const player of t.players)
                {
                    if (player.outcome === HaloOutcome.Left) { continue; }
                    this.best.score = player.stats.totalScore > this.best.score ? player.stats.totalScore : this.best.score;
                    this.best.points = player.stats.totalPoints > this.best.points ? player.stats.totalPoints : this.best.points;
                    this.best.kills = player.stats.summary.kills > this.best.kills ? player.stats.summary.kills : this.best.kills;
                    this.best.deaths = player.stats.summary.deaths < this.best.deaths ? player.stats.summary.deaths : this.best.deaths;
                    this.best.assists = player.stats.summary.assists > this.best.assists ? player.stats.summary.assists : this.best.assists;
                }
            }
        }
        
        if (match?.match?.players)
        {
            for (const player of match.match.players)
            {
                const mp = new MatchPlayer(player);
                if (!mp) { continue; }
                this.players.push(mp);
                if (mp.outcome === HaloOutcome.Left) { continue; }
                this.best.score = mp.stats.totalScore > this.best.score ? mp.stats.totalScore : this.best.score;
                this.best.points = mp.stats.totalPoints > this.best.points ? mp.stats.totalPoints : this.best.points;
                this.best.kills = mp.stats.summary.kills > this.best.kills ? mp.stats.summary.kills : this.best.kills;
                this.best.deaths = mp.stats.summary.deaths < this.best.deaths ? mp.stats.summary.deaths : this.best.deaths;
                this.best.assists = mp.stats.summary.assists > this.best.assists ? mp.stats.summary.assists : this.best.assists;
            }
        }
    }
}