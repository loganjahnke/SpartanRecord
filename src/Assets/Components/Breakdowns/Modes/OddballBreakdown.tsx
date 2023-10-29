import { Box } from "@mui/material";
import { BreakdownProps, BreakdownTile } from "../BreakdownTile";
import { ArrowheadTheme } from "../../../Theme/ArrowheadTheme";

export function OddballBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	return (
		<>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Time as Carrier" value={serviceRecord.oddball.timeAsSkullCarrier} isMainStat />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Kills as Carrier" value={showPerMatch ? serviceRecord.oddball.killsAsSkullCarrier / serviceRecord.matchesPlayed : serviceRecord.oddball.killsAsSkullCarrier} small isMainStat backgroundColor={ArrowheadTheme.box} />
				<BreakdownTile title="Skull Grabs" value={showPerMatch ? serviceRecord.oddball.skullGrabs / serviceRecord.matchesPlayed : serviceRecord.oddball.skullGrabs} small isMainStat backgroundColor={ArrowheadTheme.box} />
				<BreakdownTile title="Scoring Ticks" value={showPerMatch ? serviceRecord.oddball.skullScoringTicks / serviceRecord.matchesPlayed : serviceRecord.oddball.skullScoringTicks} small isMainStat backgroundColor={ArrowheadTheme.box} />
				<BreakdownTile title="Skull Carriers Killed" value={showPerMatch ? serviceRecord.oddball.skullCarriersKilled / serviceRecord.matchesPlayed : serviceRecord.oddball.skullCarriersKilled} small isMainStat backgroundColor={ArrowheadTheme.box} />
				<BreakdownTile title="Longest Time as Carrier" value={serviceRecord.oddball.longestTimeAsSkullCarrier} small isMainStat backgroundColor={ArrowheadTheme.box} />
			</Box>
		</>
	);
}