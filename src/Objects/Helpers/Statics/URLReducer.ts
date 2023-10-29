export class URLReducer
{
	private static readonly __urlPrefix = "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=";

	/**
	 * Constructs the URL
	 * @param data the full or partial URL
	 * @returns the full URL
	 */
	public static ConstructURLForGruntAPI(data?: string): string
	{
		if (!data) { return ""; }
		if (data.includes(this.__urlPrefix)) { return data; }
		return this.__urlPrefix + data;
	}

	/**
	 * Constructs the reduced URL
	 * @param url the full URL
	 * @returns the reduced URL
	 */
	public static ReduceURLFromGruntAPI(url?: string): string
	{
		if (!url) { return ""; }
		if (url.includes(this.__urlPrefix)) { return url.substring(this.__urlPrefix.length); }
		return url;
	}
}