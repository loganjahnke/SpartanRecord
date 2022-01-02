import { YesNoAll } from "../../Database/ArrowheadFirebase";

export class Converter
{
    /**
     * Converts a boolean to a YesNoAll enum
     * @param bool the boolean
     * @returns YesNoAll value
     */
    public static BooleanToYesNoAll(bool: boolean)
    {
        if (bool) { return YesNoAll.Yes; }
        return YesNoAll.No;
    }
}