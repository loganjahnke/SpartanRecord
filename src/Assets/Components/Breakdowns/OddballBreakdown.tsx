import { Box } from "@mui/material";
import { TitleCard } from "../Cards/TitleCard";
import { BreakdownRowTile } from "./BreakdownRowTile";
import { BreakdownProps, BreakdownTile } from "./BreakdownTile";

export function OddballBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	return (
		<TitleCard title="Oddball">
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Time as Carrier" value={serviceRecord.oddball.timeAsSkullCarrier} isMainStat />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownRowTile title="Kills as Carrier" value={showPerMatch ? serviceRecord.oddball.killsAsSkullCarrier / serviceRecord.matchesPlayed : serviceRecord.oddball.killsAsSkullCarrier} isMainStat />
				<BreakdownRowTile title="Skull Grabs" value={showPerMatch ? serviceRecord.oddball.skullGrabs / serviceRecord.matchesPlayed : serviceRecord.oddball.skullGrabs} isMainStat />
				<BreakdownRowTile title="Scoring Ticks" value={showPerMatch ? serviceRecord.oddball.skullScoringTicks / serviceRecord.matchesPlayed : serviceRecord.oddball.skullScoringTicks} isMainStat />
				<BreakdownRowTile title="Skull Carriers Killed" value={showPerMatch ? serviceRecord.oddball.skullCarriersKilled / serviceRecord.matchesPlayed : serviceRecord.oddball.skullCarriersKilled} isMainStat />
				<BreakdownRowTile title="Longest Time as Carrier" value={serviceRecord.oddball.longestTimeAsSkullCarrier} isMainStat />
			</Box>
		</TitleCard>
	);
}