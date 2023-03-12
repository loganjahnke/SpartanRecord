export type AutocodeAppearance = {
	data: {
		emblem_url: string;
		backdrop_image_url: string;
		nameplate_url: string;
		service_tag: string;
	};
	additional?: {
		parameters: {
			gamertag: string;
		};
	};
};