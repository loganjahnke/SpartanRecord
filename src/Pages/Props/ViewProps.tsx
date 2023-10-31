import { SRTabs } from "../../Assets/Components/Layout/AHDrawer";
import { SCData } from "../../Database/SCData";
import { CareerRankSchema } from "../../Database/Schemas/CareerRankSchema";
import { Appearance } from "../../Objects/Model/Appearance";
import { CSRS } from "../../Objects/Model/CSRS";
import { Player } from "../../Objects/Model/Player";
import { ServiceRecord } from "../../Objects/Model/ServiceRecord";
import { MMR } from "../../Objects/Pieces/MMR";

export interface ViewProps
{
    app: SCData;
    setLoadingMessage: (message: string) => void;
    setBackgroundLoadingProgress: (progress: string) => void;
    player?: Player;
    updatePlayer: (gamertag?: string, appearance?: Appearance, serviceRecord?: ServiceRecord, csrs?: CSRS[], careerRank?: CareerRankSchema, isPrivate?: boolean, oldPlayer?: Player) => void;
    switchTab: (url?: string, tab?: SRTabs) => void;
    isSubscribedToPatreon?: boolean;
    setApiError: (error: boolean) => void;
}