import { SCData } from "../../Database/SCData";
import { Appearance } from "../../Objects/Model/Appearance";
import { CSRS } from "../../Objects/Model/CSRS";
import { Player } from "../../Objects/Model/Player";
import { ServiceRecord } from "../../Objects/Model/ServiceRecord";
import { MMR } from "../../Objects/Pieces/MMR";

export interface ViewProps
{
    app: SCData;
    setLoadingMessage: (message: string) => void;
    setBackgroundLoadingProgress: (progress: number | undefined) => void;
    player?: Player;
    updatePlayer: (gamertag?: string, appearance?: Appearance, serviceRecord?: ServiceRecord, mmr?: MMR, csrs?: CSRS[]) => void;
    switchTab: (url: string, tab?: string) => void;
    isAllowed?: boolean;
}