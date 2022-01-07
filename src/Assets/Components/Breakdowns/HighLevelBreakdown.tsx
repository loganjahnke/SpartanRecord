import { Box, Tooltip } from "@mui/material";
import { Halo5Converter } from "../../../Objects/Helpers/Halo5Converter";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { BreakdownTile } from "./BreakdownTile";

export function HighLevelBreakdown(props: { serviceRecord: ServiceRecord, icon: string })
{
	const { serviceRecord, icon } = props;

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ p: 3, pb: 0 }}>
			    <img src={icon} alt="emblem" height="48px" />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
                <BreakdownTile title="KDA" value={serviceRecord.kda} isMainStat />
                <BreakdownTile title="KDR" value={serviceRecord.kdr} isMainStat />
                <BreakdownTile title="Total Score" value={serviceRecord.totalScore} isMainStat />
                <BreakdownTile title="Spartan Rank" value={Halo5Converter.GetLevelFromScore(serviceRecord.totalScore)} isMainStat />
            </Box>
		</Box>
	);
}