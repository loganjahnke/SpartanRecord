import { AppearanceSchema } from "../../../Database/Schemas/AppearanceSchema";
import { ServiceRecordSchema } from "../../../Database/Schemas/ServiceRecordSchema";
import { FirebaseSeasonServiceRecord } from "../../../Database/Schemas/FirebaseSeasonServiceRecord";
import { Debugger } from "../Debugger";
import { URLReducer } from "./URLReducer";

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
	public static AutocodeToSeasons(sr: ServiceRecordSchema): FirebaseSeasonServiceRecord
	{
		return {
			stats: {
				core: {
					summary: {
						kills: sr.data.stats.core.summary.kills,
						deaths: sr.data.stats.core.summary.deaths,
						assists: sr.data.stats.core.summary.assists,
					},
					shots: {
						accuracy: sr.data.stats.core.shots.accuracy,
					},
					kda: sr.data.stats.core.kda,
					kdr: sr.data.stats.core.kdr,
				},
			},
			matches: {
				completed: sr.data.matches.completed,
				wins: sr.data.matches.wins,
			},
		}
	}

	/**
	 * Reduces the appearance object to store into Firebase
	 * @param appearance the full appearance object
	 * @returns the reduced appearance object
	 */
	public static ReducedAutocodeAppearance(appearance: AppearanceSchema): AppearanceSchema
	{
		if ((appearance as any).additional) { delete (appearance as any).additional; }

		appearance.data.image_urls.nameplate = URLReducer.ReduceURLFromGruntAPI(appearance.data.image_urls.nameplate);
		appearance.data.image_urls.emblem = URLReducer.ReduceURLFromGruntAPI(appearance.data.image_urls.emblem);
		appearance.data.image_urls.backdrop = URLReducer.ReduceURLFromGruntAPI(appearance.data.image_urls.backdrop);
		appearance.data.image_urls.action_pose = URLReducer.ReduceURLFromGruntAPI(appearance.data.image_urls.action_pose);

		return appearance;
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