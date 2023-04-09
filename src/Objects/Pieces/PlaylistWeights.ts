import { HaloDotAPIPlaylist } from "../../Database/Schemas/AutocodeMetadata";

export class PlaylistWeights
{
	/** The raw data, just in case */
	public data: HaloDotAPIPlaylist;
	/** 
	 * The odds of getting an experience 
	 * Key: UGC Game Variant + "on" + Map
	 * Value: Odds as an unformatted whole number percentage
	 */
	public odds: Map<string, number>;

	/**
	 * Creates a playlist weight
	 * @param data the playlist data
	 */
	constructor(data: HaloDotAPIPlaylist) 
	{
		this.data = data;
		this.odds = new Map<string, number>();
		
		// Get the sum first
		let sum = 0;
		for (const experience of data.rotation) { sum += experience.weight; }

		// Get the odds next
		for (const experience of data.rotation)
		{
			this.odds.set(experience.name, Math.round(experience.weight / sum * 1000) / 10);
		}
	}
}