import { AutocodeMatch, AutocodeOutcome, AutocodeMatchPlayer, AutocodeMatchTeamDetails, AutocodeSRSummary, AutocodeSRDamage, AutocodeSRAccuracy, AutocodeSRRounds, AutocodeSRScore, AutocodeSRBreakdowns } from "./AutocodeMatch";
import { AutocodeMultiplayerKey, AutocodeMultiplayerServiceRecord } from "./AutocodeMultiplayerServiceRecord";
import { FirebaseHistoricServiceRecord } from "./FirebaseHistoricServiceRecord";

export class AutocodeHelpers
{
	/**
	 * Gets the player details for a match
	 * @param gamertag the gamertag
	 * @param match the match to get the gamertag details for
	 * @returns player details from a match if possible
	 */
	public static GetPlayerDetailsForGamertag(gamertag: string, match: AutocodeMatch): AutocodeMatchPlayer | undefined
	{
		const playerDetails = match.match?.players.filter(player => player.details.name === gamertag);
		if (playerDetails?.length === 1) { return playerDetails[0]; }
	}

	/**
	 * Creates an empty service record from the autocode type
	 * @returns an empty autocode service record
	 */
	public static CreateEmptyServiceRecord(gamertag: string): AutocodeMultiplayerServiceRecord
	{
		return {
			data: {
				records: {
					pvp: {
						core: {
							summary: {
								kills: 0,
								deaths: 0,
								assists: 0,
								betrayals: 0,
								suicides: 0,
								vehicles: {
									destroys: 0,
									hijacks: 0,
								},
								medals: 0,
							},
							damage: {
								taken: 0,
								dealt: 0,
								average: 0,
							},
							shots: {
								fired: 0,
								landed: 0,
								missed: 0,
								accuracy: 0,
							},
							rounds: {
								won: 0,
								lost: 0,
								tied: 0,
							},
							breakdowns: {
								kills: {
									melee: 0,
									grenades: 0,
									headshots: 0,
									power_weapons: 0,
									assassinations: 0,
									vehicles: {
										splatters: 0,
									},
									miscellaneous: {
										repulsor: 0,
										fusion_coils: 0,
									},
								},
								assists: {
									emp: 0,
									driver: 0,
									callouts: 0,
								},
								vehicles: {
									destroys: [],
									hijacks: [],
								},
								medals: [],
							},
							kda: 0,
							kdr: 0,
							scores: {
								personal: 0,
								points: 0,
							},
						},
						matches: {
							outcomes: {
								wins: 0,
								draws: 0,
								losses: 0,
								left: 0,
							},
							total: 0,
							win_rate: 0,
						},
						time_played: {
							seconds: 0,
							human: "",
						},
					},
					social: {
						core: {
							summary: {
								kills: 0,
								deaths: 0,
								assists: 0,
								betrayals: 0,
								suicides: 0,
								vehicles: {
									destroys: 0,
									hijacks: 0,
								},
								medals: 0,
							},
							damage: {
								taken: 0,
								dealt: 0,
								average: 0,
							},
							shots: {
								fired: 0,
								landed: 0,
								missed: 0,
								accuracy: 0,
							},
							rounds: {
								won: 0,
								lost: 0,
								tied: 0,
							},
							breakdowns: {
								kills: {
									melee: 0,
									grenades: 0,
									headshots: 0,
									power_weapons: 0,
									assassinations: 0,
									vehicles: {
										splatters: 0,
									},
									miscellaneous: {
										repulsor: 0,
										fusion_coils: 0,
									},
								},
								assists: {
									emp: 0,
									driver: 0,
									callouts: 0,
								},
								vehicles: {
									destroys: [],
									hijacks: [],
								},
								medals: [],
							},
							kda: 0,
							kdr: 0,
							scores: {
								personal: 0,
								points: 0,
							},
						},
						matches: {
							outcomes: {
								wins: 0,
								draws: 0,
								losses: 0,
								left: 0,
							},
							total: 0,
							win_rate: 0,
						},
						time_played: {
							seconds: 0,
							human: "",
						},
					},
					ranked: {
						core: {
							summary: {
								kills: 0,
								deaths: 0,
								assists: 0,
								betrayals: 0,
								suicides: 0,
								vehicles: {
									destroys: 0,
									hijacks: 0,
								},
								medals: 0,
							},
							damage: {
								taken: 0,
								dealt: 0,
								average: 0,
							},
							shots: {
								fired: 0,
								landed: 0,
								missed: 0,
								accuracy: 0,
							},
							rounds: {
								won: 0,
								lost: 0,
								tied: 0,
							},
							breakdowns: {
								kills: {
									melee: 0,
									grenades: 0,
									headshots: 0,
									power_weapons: 0,
									assassinations: 0,
									vehicles: {
										splatters: 0,
									},
									miscellaneous: {
										repulsor: 0,
										fusion_coils: 0,
									},
								},
								assists: {
									emp: 0,
									driver: 0,
									callouts: 0,
								},
								vehicles: {
									destroys: [],
									hijacks: [],
								},
								medals: [],
							},
							kda: 0,
							kdr: 0,
							scores: {
								personal: 0,
								points: 0,
							},
						},
						matches: {
							outcomes: {
								wins: 0,
								draws: 0,
								losses: 0,
								left: 0,
							},
							total: 0,
							win_rate: 0,
						},
						time_played: {
							seconds: 0,
							human: "",
						},
					},
				},
				privacy: {
					public: true,
				},
			},
			additional: {
				polling: {
					synced_at: "",
				},
				parameters: {
					gamertag: gamertag,
					filter: "matchmade",
				}
			}
		}
	}

	/**
	 * Trims the historic service record
	 * @param historicSR the historic service record
	 * @returns the trimmed service record
	 */
	public static TrimHistoricServiceRecord(historicSR: AutocodeMultiplayerServiceRecord): FirebaseHistoricServiceRecord
	{
		return { 
			core: {
				summary: {
					kills: historicSR.data.records.pvp.core.summary.kills,
					deaths: historicSR.data.records.pvp.core.summary.deaths,
					assists: historicSR.data.records.pvp.core.summary.assists,
					betrayals: historicSR.data.records.pvp.core.summary.betrayals,
					suicides: historicSR.data.records.pvp.core.summary.suicides,
					vehicles: {
						destroys: historicSR.data.records.pvp.core.summary.vehicles.destroys,
						hijacks: historicSR.data.records.pvp.core.summary.vehicles.hijacks,
					},
					medals: historicSR.data.records.pvp.core.summary.medals,
				},
				damage: {
					taken: historicSR.data.records.pvp.core.damage.taken,
					dealt: historicSR.data.records.pvp.core.damage.dealt,
					average: historicSR.data.records.pvp.core.damage.average,
				},
				shots: {
					fired: historicSR.data.records.pvp.core.shots.fired,
					landed: historicSR.data.records.pvp.core.shots.landed,
					missed: historicSR.data.records.pvp.core.shots.missed,
					accuracy: historicSR.data.records.pvp.core.shots.accuracy,
				},
				rounds: {
					won: historicSR.data.records.pvp.core.rounds.won,
					lost: historicSR.data.records.pvp.core.rounds.lost,
					tied: historicSR.data.records.pvp.core.rounds.tied,
				},
				breakdowns: {
					kills: {
						melee: historicSR.data.records.pvp.core.breakdowns.kills.melee,
						grenades: historicSR.data.records.pvp.core.breakdowns.kills.grenades,
						headshots: historicSR.data.records.pvp.core.breakdowns.kills.headshots,
						power_weapons: historicSR.data.records.pvp.core.breakdowns.kills.power_weapons,
						assassinations: historicSR.data.records.pvp.core.breakdowns.kills.assassinations,
						vehicles: {
							splatters: historicSR.data.records.pvp.core.breakdowns.kills.vehicles.splatters,
						},
						miscellaneous: {
							repulsor: historicSR.data.records.pvp.core.breakdowns.kills.miscellaneous.repulsor,
							fusion_coils: historicSR.data.records.pvp.core.breakdowns.kills.miscellaneous.fusion_coils,
						},
					},
					assists: {
						emp: historicSR.data.records.pvp.core.breakdowns.assists.emp,
						driver: historicSR.data.records.pvp.core.breakdowns.assists.driver,
						callouts: historicSR.data.records.pvp.core.breakdowns.assists.callouts,
					}
				},
				kda: historicSR.data.records.pvp.core.kda,
				kdr: historicSR.data.records.pvp.core.kdr,
				scores: {
					personal: historicSR.data.records.pvp.core.scores.personal,
					points: historicSR.data.records.pvp.core.scores.points,
				},
			},
			matches: {
				outcomes: {
					wins: historicSR.data.records.pvp.matches.outcomes.wins,
					draws: historicSR.data.records.pvp.matches.outcomes.draws,
					losses: historicSR.data.records.pvp.matches.outcomes.losses,
					left: historicSR.data.records.pvp.matches.outcomes.left,
				},
				total: historicSR.data.records.pvp.matches.total,
				win_rate: historicSR.data.records.pvp.matches.win_rate,
			},
			time_played: {
				seconds: historicSR.data.records.pvp.time_played.seconds
			},
		};
	}

	/**
	 * Creates a new service record from a player's match details
	 * @param gamertag the gamertag
	 * @param playerDetails the player's match details
	 * @param isRanked was this a ranked match?
	 * @param secondsPlayed the number of seconds the match lasted
	 * @returns a service record for the match
	 */
	public static CreateServiceRecordFromMatch(gamertag: string, playerDetails: AutocodeMatchPlayer, isRanked: boolean, secondsPlayed: number): AutocodeMultiplayerServiceRecord
	{
		const sr = this.CreateEmptyServiceRecord(gamertag);
		this.AddMatchToServiceRecord(sr, playerDetails, isRanked, secondsPlayed);
		return sr;
	}

	/**
	 * Creates a new service record from a player's match details
	 * @param team the team
	 * @param isRanked was this a ranked match?
	 * @param secondsPlayed the number of seconds the match lasted
	 * @returns a service record for the match
	 */
	public static CreateServiceRecordFromTeam(team: AutocodeMatchTeamDetails | undefined, isRanked: boolean, secondsPlayed: number): AutocodeMultiplayerServiceRecord
	{
		const sr = this.CreateEmptyServiceRecord("");
		if (!team) { return sr; }
		this.AddTeamToServiceRecord(sr, team, isRanked, secondsPlayed);
		return sr;
	}

	//#region Adders
	/**
	 * Adds a player's details to an existing service record
	 * @param serviceRecord the service record to add to
	 * @param team the team
	 * @param isRanked was this a ranked match?
	 * @param secondsPlayed the number of seconds the match lasted
	 */
	public static AddTeamToServiceRecord(serviceRecord: AutocodeMultiplayerServiceRecord, team: AutocodeMatchTeamDetails, isRanked: boolean, secondsPlayed: number): void
	{	
		if (!serviceRecord.data) { return; }

		// Parse out
		const pvp = serviceRecord.data.records.pvp;

		// PVP
		pvp.time_played.seconds += secondsPlayed;
		this.AddOutcome(pvp, team.outcome);
		this.AddSummary(pvp, team.stats.core.summary);
		this.AddDamage(pvp, team.stats.core.damage);
		this.AddScore(pvp, team.stats.core.scores);
		this.AddShots(pvp, team.stats.core.shots);
		this.AddBreakdown(pvp, team.stats.core.breakdowns);
		this.AddRounds(pvp, team.stats.core.rounds);
		this.UpdateCalculatedProperties(pvp);
		
		// Put them back (I don't actually think I need to do this)
		serviceRecord.data.records.pvp = pvp;
	}

	/**
	 * Adds the outcome to the multiplayer service record key
	 * @param key the multiplayer service record key
	 * @param outcome the outcome
	 */
	private static AddOutcome(key: AutocodeMultiplayerKey, outcome: AutocodeOutcome): void
	{
		key.matches.outcomes.wins += outcome === "won" || outcome === "win" ? 1 : 0;
		key.matches.outcomes.losses += outcome === "loss" ? 1 : 0;
		key.matches.outcomes.left += outcome === "left" ? 1 : 0;

		key.matches.total += 1;
	}

	/**
	 * Adds the summary of the match to the service record
	 * @param key the multiplayer service record key
	 * @param summary the summary statistics
	 */
	private static AddSummary(key: AutocodeMultiplayerKey, summary: AutocodeSRSummary): void
	{
		key.core.summary.assists += summary.assists;
		key.core.summary.betrayals += summary.betrayals;
		key.core.summary.deaths += summary.deaths;
		key.core.summary.kills += summary.kills;
		key.core.summary.medals += summary.medals;
		key.core.summary.suicides += summary.suicides;
		key.core.summary.vehicles.destroys += summary.vehicles.destroys;
		key.core.summary.vehicles.hijacks += summary.vehicles.hijacks;
	}

	/**
	 * Adds the damage of the match to the service record
	 * @param key the multiplayer service record key
	 * @param damage the damage
	 */
	private static AddDamage(key: AutocodeMultiplayerKey, damage: AutocodeSRDamage): void
	{
		key.core.damage.dealt += damage.dealt;
		key.core.damage.taken += damage.taken;
	}

	/**
	 * Adds the shots of the match to the service record
	 * @param key the multiplayer service record key
	 * @param player the player details
	 */
	private static AddShots(key: AutocodeMultiplayerKey, shots: AutocodeSRAccuracy): void
	{
		key.core.shots.fired += shots.fired;
		key.core.shots.missed += shots.missed;
		key.core.shots.landed += shots.landed;
	}

	/**
	 * Adds the rounds of the match to the service record
	 * @param key the multiplayer service record key
	 * @param player the player details
	 */
	private static AddRounds(key: AutocodeMultiplayerKey, rounds: AutocodeSRRounds): void
	{
		key.core.rounds.won += rounds.won;
		key.core.rounds.lost += rounds.lost;
		key.core.rounds.tied += rounds.tied;
	}

	/**
	 * Adds the scores of the match to the service record
	 * @param key the multiplayer service record key
	 * @param player the player details
	 */
	private static AddScore(key: AutocodeMultiplayerKey, scores: AutocodeSRScore): void
	{
		key.core.scores.personal += scores.personal;
		key.core.scores.points += scores.points;
	}

	/**
	 * Adds the breakdowns of the match to the service record
	 * @param key the multiplayer service record key
	 * @param player the player details
	 */
	private static AddBreakdown(key: AutocodeMultiplayerKey, breakdowns: AutocodeSRBreakdowns): void
	{
		key.core.breakdowns.assists.callouts += breakdowns.assists.callouts;
		key.core.breakdowns.assists.driver += breakdowns.assists.driver;
		key.core.breakdowns.assists.emp += breakdowns.assists.emp;

		key.core.breakdowns.kills.assassinations += breakdowns.kills.assassinations;
		key.core.breakdowns.kills.grenades += breakdowns.kills.grenades;
		key.core.breakdowns.kills.headshots += breakdowns.kills.headshots;
		key.core.breakdowns.kills.melee += breakdowns.kills.melee;
		key.core.breakdowns.kills.miscellaneous.repulsor += breakdowns.kills.miscellaneous.repulsor;
		key.core.breakdowns.kills.miscellaneous.fusion_coils += breakdowns.kills.miscellaneous.fusion_coils;
		key.core.breakdowns.kills.power_weapons += breakdowns.kills.power_weapons;
		key.core.breakdowns.kills.vehicles.splatters += breakdowns.kills.vehicles.splatters;

		const destroysArray: { value: string, count: number }[] = [];
		const hijacksArray: { value: string, count: number }[] = [];
		const medalsArray: { id: number, count: number }[] = [];

		const destroys = new Map<string, number>();
		const hijacks = new Map<string, number>();
		const medals = new Map<number, number>();

		// Loop through key first
		if (key.core.breakdowns.vehicles)
		{
			if (key.core.breakdowns.vehicles.destroys && key.core.breakdowns.vehicles.destroys.length > 0) 
			{ 
				for (const i in key.core.breakdowns.vehicles.destroys) 
				{ 
					destroys.set(key.core.breakdowns.vehicles.destroys[i].value, key.core.breakdowns.vehicles.destroys[i].count); 
				}
			}
			if (key.core.breakdowns.vehicles.hijacks && key.core.breakdowns.vehicles.hijacks.length > 0) 
			{ 
				for (const i in key.core.breakdowns.vehicles.hijacks) 
				{ 
					hijacks.set(key.core.breakdowns.vehicles.hijacks[i].value, key.core.breakdowns.vehicles.hijacks[i].count); 
				}
			}
		}

		if (key.core.breakdowns.medals)
		{
			if (key.core.breakdowns.medals && key.core.breakdowns.medals.length > 0) 
			{ 
				for (const i in key.core.breakdowns.medals) 
				{ 
					medals.set(key.core.breakdowns.medals[i].id, key.core.breakdowns.medals[i].count); 
				}
			}
		}

		// Now loop through player
		if (breakdowns.vehicles)
		{
			if (breakdowns.vehicles.destroys && breakdowns.vehicles.destroys.length > 0)
			{
				for (const i in breakdowns.vehicles.destroys)
				{
					let count = destroys.get(breakdowns.vehicles.destroys[i].value) ?? 0;
					count += breakdowns.vehicles.destroys[i].count;
					destroys.set(breakdowns.vehicles.destroys[i].value, count);
				}
			}
	
			if (breakdowns.vehicles.hijacks && breakdowns.vehicles.hijacks.length > 0)
			{
				for (const i in breakdowns.vehicles.hijacks)
				{
					let count = hijacks.get(breakdowns.vehicles.hijacks[i].value) ?? 0;
					count += breakdowns.vehicles.hijacks[i].count;
					hijacks.set(breakdowns.vehicles.hijacks[i].value, count);
				}
			}
		}

		if (breakdowns.medals && breakdowns.medals.length > 0)
		{
			for (const i in breakdowns.medals)
			{
				let count = medals.get(breakdowns.medals[i].id) ?? 0;
				count += breakdowns.medals[i].count;
				medals.set(breakdowns.medals[i].id, count);
			}
		}

		// Set into property
		destroys.forEach((value: number, key: string) => destroysArray.push({ value: key, count: value }));
		hijacks.forEach((value: number, key: string) => hijacksArray.push({ value: key, count: value }));
		medals.forEach((value: number, key: number) => medalsArray.push({ id: key, count: value }));

		key.core.breakdowns.medals = medalsArray;
		key.core.breakdowns.vehicles = {
			destroys: destroysArray,
			hijacks: hijacksArray
		};
	}

	/**
	 * Adds a player's details to an existing service record
	 * @param serviceRecord the service record to add to
	 * @param playerDetails the player's match details
	 * @param isRanked was this a ranked match?
	 * @param secondsPlayed the number of seconds the match lasted
	 */
	public static AddMatchToServiceRecord(serviceRecord: AutocodeMultiplayerServiceRecord, playerDetails: AutocodeMatchPlayer, isRanked: boolean, secondsPlayed: number): void
	{	
		if (!serviceRecord.data) { return; }

		// Parse out
		const pvp = serviceRecord.data.records.pvp;
		let social = serviceRecord.data.records.social;
		let ranked = serviceRecord.data.records.ranked;
		const key = isRanked ? ranked : social;

		// PVP
		pvp.time_played.seconds += secondsPlayed;
		this.AddOutcome(pvp, playerDetails.outcome);
		this.AddSummary(pvp, playerDetails.stats.core.summary);
		this.AddDamage(pvp, playerDetails.stats.core.damage);
		this.AddScore(pvp, playerDetails.stats.core.scores);
		this.AddShots(pvp, playerDetails.stats.core.shots);
		this.AddBreakdown(pvp, playerDetails.stats.core.breakdowns);
		this.AddRounds(pvp, playerDetails.stats.core.rounds);
		this.UpdateCalculatedProperties(pvp);
		
		// Put them back (I don't actually think I need to do this)
		serviceRecord.data.records.pvp = pvp;

		// Social/Ranked
		if (key)
		{
			key.time_played.seconds += secondsPlayed;
			this.AddOutcome(key, playerDetails.outcome);
			this.AddSummary(key, playerDetails.stats.core.summary);
			this.AddDamage(key, playerDetails.stats.core.damage);
			this.AddScore(key, playerDetails.stats.core.scores);
			this.AddShots(key, playerDetails.stats.core.shots);
			this.AddBreakdown(key, playerDetails.stats.core.breakdowns);
			this.AddRounds(key, playerDetails.stats.core.rounds);
			this.UpdateCalculatedProperties(key);
			
			// Put them back (I don't actually think I need to do this)
			if (isRanked) { ranked = key; }
			else { social = key; }
			serviceRecord.data.records.social = social;
			serviceRecord.data.records.ranked = ranked;
		}
	}

	/**
	 * Calculates KDA, KDR, accuracy, and win rate
	 * @param key the service record to update
	 */
	private static UpdateCalculatedProperties(key: AutocodeMultiplayerKey): void
	{
		const kills = key.core?.summary?.kills ?? 0;
		const assists = key.core?.summary?.assists ?? 0;
		const deaths = key.core?.summary?.deaths ?? 0;
		const wins = key.matches?.outcomes?.wins ?? 0;
		const matches = key.matches?.total ?? 0;
		const shotsLanded = key.core?.shots?.landed ?? 0;
		const shotsFired = key.core?.shots?.fired ?? 0;
		const damageDealt = key.core?.damage?.dealt ?? 0;

		// Calculate win rate and KDA
		if (matches > 0)
		{
			key.matches.win_rate = (wins / matches) * 100;
			key.core.kda = (kills + (assists / 3) - deaths) / matches;
			key.core.damage.average = damageDealt / matches;
		}

		// Calculate KDR
		if (deaths > 0)
		{
			key.core.kdr = kills / deaths;
		}

		// Calculate accuracy
		if (shotsFired > 0)
		{
			key.core.shots.accuracy = (shotsLanded / shotsFired) * 100;
		}
	}
	//#endregion

	//#region Subtracters
	/**
	 * Subtracts a player's details to an existing service record
	 * @param serviceRecord the service record to add to
	 * @param playerDetails the player's match details
	 * @param isRanked was this a ranked match?
	 * @param secondsPlayed the number of seconds the match lasted
	 */
	public static RemoveMatchFromServiceRecord(serviceRecord: AutocodeMultiplayerServiceRecord, playerDetails: AutocodeMatchPlayer, isRanked: boolean, secondsPlayed: number): void
	{	
		if (!serviceRecord.data) { return; }

		// Parse out
		const pvp = serviceRecord.data.records.pvp;
		let social = serviceRecord.data.records.social;
		let ranked = serviceRecord.data.records.ranked;
		const key = isRanked ? ranked : social;

		// PVP
		pvp.time_played.seconds -= secondsPlayed;
		this.SubtractOutcome(pvp, playerDetails.outcome);
		this.SubtractSummary(pvp, playerDetails);
		this.SubtractDamage(pvp, playerDetails);
		this.SubtractScore(pvp, playerDetails);
		this.SubtractShots(pvp, playerDetails);
		this.SubtractBreakdown(pvp, playerDetails);
		this.SubtractRounds(pvp, playerDetails);
		this.UpdateCalculatedProperties(pvp);
		
		// Put them back (I don't actually think I need to do this)
		serviceRecord.data.records.pvp = pvp;

		// Social/Ranked
		if (key)
		{
			key.time_played.seconds -= secondsPlayed;
			this.SubtractOutcome(key, playerDetails.outcome);
			this.SubtractSummary(key, playerDetails);
			this.SubtractDamage(key, playerDetails);
			this.SubtractScore(key, playerDetails);
			this.SubtractShots(key, playerDetails);
			this.SubtractBreakdown(key, playerDetails);
			this.SubtractRounds(key, playerDetails);
			this.UpdateCalculatedProperties(key);
			
			// Put them back (I don't actually think I need to do this)
			if (isRanked) { ranked = key; }
			else { social = key; }
			serviceRecord.data.records.social = social;
			serviceRecord.data.records.ranked = ranked;
		}
	}
 
	 /**
	  * Subtracts the outcome to the multiplayer service record key
	  * @param key the multiplayer service record key
	  * @param outcome the outcome
	  */
	private static SubtractOutcome(key: AutocodeMultiplayerKey, outcome: AutocodeOutcome): void
	{
		key.matches.outcomes.wins -= outcome === "won" || outcome === "win" ? 1 : 0;
		key.matches.outcomes.losses -= outcome === "loss" ? 1 : 0;
		key.matches.outcomes.left -= outcome === "left" ? 1 : 0;

		key.matches.total -= 1;
	}
 
	 /**
	  * Subtracts the summary of the match to the service record
	  * @param key the multiplayer service record key
	  * @param player the player details
	  */
	private static SubtractSummary(key: AutocodeMultiplayerKey, player: AutocodeMatchPlayer): void
	{
		key.core.summary.assists -= player.stats.core.summary.assists;
		key.core.summary.betrayals -= player.stats.core.summary.betrayals;
		key.core.summary.deaths -= player.stats.core.summary.deaths;
		key.core.summary.kills -= player.stats.core.summary.kills;
		key.core.summary.medals -= player.stats.core.summary.medals;
		key.core.summary.suicides -= player.stats.core.summary.suicides;
		key.core.summary.vehicles.destroys -= player.stats.core.summary.vehicles.destroys;
		key.core.summary.vehicles.hijacks -= player.stats.core.summary.vehicles.hijacks;
	}
 
	 /**
	  * Subtracts the damage of the match to the service record
	  * @param key the multiplayer service record key
	  * @param player the player details
	  */
	private static SubtractDamage(key: AutocodeMultiplayerKey, player: AutocodeMatchPlayer): void
	{
		key.core.damage.dealt -= player.stats.core.damage.dealt;
		key.core.damage.taken -= player.stats.core.damage.taken;
	}
 
	 /**
	  * Subtracts the shots of the match to the service record
	  * @param key the multiplayer service record key
	  * @param player the player details
	  */
	private static SubtractShots(key: AutocodeMultiplayerKey, player: AutocodeMatchPlayer): void
	{
		key.core.shots.fired -= player.stats.core.shots.fired;
		key.core.shots.missed -= player.stats.core.shots.missed;
		key.core.shots.landed -= player.stats.core.shots.landed;
	}
 
	 /**
	  * Subtracts the rounds of the match to the service record
	  * @param key the multiplayer service record key
	  * @param player the player details
	  */
	private static SubtractRounds(key: AutocodeMultiplayerKey, player: AutocodeMatchPlayer): void
	{
		key.core.rounds.won -= player.stats.core.rounds.won;
		key.core.rounds.lost -= player.stats.core.rounds.lost;
		key.core.rounds.tied -= player.stats.core.rounds.tied;
	}
 
	 /**
	  * Subtracts the scores of the match to the service record
	  * @param key the multiplayer service record key
	  * @param player the player details
	  */
	private static SubtractScore(key: AutocodeMultiplayerKey, player: AutocodeMatchPlayer): void
	{
		key.core.scores.personal -= player.stats.core.scores.personal;
		key.core.scores.points -= player.stats.core.scores.points;
	}
 
	 /**
	  * Subtracts the breakdowns of the match to the service record
	  * @param key the multiplayer service record key
	  * @param player the player details
	  */
	private static SubtractBreakdown(key: AutocodeMultiplayerKey, player: AutocodeMatchPlayer): void
	{
		key.core.breakdowns.assists.callouts -= player.stats.core.breakdowns.assists.callouts;
		key.core.breakdowns.assists.driver -= player.stats.core.breakdowns.assists.driver;
		key.core.breakdowns.assists.emp -= player.stats.core.breakdowns.assists.emp;

		key.core.breakdowns.kills.assassinations -= player.stats.core.breakdowns.kills.assassinations;
		key.core.breakdowns.kills.grenades -= player.stats.core.breakdowns.kills.grenades;
		key.core.breakdowns.kills.headshots -= player.stats.core.breakdowns.kills.headshots;
		key.core.breakdowns.kills.melee -= player.stats.core.breakdowns.kills.melee;
		key.core.breakdowns.kills.miscellaneous.repulsor -= player.stats.core.breakdowns.kills.miscellaneous.repulsor;
		key.core.breakdowns.kills.miscellaneous.fusion_coils -= player.stats.core.breakdowns.kills.miscellaneous.fusion_coils;
		key.core.breakdowns.kills.power_weapons -= player.stats.core.breakdowns.kills.power_weapons;
		key.core.breakdowns.kills.vehicles.splatters -= player.stats.core.breakdowns.kills.vehicles.splatters;

		const destroysArray: { value: string, count: number }[] = [];
		const hijacksArray: { value: string, count: number }[] = [];
		const medalsArray: { id: number, count: number }[] = [];

		const destroys = new Map<string, number>();
		const hijacks = new Map<string, number>();
		const medals = new Map<number, number>();

		// Loop through key first
		if (key.core.breakdowns.vehicles)
		{
			if (key.core.breakdowns.vehicles.destroys && key.core.breakdowns.vehicles.destroys.length > 0) 
			{ 
				for (const i in key.core.breakdowns.vehicles.destroys) 
				{ 
					destroys.set(key.core.breakdowns.vehicles.destroys[i].value, key.core.breakdowns.vehicles.destroys[i].count); 
				}
			}
			if (key.core.breakdowns.vehicles.hijacks && key.core.breakdowns.vehicles.hijacks.length > 0) 
			{ 
				for (const i in key.core.breakdowns.vehicles.hijacks) 
				{ 
					hijacks.set(key.core.breakdowns.vehicles.hijacks[i].value, key.core.breakdowns.vehicles.hijacks[i].count); 
				}
			}
		}

		if (key.core.breakdowns.medals)
		{
			if (key.core.breakdowns.medals && key.core.breakdowns.medals.length > 0) 
			{ 
				for (const i in key.core.breakdowns.medals) 
				{ 
					medals.set(key.core.breakdowns.medals[i].id, key.core.breakdowns.medals[i].count); 
				}
			}
		}

		// Now loop through player
		if (player.stats.core.breakdowns.vehicles)
		{
			if (player.stats.core.breakdowns.vehicles.destroys && player.stats.core.breakdowns.vehicles.destroys.length > 0)
			{
				for (const i in player.stats.core.breakdowns.vehicles.destroys)
				{
					let count = destroys.get(player.stats.core.breakdowns.vehicles.destroys[i].value) ?? 0;
					count -= player.stats.core.breakdowns.vehicles.destroys[i].count;
					destroys.set(player.stats.core.breakdowns.vehicles.destroys[i].value, count);
				}
			}
	
			if (player.stats.core.breakdowns.vehicles.hijacks && player.stats.core.breakdowns.vehicles.hijacks.length > 0)
			{
				for (const i in player.stats.core.breakdowns.vehicles.hijacks)
				{
					let count = hijacks.get(player.stats.core.breakdowns.vehicles.hijacks[i].value) ?? 0;
					count -= player.stats.core.breakdowns.vehicles.hijacks[i].count;
					hijacks.set(player.stats.core.breakdowns.vehicles.hijacks[i].value, count);
				}
			}
		}

		if (player.stats.core.breakdowns.medals && player.stats.core.breakdowns.medals.length > 0)
		{
			for (const i in player.stats.core.breakdowns.medals)
			{
				let count = medals.get(player.stats.core.breakdowns.medals[i].id) ?? 0;
				count -= player.stats.core.breakdowns.medals[i].count;
				medals.set(player.stats.core.breakdowns.medals[i].id, count);
			}
		}

		// Set into property
		destroys.forEach((value: number, key: string) => destroysArray.push({ value: key, count: value }));
		hijacks.forEach((value: number, key: string) => hijacksArray.push({ value: key, count: value }));
		medals.forEach((value: number, key: number) => medalsArray.push({ id: key, count: value }));

		key.core.breakdowns.medals = medalsArray;
		key.core.breakdowns.vehicles = {
			destroys: destroysArray,
			hijacks: hijacksArray
		};
	}
	 //#endregion
}