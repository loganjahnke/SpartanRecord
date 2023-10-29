import { ZoneSchema } from "../../../Database/Schemas/ServiceRecordSchema";
import { TimePlayed } from "../TimePlayed";

export class Zone
{
	public zoneOccupationTime: string = "";
	public zoneCaptures: number = 0;
	public zoneDefensiveKills: number = 0;
	public zoneOffensiveKills: number = 0;
	public zoneScoringTicks: number = 0;
	public zoneSecures: number = 0;

	constructor(data?: any)
	{
		if (!data) { return; }
		this.zoneOccupationTime = new TimePlayed(data.total_zone_occupation_time)?.readable() ?? "";
		this.zoneCaptures = data.zone_captures;
		this.zoneDefensiveKills = data.zone_defensive_kills;
		this.zoneOffensiveKills = data.zone_offensive_kills;
		this.zoneScoringTicks = data.zone_scoring_ticks;
		this.zoneSecures = data.zone_secures;
	}
}