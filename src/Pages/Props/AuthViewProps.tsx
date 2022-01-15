import { Arrowhead } from "../../Database/Arrowhead";

export interface AuthViewProps
{
    app: Arrowhead;
    setLoadingMessage: (message: string) => void;
    afterAuth: (success: boolean) => void;
    registering?: boolean;
}