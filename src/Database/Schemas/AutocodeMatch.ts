export type AutocodeMatchResults = {
	data: Array<AutocodeMatch>;
	additional: {
		count: number;
		parameters: {
			language:
				| 'pt-br'
				| 'fr-fr'
				| 'de-de'
				| 'es-es'
				| 'en-us'
				| 'it-it'
				| 'ja-jp'
				| 'ko-kr'
				| 'pl-pl'
				| 'ru-ru'
				| 'zh-cn'
				| 'es-mx'
				| 'zh-hk';
			ids: string[];
		};
	};
};

export type AutocodeMatch = {
	id: string;
	match: null | {
		id: string;
		details: {
			gamevariant: {
				name: string;
				asset: {
					id: string;
					version: string;
					thumbnail_url: string;
				};
				properties: {
					category_id: number;
				};
			};
			map: {
				name: string;
				asset: {
					id: string;
					version: string;
					thumbnail_url: string;
				};
				properties: {
					level_id: string;
				};
			};
			playlist: {
				name: string;
				asset: {
					id: string;
					version: string;
					thumbnail_url: string;
				};
				properties: {
					queue: 'open' | 'solo-duo' | null;
					input: 'controller' | 'mnk' | 'crossplay' | null;
					ranked: boolean;
				};
			};
		};
		teams: {
			enabled: boolean;
			scoring: boolean;
			details: Array<AutocodeMatchTeamDetails>;
		};
		players: Array<AutocodeMatchPlayer>;
		experience: 'arena' | 'btb' | 'pve-bots' | 'featured' | 'custom';
		type: 'matchmaking' | 'custom' | 'local';
		played_at: string;
		duration: {
			seconds: number;
			human: string;
		};
	};
	success: boolean;
};

export type AutocodeMatchTeamDetails = {
	team: {
		id: number;
		name: string;
	};
	stats: {
		core: {
			summary: AutocodeSRSummary;
			damage: AutocodeSRDamage;
			shots: AutocodeSRAccuracy;
			rounds: AutocodeSRRounds;
			breakdowns: AutocodeSRBreakdowns;
			kda: number;
			kdr: number;
			scores: AutocodeSRScore;
		};
		mode: null | Record<string, any>;
		mmr: number | null;
	};
	rank: number;
	outcome: AutocodeOutcome;
	odds: null | {
		winning: number;
		losing: number;
	};
};

export type AutocodeMatchPlayer = {
	details: {
		name: string;
		type: 'player' | 'bot';
		resolved: boolean;
	};
	team: {
		id: number;
		name: string;
	};
	stats: {
		core: {
			summary: AutocodeSRSummary;
			damage: AutocodeSRDamage;
			shots: AutocodeSRAccuracy;
			rounds: AutocodeSRRounds;
			breakdowns: AutocodeSRBreakdowns;
			kda: number;
			kdr: number;
			scores: AutocodeSRScore;
		};
		mode: null | Record<string, any>;
		mmr: number | null;
	};
	rank: number;
	outcome: AutocodeOutcome;
	participation: {
		confirmed: boolean | null;
		joined_in_progress: boolean;
		joined_at: string;
		left_at: string | null;
		presence: {
			beginning: boolean;
			completion: boolean;
		};
	};
	progression: null | {
		csr: {
			pre_match: {
				value: number;
				tier: string;
				sub_tier: number;
				initial_measurement_matches: number;
				measurement_matches_remaining: number;
			};
			post_match: {
				value: number;
				tier: string;
				sub_tier: number;
				initial_measurement_matches: number;
				measurement_matches_remaining: number;
			};
		};
	};
	performances: null | {
		kills: {
			count: number;
			expected: number;
			standard_deviation: number;
		};
		deaths: {
			count: number;
			expected: number;
			standard_deviation: number;
		};
	};
};

export type AutocodeOutcome = 'win' | 'won' | 'left' | 'loss' | 'unknown';
export type AutocodeSRSummary = {
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

export type AutocodeSRDamage = {
	taken: number;
	dealt: number;
};

export type AutocodeSRAccuracy = {
	fired: number;
	landed: number;
	missed: number;
	accuracy: number;
};

export type AutocodeSRRounds = {
	won: number;
	lost: number;
	tied: number;
};

export type AutocodeSRBreakdowns = {
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
		destroys: Array<{
			value: string;
			count: number;
		}>;
		hijacks: Array<{
			value: string;
			count: number;
		}>;
	};
	medals: Array<{
		id: number;
		count: number;
	}>;
};

export type AutocodeSRScore = {
	personal: number;
	points: number;
};