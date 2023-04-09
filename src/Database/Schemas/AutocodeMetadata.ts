import { ImagesSchema } from "./PlayerMatchSchema";

export type AutocodeMap = {
	name: string,
	level_id: string,
	thumbnail_url: string
};

export type HaloDotAPICategory = {
	name: string;
	id: number;
	image_urls: ImagesSchema;
};

export type AutocodeTeam = {
	id: number,
	name: string,
	emblem_url: string
};

export type HaloDotAPISeason = {
	id: number,
	version: number,
	name: string,
	description: string,
	narrative_blurb: string,
	image_urls: {
		season_logo: string,
		card_background: string,
		battlepass_background: string
	},
	properties: {
		identifier: string,
		csr: string
	},
	availability: [
		{
			start_date: Date,
			end_date: Date
		}
	]
}

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

export type HaloDotAPIPlaylist = {
	id: string;
	version: string;
	name: string;
	description: string;
	image_urls: ImagesSchema;
	attributes: {
		active: boolean;
		featured: boolean;
		ranked: boolean;
	};
	properties: {
		queue: "open-queue" | "solo-duo" | null;
		input: "controller" | "mnk" | "crossplay" | null;
		experience: string;
	};
	rotation: Array<{ name: string, weight: number; }>;
	availability: Array<{ start_date: Date; end_date: Date; }>;
}