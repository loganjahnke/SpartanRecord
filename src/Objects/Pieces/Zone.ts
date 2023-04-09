import { ZoneSchema } from "../../Database/Schemas/ServiceRecordSchema";

export class Zone
{
	public zoneOccupationTime: string = "";
	public zoneCaptures: number = 0;
	public zoneDefensiveKills: number = 0;
	public zoneOffensiveKills: number = 0;
	public zoneScoringTicks: number = 0;
	public zoneSecures: number = 0;

	constructor(data?: ZoneSchema)
	{
		if (!data) { return; }
		this.zoneOccupationTime = data.total_zone_occupation_time?.human ?? "";
		this.zoneCaptures = data.zone_captures;
		this.zoneDefensiveKills = data.zone_defensive_kills;
		this.zoneOffensiveKills = data.zone_offensive_kills;
		this.zoneScoringTicks = data.zone_scoring_ticks;
		this.zoneSecures = data.zone_secures;
	}
}