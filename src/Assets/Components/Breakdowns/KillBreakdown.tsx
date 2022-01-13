import { Box } from "@mui/material";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { BreakdownTile } from "./BreakdownTile";

export function KillBreakdown(props: { serviceRecord: ServiceRecord })
{
	const { serviceRecord } = props;

      const total = serviceRecord.summary.kills - serviceRecord.breakdowns.kills.melee - serviceRecord.breakdowns.kills.grenades - serviceRecord.breakdowns.kills.headshots - serviceRecord.breakdowns.kills.powerWeapons;

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
                        <BreakdownTile title="Kills" value={serviceRecord.summary.kills} isMainStat />
                        <BreakdownTile title="Deaths" value={serviceRecord.summary.deaths} isMainStat />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "row", width: "95%", mb: 1,
				".MuiBox-root:first-child": { borderRadius: "8px 0 0 8px", mr: "1px" }, 
				".MuiBox-root:last-child": { borderRadius: "0 8px 8px 0", ml: "1px" },
				".MuiBox-root:not(:first-child):not(:last-child)": { ml: "1px", mr: "1px" }}}>
                        <BreakdownTile title="Melee" value={serviceRecord.breakdowns.kills.melee} total={total} />
                        <BreakdownTile title="Grenades" value={serviceRecord.breakdowns.kills.grenades} total={total} />
                        <BreakdownTile title="Headshots" value={serviceRecord.breakdowns.kills.headshots} total={total} />
                        <BreakdownTile title="Power Weapons" value={serviceRecord.breakdowns.kills.powerWeapons} total={total} />
                  </Box>
		</Box>
	);
}