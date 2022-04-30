export type AutocodeMultiplayerServiceRecord = {
	data: {
		records: {
			[key: string]: AutocodeMultiplayerKey;
		};
		privacy: {
			public: boolean;
		};
	};
	additional: {
		polling: {
			synced_at: string;
		};
		parameters: {
			gamertag: string;
			filter: 'matchmade' | 'custom';
		};
	};
};

export type AutocodeMultiplayerKey = {
	core: {
		summary: {
			kills: number;
			deaths: number;
			assists: number;
			betrayals: number;
			suicides: number;
			vehicles: {
				destroys: number;
				hijacks: number;
			};
			medals: number;
		};
		damage: {
			taken: number;
			dealt: number;
			average: number;
		};
		shots: {
			fired: number;
			landed: number;
			missed: number;
			accuracy: number;
		};
		rounds: {
			won: number;
			lost: number;
			tied: number;
		};
		breakdowns: {
			kills: {
				melee: number;
				grenades: number;
				headshots: number;
				power_weapons: number;
				assassinations: number;
				vehicles: {
					splatters: number;
				};
				miscellaneous: {
					repulsor: number;
					fusion_coils: number;
				};
			};
			assists: {
				emp: number;
				driver: number;
				callouts: number;
			};
			vehicles: {
				destroys: Array<{
					value: string;
					count: number;
				}>;
				hijacks: Array<{
					value: string;
					count: number;
				}>;
			};
			medals: Array<{
				id: number;
				count: number;
			}>;
		};
		kda: number;
		kdr: number;
		scores: {
			personal: number;
			points: number;
		};
	};
	matches: {
		outcomes: {
			wins: number;
			draws: number;
			losses: number;
			left: number;
		};
		total: number;
		win_rate: number;
	};
	time_played: {
		seconds: number;
		human: string;
	};
};