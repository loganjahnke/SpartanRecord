import { Box } from "@mui/material";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { BreakdownTile } from "./BreakdownTile";

export function ShotsBreakdown(props: { serviceRecord: ServiceRecord, icon: string })
{
	const { serviceRecord, icon } = props;

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ p: 3, pb: 0 }}>
			    <img src={icon} alt="emblem" height="48px" />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
                  <BreakdownTile title="Shots Fired" value={serviceRecord.shots.fired} isMainStat />
                  <BreakdownTile title="Accuracy" value={serviceRecord.shots.accuracy} isMainStat isPercent />
            </Box>
            <BreakdownTile title="Shots Landed" value={serviceRecord.shots.landed} total={serviceRecord.shots.fired} />
            <BreakdownTile title="Shots Missed" value={serviceRecord.shots.missed} total={serviceRecord.shots.fired} />
		</Box>
	);
}