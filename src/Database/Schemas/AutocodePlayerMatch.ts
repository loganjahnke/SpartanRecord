import { AutocodeOutcome } from "./AutocodeMatch";

export type AutocodePlayerMatchResults = {
	data: {
		matches: Array<AutocodePlayerMatch>;
		privacy: {
			public: boolean;
		};
	};
	additional: {
		count: number;
		paging: {
			count: number;
			offset: number;
		};
		parameters: {
			gamertag: string;
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
			type: 'all' | 'matchmaking' | 'custom' | 'local';
		};
	};
};

export type AutocodePlayerMatch = {
	id: string;
	details: {
		gamevariant: AutocodeGameVariant;
		map: AutocodeGameMap;
		playlist: AutocodePlaylist;
	};
	teams: {
		enabled: boolean;
		scoring: boolean;
	};
	player: AutocodePlayerMatchPlayer;
	experience: 'arena' | 'btb' | 'pve-bots' | 'featured' | 'custom';
	type: 'matchmaking' | 'custom' | 'local';
	played_at: string;
	duration: {
		seconds: number;
		human: string;
	};
}

export type AutocodeGameVariant = {
	name: string;
	asset: {
		id: string;
		version: string;
		thumbnail_url: string;
	};
	properties: {
		category_id: number;
	};
}

export type AutocodeGameMap = {
	name: string;
	asset: {
		id: string;
		version: string;
		thumbnail_url: string;
	};
	properties: {
		level_id: string;
	};
}

export type AutocodePlaylist = {
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
}

export type AutocodePlayerMatchPlayer = {
	team: {
		id: number;
		name: string;
	};
	stats: {
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
			};
			shots: {
				fired: number;
				landed: number;
				missed: number;
				accuracy: number;
			};
			kda: number;
			kdr: number;
		};
	};
	rank: number;
	outcome: AutocodeOutcome;
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
};