import { StockpileSchema } from "../../Database/Schemas/ServiceRecordSchema";
import { TimePlayed } from "./TimePlayed";

export class Stockpile
{
	killsAsPowerSeedCarrier: number = 0;
	powerSeedCarriersKilled: number = 0;
	powerSeedsDeposited: number = 0;
	powerSeedsStolen: number = 0;
	timeAsPowerSeedCarrier: string = "";
	timeAsPowerSeedDriver: string = "";

	constructor(data?: StockpileSchema)
	{
		if (!data) { return; }
		this.killsAsPowerSeedCarrier = data.kills_as_power_seed_carrier;
		this.powerSeedCarriersKilled = data.power_seed_carriers_killed;
		this.powerSeedsDeposited = data.power_seeds_deposited;
		this.powerSeedsStolen = data.power_seeds_stolen;
		this.timeAsPowerSeedCarrier = new TimePlayed(data.time_as_power_seed_carrier)?.readable() ?? "";
		this.timeAsPowerSeedDriver = new TimePlayed(data.time_as_power_seed_driver)?.readable() ?? "";
	}
}