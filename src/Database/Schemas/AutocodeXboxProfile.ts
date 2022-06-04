export type AutocodeXboxProfile = {
	data: {
		player: null | {
			gamertag: string;
			gamerpic_url: string;
		};
		status: {
			success: boolean;
			reason:
				| 'found'
				| 'not_found'
				| 'bad_request'
				| 'too_many_requests'
				| 'error';
		};
	};
	additional: {
		parameters: {
			gamertag: string;
		};
	};
};