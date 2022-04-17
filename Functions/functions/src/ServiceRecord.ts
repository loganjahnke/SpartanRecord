import { Breakdowns, Damage, Duration, Shots, Summary } from "./Shared";

export interface ServiceRecord 
{
	data: Data;
	additional: Additional;
}

export interface Data 
{
	core: Core;
	matches_played: number;
	time_played: Duration;
	win_rate: number;
}

export interface Core 
{
	summary: Summary;
	damage: Damage;
	shots: Shots;
	breakdowns: Breakdowns;
	kda: number;
	kdr: number;
	total_score: number;
}

export interface Additional 
{
	gamertag?: string;
	filter?: string;
}
  