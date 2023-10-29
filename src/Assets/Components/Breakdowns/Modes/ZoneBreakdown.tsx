import { Box } from "@mui/material";
import { BreakdownProps, BreakdownTile } from "../BreakdownTile";
import { ArrowheadTheme } from "../../../Theme/ArrowheadTheme";

export function ZoneBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	return (
		<>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Zone Captures" value={showPerMatch ? serviceRecord.zone.zoneCaptures / serviceRecord.matchesPlayed : serviceRecord.zone.zoneCaptures} isMainStat />
				<BreakdownTile title="Zone Secures" value={showPerMatch ? serviceRecord.zone.zoneSecures / serviceRecord.matchesPlayed : serviceRecord.zone.zoneSecures} isMainStat />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Offensive Kills" value={showPerMatch ? serviceRecord.zone.zoneOffensiveKills / serviceRecord.matchesPlayed : serviceRecord.zone.zoneOffensiveKills} small isMainStat backgroundColor={ArrowheadTheme.box}  />
				<BreakdownTile title="Defensive Kills" value={showPerMatch ? serviceRecord.zone.zoneDefensiveKills / serviceRecord.matchesPlayed : serviceRecord.zone.zoneDefensiveKills} small isMainStat backgroundColor={ArrowheadTheme.box}  />
				<BreakdownTile title="Score Ticks" value={showPerMatch ? serviceRecord.zone.zoneScoringTicks / serviceRecord.matchesPlayed : serviceRecord.zone.zoneScoringTicks} small isMainStat backgroundColor={ArrowheadTheme.box}  />
				<BreakdownTile title="Zone Occupation Time" value={serviceRecord.zone.zoneOccupationTime} small isMainStat backgroundColor={ArrowheadTheme.box}  />
			</Box>
		</>
	);
}