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
	 * The odds of getting an experience 
	 * Key: UGC Game Variant + "on" + Map
	 * Value: Odds as an unformatted whole number percentage
	 */
	public maps: Map<string, number>;	
	/** 
	 * The odds of getting an experience 
	 * Key: UGC Game Variant + "on" + Map
	 * Value: Odds as an unformatted whole number percentage
	 */
	public modes: Map<string, number>;	

	/**
	 * Creates a playlist weight
	 * @param data the playlist data
	 */
	constructor(data: HaloDotAPIPlaylist) 
	{
		this.data = data;
		this.odds = new Map<string, number>();
		this.maps = new Map<string, number>();
		this.modes = new Map<string, number>();
		
		// Get the sum first
		let sum = 0;
		for (const experience of data.rotation) { sum += experience.weight; }

		// Get the odds next
		for (const experience of data.rotation)
		{
			const isFiesta = experience.name.indexOf("Fiesta") !== -1;
			const shortName = experience.name.indexOf(":") !== -1 ? experience.name.substring(experience.name.indexOf(":") + 1) : experience.name;
			const midIndex = shortName.indexOf(" on ");
			const mode = isFiesta ? experience.name.substring(0, experience.name.indexOf(":")) : (midIndex !== -1 ? shortName.substring(0, midIndex) : shortName);
			const map = midIndex !== -1 ? shortName.substring(midIndex + 4) : shortName;

			this.odds.set(experience.name, Math.round(experience.weight / sum * 1000) / 10);
			this.maps.set(map, experience.weight + (this.maps.get(map) ?? 0));
			this.modes.set(mode, experience.weight + (this.modes.get(mode) ?? 0));
		}

		// Update the maps from weights to percents
		for (let map of this.maps.keys())
		{
			this.maps.set(map, Math.round((this.maps.get(map) ?? 0) / sum * 1000) / 10);
		}

		// Update the modes from weights to percents
		for (let mode of this.modes.keys())
		{
			this.modes.set(mode, Math.round((this.modes.get(mode) ?? 0) / sum * 1000) / 10);
		}
	}
}