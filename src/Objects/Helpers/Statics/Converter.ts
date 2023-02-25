import { AutocodeMultiplayerServiceRecord } from "../../../Database/Schemas/AutocodeMultiplayerServiceRecord";
import { AutocodePlayerMatch } from "../../../Database/Schemas/AutocodePlayerMatch";
import { FirebaseRecentMatch } from "../../../Database/Schemas/FirebaseRecentMatch";
import { FirebaseSeasonServiceRecord } from "../../../Database/Schemas/FirebaseSeasonServiceRecord";
import { Debugger } from "../Debugger";

interface RGB
{
	r: number;
	g: number;
	b: number;
}

/**
 * Contains static converter methods
 */
export class Converter
{
	/**
	 * Converts a Autocode SR into a Seasons SR
	 * @param sr the autocode multiplayer service record
	 * @returns the firebase seasons service record
	 */
	public static AutocodeToSeasons(sr: AutocodeMultiplayerServiceRecord): FirebaseSeasonServiceRecord
	{
		return {
			core: {
				summary: {
					kills: sr.data.core.summary.kills,
					deaths: sr.data.core.summary.deaths,
					assists: sr.data.core.summary.assists,
				},
				damage: {
					taken: sr.data.core.damage.taken,
					dealt: sr.data.core.damage.dealt,
				},
				shots: {
					accuracy: sr.data.core.shots.accuracy,
				},
				kda: sr.data.core.kda,
				kdr: sr.data.core.kdr,
			},
			matches: {
				outcomes: {
					wins: sr.data.matches.outcomes.wins,
					losses: sr.data.matches.outcomes.losses,
				},
				total: sr.data.matches.total,
				win_rate: sr.data.matches.win_rate,
			},
		}
	}

	/**
	 * Converts an Autocode player match to a Firebase recent match
	 * @param match the Autocode player match
	 * @returns a Firebase recent match
	 */
	public static PlayerMatchToRecentMatch(match: AutocodePlayerMatch): FirebaseRecentMatch
	{
		return {
			id: match.id,
			details: match.details,
			experience: match.experience,
			type: match.type,
			played_at: match.played_at,
			player: {
				stats: {
					core: {
						summary: {
							kills: match.player.stats.core.summary.kills,
							deaths: match.player.stats.core.summary.deaths,
							assists: match.player.stats.core.summary.assists,
						},
						damage: {
							taken: match.player.stats.core.damage.taken,
							dealt: match.player.stats.core.damage.dealt,
						},
						shots: {
							accuracy: match.player.stats.core.shots.accuracy,
						},
						kda: match.player.stats.core.kda,
						kdr: match.player.stats.core.kdr,
					},
				},
				rank: match.player.rank,
				outcome: match.player.outcome,
				progression: match.player.progression,
			}
		}
	}

	/**
	 * Gets the best text color to show against a background
	 * @param background the background hex color
	 * @returns the text color in hexidecimal
	 */
	public static GetBestTextColor(background: string): string
	{
		const getRgb = (c: string) => parseInt(c, 16);
		const getsRgb = (c: string) =>
		{
			return getRgb(c) / 255 <= 0.03928
				? getRgb(c) / 255 / 12.92
				: Math.pow((getRgb(c) / 255 + 0.055) / 1.055, 2.4);
		}
		const getLum = (hex: string) =>
		{
			return (
				0.2126 * getsRgb(hex.substring(1, 3)) +
				0.7152 * getsRgb(hex.substring(3, 5)) +
				0.0722 * getsRgb(hex.substring(5, 7))
			);
		}
		const getContrast = (foreground: string, background: string): number =>
		{
			const l1 = getLum(foreground);
			const l2 = getLum(background);
			return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
		}

		const whiteContrast = getContrast("#FFFFFF", background);
		const blackContrast = getContrast("#000000", background);

		return whiteContrast > blackContrast ? "#FFFFFF" : "#000000";
	}

	/**
	 * Converts an image to an average RGB
	 * @param img the image element
	 * @returns the average color in hexidecimal
	 */
	public static ImageToAverageColor(img?: HTMLImageElement | null) : string
	{
		const comToHex = (c: number) =>
		{
			const hex = c.toString(16);
			return hex.length === 1 ? "0" + hex : hex;
		}

		const rgbStr = (rgb: RGB) => "#" + comToHex(rgb.r) + comToHex(rgb.g) + comToHex(rgb.b);

		const defaultRGB: RGB = { r: 0, g: 0, b: 0 };
		if (!img) 
		{ 
			Debugger.Simple("Converter", "ImageToAverageColor()", "img is null");
			return rgbStr(defaultRGB); 
		}

		const blockSize = 5, // only visit every 5 pixels
			  canvas = document.createElement('canvas'),
			  context = canvas.getContext && canvas.getContext('2d');
			  
		let data, width, height,
			  length,
			  rgb: RGB = { r: 0, g: 0, b: 0 },
			  i = -4,
			  count = 0;
	
		if (!context) 
		{ 
			Debugger.Simple("Converter", "ImageToAverageColor()", "context is null");
			return rgbStr(defaultRGB); 
		}
	
		height = canvas.height = img.naturalHeight || img.offsetHeight || img.height;
		width = canvas.width = img.naturalWidth || img.offsetWidth || img.width;
	
		context.drawImage(img, 0, 0);
	
		try 
		{
			data = context.getImageData(0, 0, width, height);
		} catch(e: any) 
		{
			/* security error, img on diff domain */
			Debugger.Simple("Converter", "ImageToAverageColor()", e);
			return rgbStr(defaultRGB);
		}
	
		length = data.data.length;
	
		while ( (i += blockSize * 4) < length ) 
		{
			++count;
			rgb.r += data.data[i];
			rgb.g += data.data[i+1];
			rgb.b += data.data[i+2];
		}
	
		// ~~ used to floor values
		rgb.r = ~~(rgb.r/count);
		rgb.g = ~~(rgb.g/count);
		rgb.b = ~~(rgb.b/count);
	
		return rgbStr(rgb);	
	}
}