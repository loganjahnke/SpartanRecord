import { AutocodeCTFMode } from "../../Database/Schemas/AutocodeMultiplayerServiceRecord";

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
	public timeAsCarrier: string = "";

	constructor(data?: AutocodeCTFMode)
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
		this.timeAsCarrier = data.time_as_flag_carrier?.human ?? "";
	}
}