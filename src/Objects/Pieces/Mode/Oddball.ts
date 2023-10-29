import { OddballSchema } from "../../../Database/Schemas/ServiceRecordSchema";
import { TimePlayed } from "../TimePlayed";

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
		this.longestTimeAsSkullCarrier = new TimePlayed(data.longest_time_as_skull_carrier)?.readable() ?? "";
		this.skullCarriersKilled = data.skull_carriers_killed;
		this.skullGrabs = data.skull_grabs;
		this.skullScoringTicks = data.skull_scoring_ticks;
		this.timeAsSkullCarrier = new TimePlayed(data.time_as_skull_carrier)?.readable() ?? "";
	}
}