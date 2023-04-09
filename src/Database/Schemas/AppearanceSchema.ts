export type AppearanceSchema = {
	data: {
		service_tag: string;
		image_urls: {
            emblem: string;
            nameplate: string;
            backdrop: string;
            action_pose: string;
        }
	};
};