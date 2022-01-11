import { Box, Tooltip } from "@mui/material";
import { Halo5Converter } from "../../../Objects/Helpers/Halo5Converter";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { BreakdownTile } from "./BreakdownTile";

export function KDABreakdown(props: { serviceRecord: ServiceRecord })
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