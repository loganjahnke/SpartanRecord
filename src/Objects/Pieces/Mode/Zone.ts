import { TimePlayed } from "../TimePlayed";

export class Zone
{
	public zoneOccupationTimeData: TimePlayed = new TimePlayed();
	public zoneCaptures: number = 0;
	public zoneDefensiveKills: number = 0;
	public zoneOffensiveKills: number = 0;
	public zoneScoringTicks: number = 0;
	public zoneSecures: number = 0;
	public get zoneOccupationTime(): string
	{
		return this.zoneOccupationTimeData.readable() ?? "";
	}

	constructor(data?: any)
	{
		if (!data) { return; }
		this.zoneCaptures = data.zone_captures;
		this.zoneDefensiveKills = data.zone_defensive_kills;
		this.zoneOffensiveKills = data.zone_offensive_kills;
		this.zoneScoringTicks = data.zone_scoring_ticks;
		this.zoneSecures = data.zone_secures;
		this.zoneOccupationTimeData = new TimePlayed(data.total_zone_occupation_time);
	}

	/**
     * Adds a Zone to this Zone
     * @param other the other Zone
     */
	public add(other: Zone): void
	{
		if (!other) { return; }
		this.zoneCaptures += other.zoneCaptures;
		this.zoneDefensiveKills += other.zoneDefensiveKills;
		this.zoneOffensiveKills += other.zoneOffensiveKills;
		this.zoneScoringTicks += other.zoneScoringTicks;
		this.zoneSecures += other.zoneSecures;
		this.zoneOccupationTimeData.add(other.zoneOccupationTimeData);
	}
}