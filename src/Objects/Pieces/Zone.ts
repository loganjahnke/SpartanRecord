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
		this.zoneOccupationTime = data.stronghold_occupation_time?.human ?? "";
		this.zoneCaptures = data.stronghold_captures;
		this.zoneDefensiveKills = data.stronghold_defensive_kills;
		this.zoneOffensiveKills = data.stronghold_offensive_kills;
		this.zoneScoringTicks = data.stronghold_scoring_ticks;
		this.zoneSecures = data.stronghold_secures;
	}
}