import { ArrowheadTheme } from "../../Assets/Theme/ArrowheadTheme";

export function GetColorForTeam(name: string): string
{
	if (!name) { return ArrowheadTheme.card; }
	return (AllTeams as any)[name]?.color ?? ArrowheadTheme.halo_cerulean;
}

export const AllTeams = {
	Eagle:
	{
		id: 0,
		emblem_url: "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/teams/eagle.png",
		color: ArrowheadTheme.halo_cerulean
	},
	Cobra:
	{
		id: 1,
		emblem_url: "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/teams/cobra.png",
		color: ArrowheadTheme.halo_salmon
	},
	Hades:
	{
		id: 2,
		emblem_url: "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/teams/hades.png",
		color: ArrowheadTheme.halo_jade
	},
	Valkyrie:
	{
		id: 3,
		emblem_url: "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/teams/valkyrie.png",
		color: ArrowheadTheme.halo_aubergine
	},
	Rampart:
	{
		id: 4,
		emblem_url: "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/teams/rampart.png",
		color: ArrowheadTheme.halo_sky
	},
	Cutlass:
	{
		id: 5,
		emblem_url: "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/teams/cutlass.png",
		color: ArrowheadTheme.halo_tangelo
	},
	Valor:
	{
		id: 6,
		emblem_url: "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/teams/valor.png",
		color: ArrowheadTheme.halo_pineapple
	},
	Hazard:
	{
		id: 7,
		emblem_url: "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/teams/hazard.png",
		color: ArrowheadTheme.halo_carrot
	},
	Observer:
	{
		id: 8,
		emblem_url: "https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/teams/observer.png",
		color: ArrowheadTheme.halo_mint
	}
}