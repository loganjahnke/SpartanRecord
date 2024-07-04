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

	/**
	 * Converts a nameplate URL to the proper nameplate URL
	 * @param url the URL to check
	 */
	public static GetNameplateForEmblem(emblem?: string): string
	{
		if (!emblem) { return ""; }

		const yellowNameplate = "https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoiaW1hZ2VzL25hbWVwbGF0ZXMvMTA0LTAwMS1yZWFjaC1ncmVlbi1lLWE4YTBhNDcyXzg0NDgxNjcxNi5wbmciLCJvcHRpb25zIjp7ImJyYW5jaCI6IldheXBvaW50In19";
		
		if (emblem.includes("eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoicHJvZ3Jlc3Npb24vSW52ZW50b3J5L0VtYmxlbXMvMzg3MjgxMi1TcGFydGFuRW1ibGVtLVNNLnBuZyIsIm9wdGlvbnMiOnsiYnJhbmNoIjoiSW1hZ2VzIn19")) { return yellowNameplate; }
		if (emblem.includes("eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoicHJvZ3Jlc3Npb24vSW52ZW50b3J5L0VtYmxlbXMvZGFuZGlfZmluZ2VyaGVhcnRzX3VuaXR5X2VtYmxlbS5wbmciLCJvcHRpb25zIjp7ImJyYW5jaCI6IkltYWdlcyJ9fQ%3D%3D")) { return yellowNameplate; }

		return "";
	}

	/**
	 * Determines if the URL is a broken emblem URL
	 * @param url the URL to check
	 */
	public static IsBrokenEmblem(url?: string): boolean
	{
		if (!url) { return false; }
		if (url.includes("eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoicHJvZ3Jlc3Npb24vSW52ZW50b3J5L0VtYmxlbXMvMzg3MjgxMi1TcGFydGFuRW1ibGVtLVNNLnBuZyIsIm9wdGlvbnMiOnsiYnJhbmNoIjoiSW1hZ2VzIn19")) { return true; }

		return false;
	}
}