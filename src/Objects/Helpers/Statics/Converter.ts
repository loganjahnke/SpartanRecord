import { AutocodeMultiplayerServiceRecord } from "../../../Database/Schemas/AutocodeMultiplayerServiceRecord";
import { FirebaseSeasonServiceRecord } from "../../../Database/Schemas/FirebaseSeasonServiceRecord";

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
}