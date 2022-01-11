import { Box } from "@mui/material";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { BreakdownTile } from "./BreakdownTile";

export function DamageBreakdown(props: { serviceRecord: ServiceRecord })
{
	const { serviceRecord } = props;

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%"}}>
                        <BreakdownTile title="Damage Dealt" value={serviceRecord.damage.dealt} isMainStat />
                        <BreakdownTile title="Damage Taken" value={serviceRecord.damage.taken} isMainStat />
                  </Box>
		</Box>
	);
}