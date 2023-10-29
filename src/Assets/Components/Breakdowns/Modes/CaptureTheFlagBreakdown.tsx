import { Box } from "@mui/material";
import { BreakdownProps, BreakdownTile } from "../BreakdownTile";
import { ArrowheadTheme } from "../../../Theme/ArrowheadTheme";

export function CaptureTheFlagBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	return (
		<>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Flag Captures" value={showPerMatch ? serviceRecord.ctf.flagCaptures / serviceRecord.matchesPlayed : serviceRecord.ctf.flagCaptures} isMainStat tooltip="Total captures" />
				<BreakdownTile title="Flag Returns" value={showPerMatch ? serviceRecord.ctf.flagReturns / serviceRecord.matchesPlayed : serviceRecord.ctf.flagReturns} isMainStat tooltip="Total flag returns" />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Flag Grabs" value={showPerMatch ? serviceRecord.ctf.flagGrabs / serviceRecord.matchesPlayed : serviceRecord.ctf.flagGrabs} small isMainStat backgroundColor={ArrowheadTheme.box}  />
				<BreakdownTile title="Kills as Flag Carrier" value={showPerMatch ? serviceRecord.ctf.killsAsFlagCarrier / serviceRecord.matchesPlayed : serviceRecord.ctf.killsAsFlagCarrier} small isMainStat backgroundColor={ArrowheadTheme.box}  />
				<BreakdownTile title="Flag Capture Assists" value={showPerMatch ? serviceRecord.ctf.flagCaptureAssists / serviceRecord.matchesPlayed : serviceRecord.ctf.flagCaptureAssists} small isMainStat backgroundColor={ArrowheadTheme.box}  />
				<BreakdownTile title="Time as Carrier" value={serviceRecord.ctf.timeAsCarrier.readable()} small isMainStat backgroundColor={ArrowheadTheme.box}  />
				<BreakdownTile title="Flag Carriers Killed" value={showPerMatch ? serviceRecord.ctf.flagCarriersKilled / serviceRecord.matchesPlayed : serviceRecord.ctf.flagCarriersKilled} small isMainStat backgroundColor={ArrowheadTheme.box}  />
				<BreakdownTile title="Flag Returners Killed" value={showPerMatch ? serviceRecord.ctf.flagReturnersKilled / serviceRecord.matchesPlayed : serviceRecord.ctf.flagReturnersKilled} small isMainStat backgroundColor={ArrowheadTheme.box}  />
			</Box>
		</>
	);
}