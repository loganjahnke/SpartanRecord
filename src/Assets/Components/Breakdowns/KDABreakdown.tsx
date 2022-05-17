import { Box } from "@mui/material";
import { TitleCard } from "../Cards/TitleCard";
import { BreakdownProps, BreakdownTile } from "./BreakdownTile";

export function KDABreakdown(props: BreakdownProps)
{
	const { serviceRecord } = props;

	return (
		<TitleCard title="Metrics">
            <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
                <BreakdownTile title="KDA" value={serviceRecord.kda} isMainStat />
                <BreakdownTile title="KDR" value={serviceRecord.kdr} isMainStat />
            </Box>
		</TitleCard>
	);
}