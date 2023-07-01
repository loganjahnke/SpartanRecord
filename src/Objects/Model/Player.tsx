import { AppearanceSchema } from "../../Database/Schemas/AppearanceSchema";
import { CareerRankSchema, EmptyCareerRank } from "../../Database/Schemas/CareerRankSchema";
import { ServiceRecordSchema } from "../../Database/Schemas/ServiceRecordSchema";
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
    /** The career rank for the player */
    public careerRank: CareerRankSchema;
    /** Last match ID */
    public lastMatchID: string;
    /** The raw appearance data */
    public appearanceData?: AppearanceSchema;
    /** A hashset with the seasons that a player has statistics for in Firebase */
    public hasStatsForSeason: Set<number>;
    /** The raw service record data */
    private _serviceRecordData?: ServiceRecordSchema;
    public get serviceRecordData() { return this._serviceRecordData; }
    public set serviceRecordData(value: ServiceRecordSchema | undefined) 
    { 
        this._serviceRecordData = value;
    }
    /** Is this player private? */
    public isPrivate: boolean = false;

    constructor(gamertag?: string, serviceRecord?: ServiceRecord, history?: ServiceRecord[], appearance?: Appearance, mmr?: MMR, csrs?: CSRS[], campaignRecord?: CampaignRecord)
    {
        this.gamertag = gamertag ?? "";
        this.serviceRecord = serviceRecord ?? new ServiceRecord();
        this.historicStats = history;
        this.appearance = appearance ?? new Appearance();
        this.mmr = mmr ?? new MMR();
        this.csrs = csrs ?? [];
        this.careerRank = EmptyCareerRank();
        this.campaignRecord = campaignRecord;
        this.lastMatchID = "";
        this.hasStatsForSeason = new Set<number>();
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
        newPlayer.isPrivate = player.isPrivate;
        newPlayer.careerRank = player.careerRank;
        return newPlayer;
    }

    /**
     * Gets the player's current best CSR
     * @returns the player's current best CSR
     */
    public GetBestCurrentCSR(): CSRS
    {
        let max = 0;
        let best = new CSRS();
        for (const csr of this.csrs)
        {
            if (max < csr.ranks.current.value)
            {
                max = csr.ranks.current.value;
                best = csr;
            }
        }

        return best;
    }

    /**
     * Gets the player's all-time best CSR
     * @returns the player's all-time best CSR
     */
    public GetBestAllTimeCSR(): CSRS
    {
        let max = 0;
        let best = new CSRS();
        for (const csr of this.csrs)
        {
            if (max < csr.ranks.allTime.value)
            {
                max = csr.ranks.allTime.value;
                best = csr;
            }
        }

        return best;
    }

    /** Gets the open crossplay CSR */
    public GetOpenCrossplay(): CSRS
    {
        for (const csr of this.csrs)
        {
            if (csr.queue === "open" && csr.input === "crossplay") { return csr; }
        }

        return new CSRS();
    }

    /** Gets the MnK solo duo CSR */
    public GetMnKSoloDuo(): CSRS
    {
        for (const csr of this.csrs)
        {
            if (csr.queue === "solo-duo" && csr.input === "mnk") { return csr; }
        }

        return new CSRS();
    }

    /** Gets the controller solo duo CSR */
    public GetControllerSoloDuo(): CSRS
    {
        for (const csr of this.csrs)
        {
            if (csr.queue === "solo-duo" && csr.input === "controller") { return csr; }
        }

        return new CSRS();
    }
}