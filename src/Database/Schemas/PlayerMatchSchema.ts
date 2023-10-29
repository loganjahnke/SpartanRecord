import { CTFSchema, EliminationSchema, OddballSchema, StockpileSchema, ZoneSchema, ExtractionSchema, InfectionSchema, ZoneServiceRecordSchema } from "./ServiceRecordSchema";

export interface PlayerMatchWithOddsSchema extends PlayerMatchSchema 
{	
	odds: number;
}

export interface PlayerMatchSchema 
{
	id: string;
	details: PlayerMatchDetailsSchema;
	properties: MatchProperties;
	player: PlayerMatchPlayerSchema;
	season: SeasonSchema;
	playable_duration: DurationSchema;
	started_at: string;
	ended_at: string;
}
  
export interface PlayerMatchDetailsSchema {
	map: MapSchema;
	ugcgamevariant: UGCGameVariantSchema;
	playlist: PlaylistSchema;
}
  
export interface MapSchema {
	id: string;
	version: string;
	name: string;
	image_urls: ImagesSchema;
	properties: MapProperties;
}
  
export interface ImagesSchema {
	hero: string;
	thumbnail: string;
	screenshots: string[];
}
  
export interface MapProperties {
	level_id: string;
	owner_type: string;
}
  
export interface UGCGameVariantSchema {
	id: string;
	version: string;
	name: string;
	image_urls: ImagesSchema;
	properties: GameVariantProperties;
};
  
export interface GameVariantProperties {
	category_id: number;
	engine_variant_id: string;
	owner_type: string;
}
  
export interface PlaylistSchema {
	id: string;
	version: string;
	name: string;
	image_urls: ImagesSchema;
	attributes: Attributes;
	properties: PlaylistProperties;
};
  
export interface Attributes {
	ranked: boolean;
}
  
export interface PlaylistProperties {
	queue: string;
	input: string;
	experience: string;
}
  
export interface MatchProperties {
	type: string;
	experience: string;
}
  
export interface PlayerMatchPlayerSchema {
	rank: number;
	outcome: string;
	properties: PlayerProperties;
	stats: PlayerStatsSchema;
	participation: Participation;
	progression: Progression;
	performances: Performances;
}
  
export interface PlayerProperties {
	type: string;
	team: TeamSchema;
}
  
export interface TeamSchema {
	id: number;
	name: string;
}
  
export interface PlayerStatsSchema {
	core: StatsCoreSchema;
	mode: CTFSchema | OddballSchema | ZoneSchema | EliminationSchema | StockpileSchema | ExtractionSchema | ZoneServiceRecordSchema | InfectionSchema;
	mmr: number;
}
  
export interface StatsCoreSchema {
	summary: Summary;
	damage: Damage;
	shots: Shots;
	rounds: Rounds;
	breakdown: Breakdown;
	kdr: number;
	kda: number;
	average_life_duration: DurationSchema;
	scores: Scores;
}
  
export interface Summary {
	kills: number;
	deaths: number;
	assists: number;
	betrayals: number;
	suicides: number;
	spawns: number;
	max_killing_spree: number;
	vehicles: Vehicles;
	medals: Medals;
}
  
export interface Vehicles {
	destroys: number;
	hijacks: number;
}
  
export interface Medals {
	total: number;
	unique: number;
}
  
export interface Damage {
	taken: number;
	dealt: number;
}
  
export interface Shots {
	fired: number;
	hit: number;
	missed: number;
	accuracy: number;
}
  
export interface Rounds {
	won: number;
	lost: number;
	tied: number;
}
  
export interface Breakdown {
	kills: Kills;
	assists: Assists;
	vehicles: VehicleBreakdown;
	medals: Medal[];
}
  
export interface Kills {
	melee: number;
	grenades: number;
	headshots: number;
	power_weapons: number;
	sticks: number;
	assassinations: number;
	vehicles: VehicleKills;
	miscellaneous: MiscKills;
}
  
export interface VehicleKills {
	splatters: number;
}
  
export interface MiscKills {
	repulsor: number;
	fusion_coils: number;
}
  
export interface Assists {
	emp: number;
	driver: number;
	callouts: number;
}
  
export interface VehicleBreakdown {
	destroys: Array<{
		value: string;
		count: number;
	}>;
	hijacks: Array<{
		value: string;
		count: number;
	}>;
}

export interface Medal {
	id: number;
	count: number;
}
  
export interface Scores {
	personal: number;
	points: number;
}
  
export interface Participation {
	confirmed: any;
	joined_in_progress: boolean;
	joined_at: string;
	left_at: Date;
	presence: Presence;
}
  
export interface Presence {
	beginning: boolean;
	completion: boolean;
}
  
export interface Progression {
	csr: any;
}
  
export interface Performances {
	kills: Performance;
	deaths: Performance;
}
  
export interface Performance {
	count: number;
	expected: number;
	standard_deviation: number;
}
  
export interface SeasonSchema {
	id: number;
	version: number;
	properties: SeasonProperties;
}
  
export interface SeasonProperties {
	identifier: string;
	csr: string;
}
  
export interface DurationSchema {
	seconds: number;
	human: string;
}