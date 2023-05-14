export interface HaloDotAPIClips {
	data: HaloDotAPIClip[];
}

export interface HaloDotAPIClip {
	local_id: string;
	content_id: string;
	media_urls: MediaUrls;
	properties: Properties;
	recorded_at: Date;
	uploaded_at: Date;
}

interface MediaUrls {
	download: string;
	thumbnail: string;
}

interface Properties {
	framerate: number;
	resolution: Resolution;
	duration: Duration;
}

interface Resolution {
	width: number;
	height: number;
}

interface Duration {
	seconds: number;
	human: string;
}
