import { Box } from "@mui/material";
import { BreakdownRowTile } from "../BreakdownRowTile";
import { BreakdownProps, BreakdownTile } from "../BreakdownTile";

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
				<BreakdownRowTile title="Flag Grabs" value={showPerMatch ? serviceRecord.ctf.flagGrabs / serviceRecord.matchesPlayed : serviceRecord.ctf.flagGrabs} isMainStat  />
				<BreakdownRowTile title="Kills as Flag Carrier" value={showPerMatch ? serviceRecord.ctf.killsAsFlagCarrier / serviceRecord.matchesPlayed : serviceRecord.ctf.killsAsFlagCarrier} isMainStat  />
				<BreakdownRowTile title="Flag Capture Assists" value={showPerMatch ? serviceRecord.ctf.flagCaptureAssists / serviceRecord.matchesPlayed : serviceRecord.ctf.flagCaptureAssists} isMainStat  />
				<BreakdownRowTile title="Flag Carriers Killed" value={showPerMatch ? serviceRecord.ctf.flagCarriersKilled / serviceRecord.matchesPlayed : serviceRecord.ctf.flagCarriersKilled} isMainStat  />
				<BreakdownRowTile title="Flag Returners Killed" value={showPerMatch ? serviceRecord.ctf.flagReturnersKilled / serviceRecord.matchesPlayed : serviceRecord.ctf.flagReturnersKilled} isMainStat  />
				<BreakdownRowTile title="Time as Carrier" value={serviceRecord.ctf.timeAsCarrier} isMainStat  />
			</Box>
		</>
	);
}