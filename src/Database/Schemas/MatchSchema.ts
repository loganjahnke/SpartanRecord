import { MatchProperties, DurationSchema, PlayerMatchDetailsSchema, PlayerMatchPlayerSchema, SeasonSchema, StatsCoreSchema } from "./PlayerMatchSchema"
import { CTFSchema, OddballSchema, ZoneSchema, EliminationSchema, StockpileSchema } from "./ServiceRecordSchema";

export interface MatchSchema {
	data: MatchDataSchema
	additional: Additional
}
  
export interface MatchDataSchema {
	id: string;
	details: PlayerMatchDetailsSchema;
	properties: MatchProperties;
	teams: MatchTeamSchema[];
	players: MatchPlayerSchema[];
	season: SeasonSchema;
	playable_duration: DurationSchema;
	started_at: string;
	ended_at: string;
}
  
export interface MatchTeamSchema {
	id: number;
	name: string;
	rank: number;
	outcome: string;
	stats: TeamStatsSchema;
	odds: TeamOdds;
}

export interface TeamStatsSchema {
	core: StatsCoreSchema;
	mode: CTFSchema | OddballSchema | ZoneSchema | EliminationSchema | StockpileSchema;
	mmr: number;
}

export interface TeamOdds {
	winning: number;
	losing: number;
}
  
export interface MatchPlayerSchema extends PlayerMatchPlayerSchema {
	name: string;
	attributes: MatchPlayerAttributes;
}
  
export interface MatchPlayerAttributes {
	resolved: boolean
}
  
export interface Additional {
	query: {
		language: string;
	}
}
  