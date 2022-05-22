import { SCData } from "../../Database/SCData";
import { Appearance } from "../../Objects/Model/Appearance";
import { Player } from "../../Objects/Model/Player";
import { ServiceRecord } from "../../Objects/Model/ServiceRecord";

export interface ViewProps
{
    app: SCData;
    setLoadingMessage: (message: string) => void;
    setBackgroundLoadingProgress: (progress: number | undefined) => void;
    player?: Player;
    updatePlayer: (gamertag?: string, appearance?: Appearance, serviceRecord?: ServiceRecord, season?: number) => void;
    switchTab: (url: string, tab?: string) => void;
}