import { InfectionSchema } from "../../../Database/Schemas/ServiceRecordSchema";
import { TimePlayed } from "../TimePlayed";

export class Infection
{
	public alphas_killed: number = 0;
	public infected_killed: number = 0;
	public kills_as_last_spartan_standing: number = 0;
	public last_spartans_standing_infected: number = 0;
	public rounds_as_alpha: number = 0;
	public rounds_as_last_spartan_standing: number = 0;
	public rounds_finished_as_infected: number = 0;
	public rounds_survived_as_last_spartan_standing: number = 0;
	public rounds_survived_as_spartan: number = 0;
	public spartans_infected: number = 0;
	public spartans_infected_as_alpha: number = 0;
	public time_as_last_spartan_standing: TimePlayed = new TimePlayed();

	constructor(data?: InfectionSchema)
	{
		if (!data) { return; }
		this.alphas_killed = data.alphas_killed;
		this.infected_killed = data.infected_killed;
		this.kills_as_last_spartan_standing = data.kills_as_last_spartan_standing;
		this.last_spartans_standing_infected = data.last_spartans_standing_infected;
		this.rounds_as_alpha = data.rounds_as_alpha;
		this.rounds_as_last_spartan_standing = data.rounds_as_last_spartan_standing;
		this.rounds_finished_as_infected = data.rounds_finished_as_infected;
		this.rounds_survived_as_last_spartan_standing = data.rounds_survived_as_last_spartan_standing;
		this.rounds_survived_as_spartan = data.rounds_survived_as_spartan;
		this.spartans_infected = data.spartans_infected;
		this.spartans_infected_as_alpha = data.spartans_infected_as_alpha;
		this.time_as_last_spartan_standing = new TimePlayed(data.time_as_last_spartan_standing);
	}

	/**
     * Adds a Infection to this Infection
     * @param other the other Infection
     */
	public add(other: Infection): void
	{
		if (!other) { return; }
		this.alphas_killed += other.alphas_killed;
		this.infected_killed += other.infected_killed;
		this.kills_as_last_spartan_standing += other.kills_as_last_spartan_standing;
		this.last_spartans_standing_infected += other.last_spartans_standing_infected;
		this.rounds_as_alpha += other.rounds_as_alpha;
		this.rounds_as_last_spartan_standing += other.rounds_as_last_spartan_standing;
		this.rounds_finished_as_infected += other.rounds_finished_as_infected;
		this.rounds_survived_as_last_spartan_standing += other.rounds_survived_as_last_spartan_standing;
		this.rounds_survived_as_spartan += other.rounds_survived_as_spartan;
		this.spartans_infected += other.spartans_infected;
		this.spartans_infected_as_alpha += other.spartans_infected_as_alpha;
		this.time_as_last_spartan_standing.add(other.time_as_last_spartan_standing);
	}
}