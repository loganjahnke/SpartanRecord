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

export type HaloDotAPIStore = {
	data: HaloDotAPIStoreData;
}

export type HaloDotAPIStoreData = {
	id: string;
	offerings: HaloDotAPIStoreOffering[];
	expires_at: Date;
}

export type HaloDotAPIStoreOffering = {
	id: string;
	name: string;
	description: string;
	image_urls: {
		offering: string;
	};
	attributes: HaloDotAPIStoreAttributes;
	properties: HaloDotAPIStoreProperties;
	items: HaloDotAPIStoreItem[];
	currencies: Currency[];
	prices: Price[];
	expires_at: any;
}

export type HaloDotAPIStoreAttributes = {
	quality: string
	returning: boolean
	new: boolean
}

export type HaloDotAPIStoreProperties = {
	flair: {
		text: string;
		image_urls: {
			icon?: string;
			background?: string;
		};
	};
	offering_image_hint: {
		width: number;
		height: number;
	}
}

export type HaloDotAPIStoreItem = {
	id: string;
	name: string;
	description: string;
	image_urls: {
		item: string;
	};
	attributes: {
		quality: string;
	};
	properties: HaloDotAPIStoreItemProperties;
};

export type HaloDotAPIStoreItemProperties = {
	type: string
	amount: number
	item_image_size: {
		width: number;
		height: number;
	}
	manufacturer: {
		id: number;
	}
	season: {
		id: number;
	}
};

export interface Currency {
	id: string
	properties: {
		amount: number;
	}
}

export interface Price {
	id: string
	properties: {
		cost: number;
	}
}

export interface CareerRankMetadataArray
{
	data: CareerRankMetadata[];
}

export interface CareerRankMetadata 
{
	rank: number;
	title: string;
	subtitle: string;
	image_urls: {
		icon: string;
		large_icon: string;
		adornment_icon: string;
	};
	attributes: {
		tier: number;
		grade: number;
		colors: string[];
	};
	properties: {
		type: string;
		threshold: number;
	}
}