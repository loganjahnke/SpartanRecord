import { AudioLogs } from "../Pieces/AudioLogs";
import { Difficulty } from "../Pieces/Difficulty";

export class CampaignRecord
{
    /** The number of skulls found */
    skulls: number;
    /** The number FOBs secured */
    fobSecured: number;
    /** The number of spartan cores found */
    spartanCores: number;
    /** The number of missions completed */
    missionCompleted: number;
    /** The number of propoganda towers destroyed */
    propagandaTowersDestroyed: number;
    /** The number of audio logs found */
    audioLogs: AudioLogs;
    /** The highest difficult completed */
    difficulty: Difficulty;

    constructor(data?: any)
    {
        this.skulls = data?.skulls;
        this.fobSecured = data?.fob_secured;
        this.spartanCores = data?.spartan_cores;
        this.missionCompleted = data?.mission_completed;
        this.propagandaTowersDestroyed = data?.propaganda_towers_destroyed;
        this.audioLogs = new AudioLogs(data?.audio_logs);
        this.difficulty = new Difficulty(data?.difficulty);
    }
}
  
  