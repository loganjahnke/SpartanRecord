import { Box } from "@mui/material";
import { BreakdownTile } from "./BreakdownTile";

export function PercentageBreakdown(props: { totalMatches: number, filteredMatches: number })
{
	const { totalMatches, filteredMatches } = props;

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Percent of Total Matches" value={(100 * (filteredMatches / totalMatches)).toFixed(1).toLocaleString()} isMainStat isPercent />
			</Box>
		</Box>
	);
}