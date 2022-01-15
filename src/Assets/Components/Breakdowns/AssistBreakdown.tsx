import { Box } from "@mui/material";
import { BreakdownProps, BreakdownTile } from "./BreakdownTile";

export function AssistBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Assists" value={showPerMatch ? serviceRecord.summary.assists / serviceRecord.matchesPlayed : serviceRecord.summary.assists} isMainStat />
				<BreakdownTile title="EMP" value={showPerMatch ? serviceRecord.breakdowns.assists.emp / serviceRecord.matchesPlayed : serviceRecord.breakdowns.assists.emp} isMainStat />
				<BreakdownTile title="Driver" value={showPerMatch ? serviceRecord.breakdowns.assists.driver / serviceRecord.matchesPlayed : serviceRecord.breakdowns.assists.driver} isMainStat />
				<BreakdownTile title="Callouts" value={showPerMatch ? serviceRecord.breakdowns.assists.callouts / serviceRecord.matchesPlayed : serviceRecord.breakdowns.assists.callouts} isMainStat />
			</Box>
		</Box>
	);
}