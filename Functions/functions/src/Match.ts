import { Breakdowns, Damage, Duration, Outcome, Shots, Summary } from "./Shared";

export interface Match 
{
	id: string;
	details: Details;
	teams: Teams;
	player: Player;
	experience: string;
	played_at: string;
	duration: Duration;
}

interface Details 
{
	category: CategoryOrMap;
	map: CategoryOrMap;
	playlist: Playlist;
}

interface CategoryOrMap 
{
	name: string;
	asset: Asset;
}

interface Asset 
{
	id: string;
	version: string;
	thumbnail_url: string;
}

interface Playlist 
{
	name: string;
	asset: Asset;
	properties: Properties;
}

interface Properties 
{
	queue?: string;
	input?: string;
	ranked: boolean;
}

interface Teams 
{
	enabled: boolean;
	scoring: boolean;
}

interface Player 
{
	team: Team;
	stats: Stats;
	rank: number;
	outcome: Outcome;
	participation: Participation;
	progression?: Progression;
}

interface Progression
{
	csr: CSR;
}

interface CSR
{
	pre_match: PreMatchOrPostMatch;
	post_match: PreMatchOrPostMatch;
}

interface PreMatchOrPostMatch
{
	value: number;
	tier: string;
	tier_start: number;
	sub_tier: number;
	tier_image_url: string;
}

interface Team 
{
	id: number;
	name: string;
	emblem_url: string;
}

interface Stats 
{
	core: Core;
	mode?: any;
}

interface Core 
{
	summary: Summary;
	damage: Damage;
	shots: Shots;
	rounds: Rounds;
	breakdowns: Breakdowns;
	kda: number;
	kdr: number;
	score: number;
}

interface Rounds 
{
	won: number;
	lost: number;
	tied: number;
}

interface Participation 
{
	joined_in_progress: boolean;
	presence: Presence;
}

interface Presence 
{
	beginning: boolean;
	completion: boolean;
}