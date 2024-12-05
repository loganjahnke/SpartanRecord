import { OddballSchema } from "../../../Database/Schemas/ServiceRecordSchema";
import { TimePlayed } from "../TimePlayed";

export class Oddball
{
	public killsAsSkullCarrier: number = 0;
	public skullCarriersKilled: number = 0;
	public skullGrabs: number = 0;
	public skullScoringTicks: number = 0;
	public timeAsSkullCarrierData: TimePlayed = new TimePlayed();
	public get timeAsSkullCarrier(): string
	{
		return this.timeAsSkullCarrierData.readable() ?? "";
	}
	
	public longestTimeAsSkullCarrierData: TimePlayed = new TimePlayed();
	public get longestTimeAsSkullCarrier(): string
	{
		return this.longestTimeAsSkullCarrierData.readable() ?? "";
	}

	constructor(data?: OddballSchema)
	{
		if (!data) { return; }
		this.killsAsSkullCarrier = data.kills_as_skull_carrier;
		this.skullCarriersKilled = data.skull_carriers_killed;
		this.skullGrabs = data.skull_grabs;
		this.skullScoringTicks = data.skull_scoring_ticks;
		this.longestTimeAsSkullCarrierData = new TimePlayed(data.longest_time_as_skull_carrier);
		this.timeAsSkullCarrierData = new TimePlayed(data.time_as_skull_carrier);
	}

	/**
     * Adds a Oddball to this Oddball
     * @param other the other Oddball
     */
	public add(other: Oddball): void
	{
		if (!other) { return; }
		this.killsAsSkullCarrier += other.killsAsSkullCarrier;
		this.skullCarriersKilled += other.skullCarriersKilled;
		this.skullGrabs += other.skullGrabs;
		this.skullScoringTicks += other.skullScoringTicks;
		this.longestTimeAsSkullCarrierData.add(other.longestTimeAsSkullCarrierData);
		this.timeAsSkullCarrierData.add(other.timeAsSkullCarrierData);
	}
}