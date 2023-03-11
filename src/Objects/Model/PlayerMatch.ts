import { AutocodePlayerMatch } from "../../Database/Schemas/AutocodePlayerMatch";
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
    /** Was this a teams game? */
    public teamGame: boolean;
    /** Player statistics and results */
    public player: PlayerMatchPlayer;
    /** Arena or BTB */
    public experience: string;
    /** The datetime the match was played */
    public date: Date;
    /** The total duration of the match */
    public duration: TimePlayed;
    /** Expanded player details */
    public expandedPlayer: MatchPlayer;

    constructor(match?: AutocodePlayerMatch)
    {
        this.id = match?.id ?? "";
        this.variant = new GameVariant(match?.details?.gamevariant);
        this.map = new Map(match?.details?.map);
        this.playlist = new Playlist(match?.details?.playlist);
        this.teamGame = !!match?.teams?.enabled;
        this.player = new PlayerMatchPlayer(match?.player);
        this.experience = match?.experience ?? "";
        this.date = match?.played_at ? new Date(match.played_at) : new Date();
        this.duration = new TimePlayed(match?.duration);
        this.expandedPlayer = new MatchPlayer();
    }
}