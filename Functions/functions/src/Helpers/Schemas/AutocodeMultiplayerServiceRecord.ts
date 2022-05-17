export type AutocodeMultiplayerServiceRecord = {
	data: AutocodeServiceRecordData;
	additional: {
		polling: {
			synced_at: string;
		};
		parameters: {
			gamertag: string;
			filter: 'matchmade' | 'custom';
		};
	};
};

export type AutocodeServiceRecordData = {
	core: {
		summary: {
			kills: number;
			deaths: number;
			assists: number;
			betrayals: number;
			suicides: number;
			vehicles: {
				destroys: number;
				hijacks: number;
			};
			medals: number;
		};
		damage: {
			taken: number;
			dealt: number;
			average: number;
		};
		shots: {
			fired: number;
			landed: number;
			missed: number;
			accuracy: number;
		};
		rounds: {
			won: number;
			lost: number;
			tied: number;
		};
		breakdowns: {
			kills: {
				melee: number;
				grenades: number;
				headshots: number;
				power_weapons: number;
				assassinations: number;
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
			medals: Array < {
				id: number;
				count: number;
			} > ;
		};
		kda: number;
		kdr: number;
		scores: {
			personal: number;
			points: number;
		};
	};
	modes: {
		capture_the_flag: AutocodeCTFMode;
		elimination: AutocodeEliminationMode;
		oddball: AutocodeOddballMode;
		zones: AutocodeZoneMode;
		stockpile: AutocodeStockpileMode;
	};
	matches: {
		outcomes: {
			wins: number;
			draws: number;
			losses: number;
			left: number;
		};
		total: number;
		win_rate: number;
	};
	time_played: {
		seconds: number;
		human: string;
	};
};

export type AutocodeCTFMode = {
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
	time_as_flag_carrier: {
		seconds: number;
		human: string;
	};
};

export type AutocodeEliminationMode = {
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

export type AutocodeOddballMode = {
	kills_as_skull_carrier: number;
	longest_time_as_skull_carrier: {
		seconds: number;
		human: string;
	};
	skull_carriers_killed: number;
	skull_grabs: number;
	skull_scoring_ticks: number;
	time_as_skull_carrier: {
		seconds: number;
		human: string;
	};
};

export type AutocodeZoneMode = {
	total_zone_occupation_time: {
		seconds: number;
		human: string;
	};
	zone_captures: number;
	zone_defensive_kills: number;
	zone_offensive_kills: number;
	zone_scoring_ticks: number;
	zone_secures: number;
};

export type AutocodeStockpileMode = {
	kills_as_power_seed_carrier: number;
	power_seed_carriers_killed: number;
	power_seeds_deposited: number;
	power_seeds_stolen: number;
	time_as_power_seed_carrier: {
		seconds: number;
		human: string;
	};
	time_as_power_seed_driver: {
		seconds: number;
		human: string;
	};
};