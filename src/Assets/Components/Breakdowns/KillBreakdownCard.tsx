import { Box } from "@mui/material";
import { TitleCard } from "../Cards/TitleCard";
import { KillBreakdownChart } from "../Charts/KillBreakdownChart";
import { BreakdownProps, BreakdownTile } from "./BreakdownTile";

export function KillBreakdownCard(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	return (
		<TitleCard title="Kills">
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
					<BreakdownTile title="Melee" value={showPerMatch ? serviceRecord.breakdowns.kills.melee / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.melee} isMainStat />
					<BreakdownTile title="Headshots" value={showPerMatch ? serviceRecord.breakdowns.kills.headshots / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.headshots} isMainStat />
					<BreakdownTile title="Power Weapons" value={showPerMatch ? serviceRecord.breakdowns.kills.powerWeapons / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.powerWeapons} isMainStat />
					<BreakdownTile title="Grenades" value={showPerMatch ? serviceRecord.breakdowns.kills.grenades / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.grenades} isMainStat />
					<BreakdownTile title="Fusion Coils" value={showPerMatch ? serviceRecord.breakdowns.kills.fusionCoil / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.fusionCoil} isMainStat />
					<BreakdownTile title="Assassinations" value={showPerMatch ? serviceRecord.breakdowns.kills.assassinations / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.assassinations} isMainStat />
					<BreakdownTile title="Splatters" value={showPerMatch ? serviceRecord.breakdowns.kills.splatters / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.splatters} isMainStat />
					<BreakdownTile title="Repulsor" value={showPerMatch ? serviceRecord.breakdowns.kills.repulsor / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.repulsor} isMainStat />
			</Box>
			<Box sx={{ width: "100%", pb: 1 }}>
					<KillBreakdownChart currentSR={serviceRecord} />
			</Box>
		</TitleCard>
	);
}