export type FirebaseSeasonServiceRecord = {
	core: {
		summary: {
			kills: number;
			deaths: number;
			assists: number;
		};
		shots: {
			accuracy: number;
		};
		kda: number;
		kdr: number;
	};
	matches: {
		total: number;
		win_rate: number;
	};
};