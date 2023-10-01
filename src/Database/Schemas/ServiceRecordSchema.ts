import { DurationSchema } from "./PlayerMatchSchema";

/**
 * Determines if the object is a service record schema
 * @param object the object to check
 * @returns true if it is a service record schema
 */
export function isServiceRecordSchema(object: any): object is ServiceRecordSchema
{
	if (object === undefined || object === null) { return false; }
	if ("data" in object)
	{
		return "matches" in object.data &&
			"stats" in object.data &&
			"time_played" in object.data;
	}

	return false;
}

export type ServiceRecordSchema = {
	data: ServiceRecordDataSchema;
	additional: {
		query: any
	};
};

export type ServiceRecordDataSchema = {
	matches: ServiceRecordMatchesSchema
	stats: ServiceRecordStatsSchema;
	time_played: DurationSchema;
};

export type ServiceRecordMatchesSchema = {
	completed: number;
	losses: number;
	ties: number;
	wins: number;
}

export type ServiceRecordStatsSchema = {
	core: ServiceRecordCoreSchema;
	modes: {
		capture_the_flag: CTFSchema;
		elimination: EliminationSchema;
		oddball: OddballSchema;
		zones: ZoneSchema;
		stockpile: StockpileSchema;
	};
}

export type ServiceRecordCoreSchema = {
	summary: {
		kills: number;
		deaths: number;
		assists: number;
		betrayals: number;
		suicides: number;
		max_killing_spree: number;
		spawns: number;
		vehicles: {
			destroys: number;
			hijacks: number;
		};
		medals: {
			total: number;
			unique: number;
		};
	};
	damage: {
		taken: number;
		dealt: number;
	};
	shots: {
		fired: number;
		hit: number;
		missed: number;
		accuracy: number;
	};
	rounds: {
		won: number;
		lost: number;
		tied: number;
	};
	breakdown: {
		kills: {
			melee: number;
			grenades: number;
			headshots: number;
			power_weapons: number;
			assassinations: number;
			sticks: number;
			vehicles: {
				splatters: number;
			};
			miscellaneous: {
				repulsor: number;
				fusion_coils: number;
			};
		};
		assists: {
			emp: number;
			driver: number;
			callouts: number;
		};
		vehicles: {
			destroys: Array < {
				value: string;
				count: number;
			} > ;
			hijacks: Array < {
				value: string;
				count: number;
			} > ;
		};
		medals: Array <{ id: number; count: number; }>;
	};
	kda: number;
	kdr: number;
	scores: {
		personal: number;
		points: number;
	};
}

export interface CTFSchema 
{
	flag_capture_assists: number;
	flag_captures: number;
	flag_carriers_killed: number;
	flag_grabs: number;
	flag_returners_killed: number;
	flag_returns: number;
	flag_secures: number;
	flag_steals: number;
	kills_as_flag_carrier: number;
	kills_as_flag_returner: number;
	time_as_flag_carrier: DurationSchema;
};

export interface EliminationSchema 
{
	allies_revived: number;
	elimination_assists: number;
	eliminations: number;
	enemy_revives_denied: number;
	executions: number;
	kills_as_last_player_standing: number;
	last_players_standing_killed: number;
	rounds_survived: number;
	times_revived_by_ally: number;
};

export interface OddballSchema 
{
	kills_as_skull_carrier: number;
	longest_time_as_skull_carrier: DurationSchema;
	skull_carriers_killed: number;
	skull_grabs: number;
	skull_scoring_ticks: number;
	time_as_skull_carrier: DurationSchema;
};

export interface ZoneSchema 
{
	stronghold_occupation_time: DurationSchema;
	stronghold_captures: number;
	stronghold_defensive_kills: number;
	stronghold_offensive_kills: number;
	stronghold_scoring_ticks: number;
	stronghold_secures: number;
};

export interface StockpileSchema 
{
	kills_as_power_seed_carrier: number;
	power_seed_carriers_killed: number;
	power_seeds_deposited: number;
	power_seeds_stolen: number;
	time_as_power_seed_carrier: DurationSchema;
	time_as_power_seed_driver: DurationSchema;
};