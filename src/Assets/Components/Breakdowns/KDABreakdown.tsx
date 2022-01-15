import { Box } from "@mui/material";
import { BreakdownProps, BreakdownTile } from "./BreakdownTile";

export function KDABreakdown(props: BreakdownProps)
{
	const { serviceRecord } = props;

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
                <BreakdownTile title="KDA" value={serviceRecord.kda} isMainStat />
                <BreakdownTile title="KDR" value={serviceRecord.kdr} isMainStat />
            </Box>
		</Box>
	);
}