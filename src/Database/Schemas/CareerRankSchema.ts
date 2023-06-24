export interface CareerRankSchema
{
	data: {
		level: {
			next_level_threshold: number;
			remaining_xp_to_next_level: number;
			total_xp: number;
		};
		current: {
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
			level: {
				next_level_threshold: 0,
				remaining_xp_to_next_level: 0,
				total_xp: 0,
			},
			current: {
				rank: 0,
				title: "",
				subtitle: "",
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