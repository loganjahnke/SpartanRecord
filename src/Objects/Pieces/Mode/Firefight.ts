import { FirefightSchema } from "../../../Database/Schemas/ServiceRecordSchema";

export class Firefight
{
	public boss_kills: number = 0;
	public brute_kills: number = 0;
	public elite_kills: number = 0;
	public grunt_kills: number = 0;
	public hunter_kills: number = 0;
	public jackal_kills: number = 0;
	public marine_kills: number = 0;
	public sentinel_kills: number = 0;
	public skimmer_kills: number = 0;

	constructor(data?: FirefightSchema)
	{
		if (!data) { return; }
		this.boss_kills = data.boss_kills ?? 0;
		this.brute_kills = data.brute_kills ?? 0;
		this.elite_kills = data.elite_kills ?? 0;
		this.grunt_kills = data.grunt_kills ?? 0;
		this.hunter_kills = data.hunter_kills ?? 0;
		this.jackal_kills = data.jackal_kills ?? 0;
		this.marine_kills = data.marine_kills ?? 0;
		this.sentinel_kills = data.sentinel_kills ?? 0;
		this.skimmer_kills = data.skimmer_kills ?? 0;
	}
}