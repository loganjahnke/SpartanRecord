//#region Enums
export enum Outcome
{
	win = "win",
	lose = "loss",
	tie = "draw",
	left = "left"
}
//#endregion

//#region Interfaces
export interface Duration 
{
	seconds: number;
	human: string;
}

export interface ImageUrls 
{
	small: string;
	medium: string;
	large: string;
}

export interface Summary 
{
	kills: number;
	deaths: number;
	assists: number;
	betrayals: number;
	suicides: number;
	vehicles: Vehicles;
	medals: number;
}

export interface Vehicles 
{
	destroys: number;
	hijacks: number;
}

export interface Damage 
{
	taken: number;
	dealt: number;
}

export interface Shots 
{
	fired: number;
	landed: number;
	missed: number;
	accuracy: number;
}

export interface Breakdowns 
{
	kills: Kills;
	assists: Assists;
	matches: Matches;
	medals?: (MedalsEntity)[] | null;
}

export interface Kills 
{
	melee: number;
	grenades: number;
	headshots: number;
	power_weapons: number;
}

export interface Assists 
{
	emp: number;
	driver: number;
	callouts: number;
}

export interface Matches 
{
	wins: number;
	losses: number;
	left: number;
	draws: number;
}

export interface MedalsEntity 
{
	id: number;
	name: string;
	count: number;
	image_urls: ImageUrls;
}
//#endregion