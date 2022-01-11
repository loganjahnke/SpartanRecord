import { Box } from "@mui/material";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { BreakdownTile } from "./BreakdownTile";

export function ShotsBreakdown(props: { serviceRecord: ServiceRecord })
{
	const { serviceRecord } = props;

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
                        <BreakdownTile title="Shots Fired" value={serviceRecord.shots.fired} isMainStat />
                        <BreakdownTile title="Accuracy" value={serviceRecord.shots.accuracy} isMainStat isPercent />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "row", width: "95%", mb: 1,
                        ".MuiBox-root:first-child": { borderRadius: "8px 0 0 8px", mr: "1px" }, 
                        ".MuiBox-root:last-child": { borderRadius: "0 8px 8px 0", ml: "1px" },
                        ".MuiBox-root:not(:first-child):not(:last-child)": { ml: "1px", mr: "1px" } }}>
                        <BreakdownTile title="Shots Landed" value={serviceRecord.shots.landed} total={serviceRecord.shots.fired} backgroundColor={ArrowheadTheme.good} />
                        <BreakdownTile title="Shots Missed" value={serviceRecord.shots.missed} total={serviceRecord.shots.fired} backgroundColor={ArrowheadTheme.bad} />
                  </Box>
		</Box>
	);
}