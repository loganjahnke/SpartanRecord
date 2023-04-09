import { OddballSchema } from "../../Database/Schemas/ServiceRecordSchema";

export class Oddball
{
	public killsAsSkullCarrier: number = 0;
	public longestTimeAsSkullCarrier: string = "";
	public skullCarriersKilled: number = 0;
	public skullGrabs: number = 0;
	public skullScoringTicks: number = 0;
	public timeAsSkullCarrier: string = "";

	constructor(data?: OddballSchema)
	{
		if (!data) { return; }
		this.killsAsSkullCarrier = data.kills_as_skull_carrier;
		this.longestTimeAsSkullCarrier = data.longest_time_as_skull_carrier?.human ?? "";
		this.skullCarriersKilled = data.skull_carriers_killed;
		this.skullGrabs = data.skull_grabs;
		this.skullScoringTicks = data.skull_scoring_ticks;
		this.timeAsSkullCarrier = data.time_as_skull_carrier?.human ?? "";
	}
}