import { SCData } from "../../Database/SCData";

export interface ViewProps
{
    app: SCData;
    setLoadingMessage: (message: string) => void;
    setBackgroundLoadingProgress: (progress: number | undefined) => void;
    setGamertag: (gamertag: string) => void;
}