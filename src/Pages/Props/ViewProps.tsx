import { Arrowhead } from "../../Database/Arrowhead";

export interface ViewProps
{
    app: Arrowhead;
    setLoadingMessage: (message: string) => void;
}