import { AutocodeAppearance } from "../../Database/Schemas/AutocodeAppearance";
import { AutocodeMultiplayerServiceRecord } from "../../Database/Schemas/AutocodeMultiplayerServiceRecord";
import { MMR } from "../Pieces/MMR";
import { Appearance } from "./Appearance";
import { CampaignRecord } from "./CampaignRecord";
import { CSRS } from "./CSRS";
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
    /** The player's MMR */
    public mmr: MMR;
    /** The player's CSRS */
    public csrs: CSRS[];
    /** Last match ID */
    public lastMatchID: string;
    /** The raw appearance data */
    public appearanceData?: AutocodeAppearance;
    /** The raw service record data */
    public serviceRecordData?: AutocodeMultiplayerServiceRecord;

    constructor(gamertag?: string, serviceRecord?: ServiceRecord, history?: ServiceRecord[], appearance?: Appearance, mmr?: MMR, csrs?: CSRS[], campaignRecord?: CampaignRecord)
    {
        this.gamertag = gamertag ?? "";
        this.serviceRecord = serviceRecord ?? new ServiceRecord();
        this.historicStats = history;
        this.appearance = appearance ?? new Appearance();
        this.mmr = mmr ?? new MMR();
        this.csrs = csrs ?? [];
        this.campaignRecord = campaignRecord;
        this.lastMatchID = "";
    }

    /**
     * Creates a copy of the player (not really a deep copy, but kinda close)
     * @param player the player
     * @returns the new player
     */
    public static Copy(player: Player): Player
    {
        const newPlayer = new Player(player.gamertag, player.serviceRecord, player.historicStats, player.appearance, player.mmr, [...player.csrs], player.campaignRecord)
        newPlayer.lastMatchID = player.lastMatchID;
        newPlayer.appearanceData = player.appearanceData;
        newPlayer.serviceRecordData = player.serviceRecordData;
        return newPlayer;
    }
}