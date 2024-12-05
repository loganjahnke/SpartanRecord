import { CTFSchema } from "../../../Database/Schemas/ServiceRecordSchema";
import { TimePlayed } from "../TimePlayed";

export class CaptureTheFlag
{
	public flagCaptureAssists: number = 0;
	public flagCaptures: number = 0;
	public flagCarriersKilled: number = 0;
	public flagGrabs: number = 0;
	public flagReturnersKilled: number = 0;
	public flagReturns: number = 0;
	public flagSecures: number = 0;
	public flagSteals: number = 0;
	public killsAsFlagCarrier: number = 0;
	public killsAsFlagReturner: number = 0;
	public timeAsCarrier: TimePlayed = new TimePlayed();

	constructor(data?: CTFSchema)
	{
		if (!data) { return; }
		this.flagCaptureAssists = data.flag_capture_assists;
		this.flagCaptures = data.flag_captures;
		this.flagCarriersKilled = data.flag_carriers_killed;
		this.flagGrabs = data.flag_grabs;
		this.flagReturnersKilled = data.flag_returners_killed;
		this.flagReturns = data.flag_returns;
		this.flagSecures = data.flag_secures;
		this.flagSteals = data.flag_steals;
		this.killsAsFlagCarrier = data.kills_as_flag_carrier;
		this.killsAsFlagReturner = data.kills_as_flag_returner;
		this.timeAsCarrier = new TimePlayed(data.time_as_flag_carrier);
	}

	/**
     * Adds a CaptureTheFlag to this CaptureTheFlag
     * @param other the other CaptureTheFlag
     */
	public add(other: CaptureTheFlag): void
	{
		if (!other) { return; }
		this.flagCaptureAssists += other.flagCaptureAssists;
		this.flagCaptures += other.flagCaptures;
		this.flagCarriersKilled += other.flagCarriersKilled;
		this.flagGrabs += other.flagGrabs;
		this.flagReturnersKilled += other.flagReturnersKilled;
		this.flagReturns += other.flagReturns;
		this.flagSecures += other.flagSecures;
		this.flagSteals += other.flagSteals;
		this.killsAsFlagCarrier += other.killsAsFlagCarrier;
		this.killsAsFlagReturner += other.killsAsFlagReturner;
		this.timeAsCarrier.add(other.timeAsCarrier);
	}
}