import { EliminationSchema } from "../../../Database/Schemas/ServiceRecordSchema";

export class Elimination
{
	public alliesRevived: number = 0;
	public eliminationAssists: number = 0;
	public eliminations: number = 0;
	public enemyRevivesDenied: number = 0;
	public executions: number = 0;
	public killsAsLastPlayerStanding: number = 0;
	public lastPlayersStandingKilled: number = 0;
	public roundsSurvived: number = 0;
	public timesRevivedByAlly: number = 0;

	constructor(data?: EliminationSchema)
	{
		if (!data) { return; }
		this.alliesRevived = data.allies_revived;
		this.eliminationAssists = data.elimination_assists;
		this.eliminations = data.eliminations;
		this.enemyRevivesDenied = data.enemy_revives_denied;
		this.executions = data.executions;
		this.killsAsLastPlayerStanding = data.kills_as_last_player_standing;
		this.lastPlayersStandingKilled = data.last_players_standing_killed;
		this.roundsSurvived = data.rounds_survived;
		this.timesRevivedByAlly = data.times_revived_by_ally;
	}
}