export type AutocodeMap = {
	name: string,
	level_id: string,
	thumbnail_url: string
};

export type AutocodeVariant = {
	name: string,
	category_id: number,
	thumbnail_url: string
};

export type AutocodeTeam = {
	id: number,
	name: string,
	emblem_url: string
};

export type AutocodeMedal = {
	id: number;
	name: string;
	description: string;
	difficulty: string;
	type: string;
	image_urls: {
		small: string;
		medium: string;
		large: string;
	};
};

export type AutocodePlaylist = {
	name: string;
	asset: {
		id: string;
		version: string;
		thumbnail_url: string;
	};
	availability: {
		start_date: Date;
		end_date: Date;
	};
	properties: {
		queue: "open" | "solo-duo" | null;
		input: "controller" | "mnk" | "crossplay" | null;
		ranked: boolean;
	};
}