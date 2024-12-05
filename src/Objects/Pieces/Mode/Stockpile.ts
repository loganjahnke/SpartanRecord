import { StockpileSchema } from "../../../Database/Schemas/ServiceRecordSchema";
import { TimePlayed } from "../TimePlayed";

export class Stockpile
{
	public killsAsPowerSeedCarrier: number = 0;
	public powerSeedCarriersKilled: number = 0;
	public powerSeedsDeposited: number = 0;
	public powerSeedsStolen: number = 0;
	public timeAsPowerSeedCarrierData: TimePlayed = new TimePlayed();
	public get timeAsPowerSeedCarrier(): string
	{
		return this.timeAsPowerSeedCarrierData.readable() ?? "";
	}

	public timeAsPowerSeedDriverData: TimePlayed = new TimePlayed();
	public get timeAsPowerSeedDriver(): string
	{
		return this.timeAsPowerSeedDriverData.readable() ?? "";
	}

	constructor(data?: StockpileSchema)
	{
		if (!data) { return; }
		this.killsAsPowerSeedCarrier = data.kills_as_power_seed_carrier;
		this.powerSeedCarriersKilled = data.power_seed_carriers_killed;
		this.powerSeedsDeposited = data.power_seeds_deposited;
		this.powerSeedsStolen = data.power_seeds_stolen;
		this.timeAsPowerSeedCarrierData = new TimePlayed(data.time_as_power_seed_carrier);
		this.timeAsPowerSeedDriverData = new TimePlayed(data.time_as_power_seed_driver);
	}

	/**
     * Adds a Stockpile to this Stockpile
     * @param other the other Stockpile
     */
	public add(other: Stockpile): void
	{
		if (!other) { return; }
		this.killsAsPowerSeedCarrier += other.killsAsPowerSeedCarrier;
		this.powerSeedCarriersKilled += other.powerSeedCarriersKilled;
		this.powerSeedsDeposited += other.powerSeedsDeposited;
		this.powerSeedsStolen += other.powerSeedsStolen;
		this.timeAsPowerSeedCarrierData.add(other.timeAsPowerSeedCarrierData);
		this.timeAsPowerSeedDriverData.add(other.timeAsPowerSeedDriverData);
	}
}