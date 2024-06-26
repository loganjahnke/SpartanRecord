import { ArrowheadTheme } from "../../Assets/Theme/ArrowheadTheme";

export function GetColorForTeam(name: string): string
{
	if (!name) { return ArrowheadTheme.card; }
	return (AllTeams as any)[name]?.color ?? ArrowheadTheme.halo_cerulean;
}

export function ShouldInvertTextColorForTeam(name: string): boolean
{
	if (!name) { return false; }
	return name === "Valor" || name === "Observer";
}

export const AllTeams = {
	Eagle:
	{
		id: 0,
		emblem_url: "https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/object/public/assets/games/halo-infinite/metadata/multiplayer/teams/eagle.png",
		color: ArrowheadTheme.halo_cerulean
	},
	Cobra:
	{
		id: 1,
		emblem_url: "https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/object/public/assets/games/halo-infinite/metadata/multiplayer/teams/cobra.png",
		color: ArrowheadTheme.halo_salmon
	},
	Hades:
	{
		id: 2,
		emblem_url: "https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/object/public/assets/games/halo-infinite/metadata/multiplayer/teams/hades.png",
		color: ArrowheadTheme.halo_cerise
	},
	Valkyrie:
	{
		id: 3,
		emblem_url: "https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/object/public/assets/games/halo-infinite/metadata/multiplayer/teams/valkyrie.png",
		color:  ArrowheadTheme.halo_aubergine
	},
	Rampart:
	{
		id: 4,
		emblem_url: "https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/object/public/assets/games/halo-infinite/metadata/multiplayer/teams/rampart.png",
		color: ArrowheadTheme.halo_sky
	},
	Cutlass:
	{
		id: 5,
		emblem_url: "https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/object/public/assets/games/halo-infinite/metadata/multiplayer/teams/cutlass.png",
		color: ArrowheadTheme.halo_tangelo
	},
	Valor:
	{
		id: 6,
		emblem_url: "https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/object/public/assets/games/halo-infinite/metadata/multiplayer/teams/valor.png",
		color: ArrowheadTheme.halo_pineapple
	},
	Hazard:
	{
		id: 7,
		emblem_url: "https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/object/public/assets/games/halo-infinite/metadata/multiplayer/teams/hazard.png",
		color: ArrowheadTheme.halo_carrot
	},
	Observer:
	{
		id: 8,
		emblem_url: "https://etxvqmdrjezgtwgueiar.supabase.co/storage/v1/object/public/assets/games/halo-infinite/metadata/multiplayer/teams/observer.png",
		color: ArrowheadTheme.halo_jade
	}
}