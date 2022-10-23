export type AutocodeCSRS = {
	data: Array<AutocodeCSRSData>;
	additional: {
		parameters: {
			gamertag: string;
			season: number;
			version: number;
		};
	};
};

export type AutocodeCSRSData = {
	id: string;
	name: string;
	queue: "open" | "solo-duo" | null;
	input: "controller" | "mnk" | "crossplay" | null;
	response: {
		current: Partial<AutocodeRank>;
		season: Partial<AutocodeRank>;
		all_time: Partial<AutocodeRank>;
	};
};

export type AutocodeRank = {
	value: number;
	measurement_matches_remaining: number;
	tier: string;
	tier_start: number;
	sub_tier: number;
	next_tier: string;
	next_tier_start: number;
	next_sub_tier: number;
	initial_measurement_matches: number;
	tier_image_url: string;
};