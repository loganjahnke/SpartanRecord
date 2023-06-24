export interface CareerRankSchema
{
	data: {
		current: {
			rank: number;
			title: string;
			subtitle: string;
			progression: number;
			image_urls: {
				icon: string;
				large_icon: string;
				adornment_icon: string;
			};
			attributes: {
				tier: number;
				grade: number;
			};
			properties: {
				type: string;
				threshold: number;
			}
		};
		next: {
			rank: number;
			title: string;
			subtitle: string;
			progression: number;
			image_urls: {
				icon: string;
				large_icon: string;
				adornment_icon: string;
			};
			attributes: {
				tier: number;
				grade: number;
			};
			properties: {
				type: string;
				threshold: number;
			}
		}
	}
}

export function EmptyCareerRank(): CareerRankSchema
{
	return {
		data: {
			current: {
				rank: 0,
				title: "",
				subtitle: "",
				progression: 0,
				image_urls: {
					icon: "",
					large_icon: "",
					adornment_icon: "",
				},
				attributes: {
					tier: 0,
					grade: 0,
				},
				properties: {
					type: "",
					threshold: 0,
				}
			},
			next: {
				rank: 0,
				title: "",
				subtitle: "",
				progression: 0,
				image_urls: {
					icon: "",
					large_icon: "",
					adornment_icon: "",
				},
				attributes: {
					tier: 0,
					grade: 0,
				},
				properties: {
					type: "",
					threshold: 0,
				}
			}
		}
	}
}