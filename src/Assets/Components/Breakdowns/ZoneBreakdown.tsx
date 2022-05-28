import { Box } from "@mui/material";
import { TitleCard } from "../Cards/TitleCard";
import { BreakdownRowTile } from "./BreakdownRowTile";
import { BreakdownProps, BreakdownTile } from "./BreakdownTile";

export function ZoneBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	return (
		<TitleCard title="Zones">
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Zone Captures" value={showPerMatch ? serviceRecord.zone.zoneCaptures / serviceRecord.matchesPlayed : serviceRecord.zone.zoneCaptures} isMainStat />
				<BreakdownTile title="Zone Secures" value={showPerMatch ? serviceRecord.zone.zoneSecures / serviceRecord.matchesPlayed : serviceRecord.zone.zoneSecures} isMainStat />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownRowTile title="Offensive Kills" value={showPerMatch ? serviceRecord.zone.zoneOffensiveKills / serviceRecord.matchesPlayed : serviceRecord.zone.zoneOffensiveKills} isMainStat  />
				<BreakdownRowTile title="Defensive Kills" value={showPerMatch ? serviceRecord.zone.zoneDefensiveKills / serviceRecord.matchesPlayed : serviceRecord.zone.zoneDefensiveKills} isMainStat  />
				<BreakdownRowTile title="Score Ticks" value={showPerMatch ? serviceRecord.zone.zoneScoringTicks / serviceRecord.matchesPlayed : serviceRecord.zone.zoneScoringTicks} isMainStat  />
				<BreakdownRowTile title="Zone Occupation Time" value={serviceRecord.zone.zoneOccupationTime} isMainStat  />
			</Box>
		</TitleCard>
	);
}