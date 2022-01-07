import { Box } from "@mui/material";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { BreakdownTile } from "./BreakdownTile";

export function KillBreakdown(props: { serviceRecord: ServiceRecord, icon: string })
{
	const { serviceRecord, icon } = props;

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <Box sx={{ p: 3, pb: 0 }}>
                        <img src={icon} alt="emblem" height="48px" />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
                        <BreakdownTile title="Kills" value={serviceRecord.summary.kills} isMainStat />
                        <BreakdownTile title="Deaths" value={serviceRecord.summary.deaths} isMainStat />
                  </Box>
                  <BreakdownTile title="Melee" value={serviceRecord.breakdowns.kills.melee} total={serviceRecord.summary.kills} />
                  <BreakdownTile title="Grenades" value={serviceRecord.breakdowns.kills.grenades} total={serviceRecord.summary.kills} />
                  <BreakdownTile title="Headshots" value={serviceRecord.breakdowns.kills.headshots} total={serviceRecord.summary.kills} />
                  <BreakdownTile title="Power Weapons" value={serviceRecord.breakdowns.kills.powerWeapons} total={serviceRecord.summary.kills} />
		</Box>
	);
}