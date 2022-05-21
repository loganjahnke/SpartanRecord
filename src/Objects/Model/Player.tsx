import { AutocodeAppearance } from "../../Database/Schemas/AutocodeAppearance";
import { AutocodeMultiplayerServiceRecord } from "../../Database/Schemas/AutocodeMultiplayerServiceRecord";
import { Appearance } from "./Appearance";
import { CampaignRecord } from "./CampaignRecord";
import { ServiceRecord } from "./ServiceRecord";

export class Player
{
    /** The player's gamertag */
    public gamertag: string;
    /** The player's current service record */
    public serviceRecord: ServiceRecord;
    /** The player's placement among their peers */
    public campaignRecord: CampaignRecord | undefined;
    /** The player's historic service records */
    public historicStats: ServiceRecord[] | undefined;
    /** The player's appearance */
    public appearance: Appearance;
    /** Last match ID */
    public lastMatchID: string;

    public season: number = -1;

    public appearanceData?: AutocodeAppearance;
    public serviceRecordData?: AutocodeMultiplayerServiceRecord;

    constructor(gamertag?: string, serviceRecord?: ServiceRecord, history?: ServiceRecord[], appearance?: Appearance, campaignRecord?: CampaignRecord)
    {
        this.gamertag = gamertag ?? "";
        this.serviceRecord = serviceRecord ?? new ServiceRecord();
        this.historicStats = history;
        this.appearance = appearance ?? new Appearance();
        this.campaignRecord = campaignRecord;
        this.lastMatchID = "";
    }
}