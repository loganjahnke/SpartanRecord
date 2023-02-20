import { AutocodeOutcome } from "./AutocodeMatch";
import { AutocodeGameVariant, AutocodeGameMap, AutocodePlaylist } from "./AutocodePlayerMatch";

export type FirebaseRecentMatch = {
	id: string;
	details: {
		gamevariant: AutocodeGameVariant;
		map: AutocodeGameMap;
		playlist: AutocodePlaylist;
	};
	player: FirebaseRecentMatchPlayer;
	experience: 'arena' | 'btb' | 'pve-bots' | 'featured' | 'custom';
	type: 'matchmaking' | 'custom' | 'local';
	played_at: string;
}

type FirebaseRecentMatchPlayer = {
	stats: {
		core: {
			summary: {
				kills: number;
				deaths: number;
				assists: number;
			};
			damage: {
				taken: number;
				dealt: number;
			};
			shots: {
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