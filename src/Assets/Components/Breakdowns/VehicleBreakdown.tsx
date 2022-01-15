import { Box } from "@mui/material";
import { BreakdownProps, BreakdownTile } from "./BreakdownTile";

export function VehicleBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%"}}>
                <BreakdownTile title="Vehicles Destroyed" value={showPerMatch ? serviceRecord.summary.vehicles.destroys / serviceRecord.matchesPlayed : serviceRecord.summary.vehicles.destroys} isMainStat />
                <BreakdownTile title="Vehicles Hijacks" value={showPerMatch ? serviceRecord.summary.vehicles.hijacks / serviceRecord.matchesPlayed : serviceRecord.summary.vehicles.hijacks} isMainStat />
            </Box>
		</Box>
	);
}