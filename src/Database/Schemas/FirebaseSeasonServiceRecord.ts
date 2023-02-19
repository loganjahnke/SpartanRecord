import { AutocodeMultiplayerServiceRecord } from "./AutocodeMultiplayerServiceRecord";

export type FirebaseSeasonServiceRecord = {
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
	matches: {
		outcomes: {
			wins: number;
			losses: number;
		};
		total: number;
		win_rate: number;
	};
};