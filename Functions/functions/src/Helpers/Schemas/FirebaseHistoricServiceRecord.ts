export type FirebaseHistoricServiceRecord = {
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
		scores: {
			personal: number;
		};
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
};