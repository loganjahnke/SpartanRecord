import { AutocodeMultiplayerServiceRecord } from "../../../Database/Schemas/AutocodeMultiplayerServiceRecord";
import { AutocodePlayerMatch } from "../../../Database/Schemas/AutocodePlayerMatch";
import { FirebaseRecentMatch } from "../../../Database/Schemas/FirebaseRecentMatch";
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
}