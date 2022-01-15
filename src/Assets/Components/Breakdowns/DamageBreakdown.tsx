import { Box } from "@mui/material";
import { BreakdownProps, BreakdownTile } from "./BreakdownTile";

export function DamageBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%"}}>
                        <BreakdownTile title="Damage Dealt" value={showPerMatch ? serviceRecord.damage.dealt / serviceRecord.matchesPlayed : serviceRecord.damage.dealt} isMainStat />
                        <BreakdownTile title="Damage Taken" value={showPerMatch ? serviceRecord.damage.taken / serviceRecord.matchesPlayed : serviceRecord.damage.taken} isMainStat />
                  </Box>
		</Box>
	);
}