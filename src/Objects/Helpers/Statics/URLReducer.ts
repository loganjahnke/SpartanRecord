export class URLReducer
{
	private static readonly __appearancePrefix = "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=";

	/**
	 * Constructs the appearance URL
	 * @param data the full or partial URL
	 * @returns the full URL
	 */
	public static ConstructAppearanceURL(data?: string): string
	{
		if (!data) { return ""; }
		if (data.includes(this.__appearancePrefix)) { return data; }
		return this.__appearancePrefix + data;
	}

	/**
	 * Constructs the reduced appearance URL
	 * @param url the full URL
	 * @returns the reduced URL
	 */
	public static ReduceAppearanceURL(url?: string): string
	{
		if (!url) { return ""; }
		if (url.includes(this.__appearancePrefix)) { return url.substring(this.__appearancePrefix.length); }
		return url;
	}
}