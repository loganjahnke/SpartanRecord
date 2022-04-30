export type FirebaseMatchesBest = {
	[map: string]: FirebaseBest;
};

export type FirebaseBest = {
	match_ids: FirebaseBestMatchIDCategories;
	values: FirebaseBestValuesCategories;
};

export type FirebaseBestValuesCategories = {
	most_kills: number;
	most_deaths: number;
	most_assists: number;
	best_kda: number;
	worst_kda: number;
	highest_kd_spread: number;
	worst_kd_spread: number;
}

export type FirebaseBestMatchIDCategories = {
	most_kills: string;
	most_deaths: string;
	most_assists: string;
	best_kda: string;
	worst_kda: string;
	highest_kd_spread: string;
	worst_kd_spread: string;
}