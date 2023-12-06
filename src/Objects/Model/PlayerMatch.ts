import { PlayerMatchWithOddsSchema } from "../../Database/Schemas/PlayerMatchSchema";
import { GameVariant } from "../Pieces/GameVariant";
import { Map } from "../Pieces/Map";
import { MatchPlayer } from "../Pieces/MatchPlayer";
import { PlayerMatchPlayer } from "../Pieces/PlayerMatchPlayer";
import { Playlist } from "../Pieces/Playlist";
import { TimePlayed } from "../Pieces/TimePlayed";

export class PlayerMatch
{
    /** The match ID */
    public id: string;
    /** The game variant details */
    public variant: GameVariant;
    /** The map the match was played on */
    public map: Map;
    /** The playlist */
    public playlist: Playlist;
    /** Player statistics and results */
    public player: PlayerMatchPlayer;
    /** PVP or PVE */
    public interaction: string;
    /** Arena or BTB */
    public experience: string;
    /** The datetime the match was played */
    public date: Date;
    /** The total duration of the match */
    public duration: TimePlayed;
    /** Expanded player details */
    public expandedPlayer: MatchPlayer;
    /** The odds of playing this experience again */
    public odds: number;

    constructor(match?: PlayerMatchWithOddsSchema)
    {
        this.id = match?.id ?? "";
        this.variant = new GameVariant(match?.details?.ugcgamevariant);
        this.map = new Map(match?.details?.map);
        this.playlist = new Playlist(match?.details?.playlist);
        this.player = new PlayerMatchPlayer(match?.player);
        this.interaction = match?.properties?.interaction ?? "";
        this.experience = match?.properties?.experience ?? "";
        this.date = match?.started_at ? new Date(match.started_at) : new Date();
        this.duration = new TimePlayed(match?.playable_duration);
        this.expandedPlayer = new MatchPlayer();
        this.odds = match?.odds ?? 0;
    }
}