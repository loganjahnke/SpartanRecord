export type FirebaseSeasonServiceRecord = {
	stats: {
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
	};
	matches: {
		completed: number;
		wins: number;
	};
};