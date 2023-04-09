import { HaloOutcome } from "../../Database/ArrowheadFirebase";
import { MatchSchema } from "../../Database/Schemas/MatchSchema";
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

    /** The title of the match */
    public get title(): string
    {
        return this.mode.name + " on " + this.map.name;
    }

    /** Gets the name of the winning team/player */
    public get winner(): string
    {
        if (this.teamGame)
        {
            // Team game winner
            if (!this.teams || this.teams.length < 1) { return ""; }
            
            const copy = [...this.teams];
            copy.sort((a, b) => a.statistics.totalPoints < b.statistics.totalPoints ? 1 : -1);
            if (!copy || copy.length < 1) { return ""; }
            
            return copy[0].details.name;
        }

        // FFA winner
        if (!this.players || this.players.length < 1) { return ""; }
            
        const winners = this.players.filter(p => p.won);
        if (!winners || winners.length < 1) { return ""; }

        return winners[0].gamertag;
    }

    /** Should we show points separate from kills? */
    public get showPoints(): boolean
    {
        if (this.teamGame)
        {
            return this.teams.some(team => team.statistics.summary.kills !== team.statistics.totalPoints);
        }
        
        return this.players.some(player => player.stats.summary.kills !== player.stats.totalPoints);
    }

    constructor(match?: MatchSchema)
    {
        this.id = match?.data?.id ?? "";
        this.mode = new GameVariant(match?.data?.details?.ugcgamevariant);
        this.map = new Map(match?.data?.details?.map);
        this.playlist = new Playlist(match?.data?.details?.playlist);
        this.teamGame = (!!match?.data?.teams && match.data.teams.length > 0);
        this.experience = match?.data?.properties?.experience ?? "";
        this.type = match?.data?.properties?.type === "custom" 
            ? "Custom"
            : match?.data?.properties?.type === "local" 
            ? "Local"
            : "Matchmaking";
        this.date = match?.data?.started_at ? new Date(match.data?.started_at) : new Date();
        this.duration = new TimePlayed(match?.data?.playable_duration);
        this.teams = [];
        this.players = [];
        this.best = { score: 0, points: 0, kills: 0, deaths: Number.MAX_VALUE, assists: 0 };

        if (match?.data?.teams)
        {
            for (const team of match.data.teams)
            {
                const t = new Team(team, match.data.players);
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
        
        if (match?.data?.players)
        {
            for (const player of match.data.players)
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

    /**
     * Gets a reference to the winning player in the match
     * @returns the winning match player
     */
    public GetWinningPlayer(): MatchPlayer
    {
        const gamertag = this.winner;
        const filtered = this.players.filter(player => player.gamertag === gamertag);
        if (!filtered || filtered.length < 1) { return new MatchPlayer(); }
        return filtered[0];
    }

    /**
     * Gets a reference to the 2nd place player in the match
     * @returns the 2nd place match player
     */
    public GetSecondPlacePlayer(): MatchPlayer
    {
        // Team game winner
        if (!this.players || this.players.length < 2) { return new MatchPlayer(); }
            
        const copy = [...this.players];
        copy.sort((a, b) => a.stats.totalPoints < b.stats.totalPoints ? 1 : -1);
        if (!copy || copy.length < 2) { return new MatchPlayer(); }
        
        return copy[1];
    }

    /**
     * Gets a reference to a specific player in the match
     * @param gamertag the gamertag to get the player for
     * @returns the match player for the gamertag
     */
    public GetMyPlayer(gamertag: string): MatchPlayer
    {
        const filtered = this.players.filter(player => player.gamertag === gamertag);
        if (!filtered || filtered.length < 1) { return new MatchPlayer(); }
        return filtered[0];
    }
}