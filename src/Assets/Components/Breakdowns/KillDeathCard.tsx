import { Box } from "@mui/material";
import { BreakdownProps, BreakdownTile } from "./BreakdownTile";

export function KillDeathCard(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
                        <BreakdownTile title="Kills" value={showPerMatch ? serviceRecord.summary.kills / serviceRecord.matchesPlayed : serviceRecord.summary.kills} isMainStat />
                        <BreakdownTile title="Deaths" value={showPerMatch ? serviceRecord.summary.deaths / serviceRecord.matchesPlayed : serviceRecord.summary.deaths} isMainStat />
                  </Box>
		</Box>
	);
}