import { ServiceRecordDataSchema, ServiceRecordSchema } from "./ServiceRecordSchema";

export class AutocodeHelpers
{
	/**
	 * Creates an empty service record from the autocode type
	 * @returns an empty autocode service record
	 */
	public static CreateEmptyServiceRecord(gamertag: string): ServiceRecordSchema
	{
		return {
			data: {
				stats: {
					core: {
						summary: {
							kills: 0,
							deaths: 0,
							assists: 0,
							betrayals: 0,
							suicides: 0,
							spawns: 0,
							max_killing_spree: 0,
							vehicles: {
								destroys: 0,
								hijacks: 0,
							},
							medals: {
								total: 0,
								unique: 0
							},
						},
						damage: {
							taken: 0,
							dealt: 0,
						},
						shots: {
							fired: 0,
							hit: 0,
							missed: 0,
							accuracy: 0,
						},
						rounds: {
							won: 0,
							lost: 0,
							tied: 0,
						},
						breakdown: {
							kills: {
								melee: 0,
								grenades: 0,
								headshots: 0,
								power_weapons: 0,
								assassinations: 0,
								sticks: 0,
								vehicles: {
									splatters: 0,
								},
								miscellaneous: {
									repulsor: 0,
									fusion_coils: 0,
								},
							},
							assists: {
								emp: 0,
								driver: 0,
								callouts: 0,
							},
							vehicles: {
								destroys: [],
								hijacks: [],
							},
							medals: [],
						},
						kda: 0,
						kdr: 0,
						scores: {
							personal: 0,
							points: 0,
						},
					},
					modes: {
						capture_the_flag: {
							flag_capture_assists: 0,
							flag_captures: 0,
							flag_carriers_killed: 0,
							flag_grabs: 0,
							flag_returners_killed: 0,
							flag_returns: 0,
							flag_secures: 0,
							flag_steals: 0,
							kills_as_flag_carrier: 0,
							kills_as_flag_returner: 0,
							time_as_flag_carrier: {
								seconds: 0,
								human: ""
							}
						},
						elimination: {
							allies_revived: 0,
							elimination_assists: 0,
							eliminations: 0,
							enemy_revives_denied: 0,
							executions: 0,
							kills_as_last_player_standing: 0,
							last_players_standing_killed: 0,
							rounds_survived: 0,
							times_revived_by_ally: 0,
						},
						oddball: {
							kills_as_skull_carrier: 0,
							longest_time_as_skull_carrier: {
								seconds: 0,
								human: "",
							},
							skull_carriers_killed: 0,
							skull_grabs: 0,
							skull_scoring_ticks: 0,
							time_as_skull_carrier: {
								seconds: 0,
								human: "",
							}
						},
						zones: {
							stronghold_occupation_time: {
								seconds: 0,
								human: "",
							},
							stronghold_captures: 0,
							stronghold_defensive_kills: 0,
							stronghold_offensive_kills: 0,
							stronghold_scoring_ticks: 0,
							stronghold_secures: 0,
						},
						stockpile: {
							kills_as_power_seed_carrier: 0,
							power_seed_carriers_killed: 0,
							power_seeds_deposited: 0,
							power_seeds_stolen: 0,
							time_as_power_seed_carrier: {
								seconds: 0,
								human: "",
							},
							time_as_power_seed_driver: {
								seconds: 0,
								human: "",
							},
						},
						extraction: {
							extraction_conversions_completed: 0,
							extraction_conversions_denied: 0,
							extraction_initiations_completed: 0,
							extraction_initiations_denied: 0,
							successful_extractions: 0
						},
						infection: {
							alphas_killed: 0,
							infected_killed: 0,
							kills_as_last_spartan_standing: 0,
							last_spartans_standing_infected: 0,
							rounds_as_alpha: 0,
							rounds_as_last_spartan_standing: 0,
							rounds_finished_as_infected: 0,
							rounds_survived_as_last_spartan_standing: 0,
							rounds_survived_as_spartan: 0,
							spartans_infected: 0,
							spartans_infected_as_alpha: 0,
							time_as_last_spartan_standing: {
								seconds: 0,
								human: "",
							},
						},
						pve: {
							boss_kills: 0,
							brute_kills: 0,
							elite_kills: 0,
							grunt_kills: 0,
							hunter_kills: 0,
							jackal_kills: 0,
							marine_kills: 0,
							sentinel_kills: 0,
							skimmer_kills: 0,
						}
					},
				},
				time_played: {
					seconds: 0,
					human: "",
				},
				matches: {
					wins: 0,
					completed: 0,
					losses: 0,
					ties: 0,
				},
			},
			additional: {
				query: {}
			}
		}
	}

	//#region Adders
	/**
	 * Calculates KDA, KDR, accuracy, and win rate
	 * @param key the service record to update
	 */
	private static UpdateCalculatedProperties(key: ServiceRecordDataSchema): void
	{
		const kills = key.stats.core?.summary?.kills ?? 0;
		const assists = key.stats.core?.summary?.assists ?? 0;
		const deaths = key.stats.core?.summary?.deaths ?? 0;
		const wins = key.matches?.wins ?? 0;
		const matches = key.matches?.completed ?? 0;
		const shotsLanded = key.stats.core?.shots?.hit ?? 0;
		const shotsFired = key.stats.core?.shots?.fired ?? 0;
		const damageDealt = key.stats.core?.damage?.dealt ?? 0;

		// Calculate win rate and KDA
		if (matches > 0)
		{
			key.stats.core.kda = (kills + (assists / 3) - deaths) / matches;
		}

		// Calculate KDR
		if (deaths > 0)
		{
			key.stats.core.kdr = kills / deaths;
		}

		// Calculate accuracy
		if (shotsFired > 0)
		{
			key.stats.core.shots.accuracy = (shotsLanded / shotsFired) * 100;
		}
	}
	//#endregion
}