import { Box } from "@mui/material";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { BreakdownTile } from "./BreakdownTile";

export function AssistBreakdown(props: { serviceRecord: ServiceRecord })
{
	const { serviceRecord } = props;

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Assists" value={serviceRecord.summary.assists} isMainStat />
				<BreakdownTile title="EMP" value={serviceRecord.breakdowns.assists.emp} isMainStat />
				<BreakdownTile title="Driver" value={serviceRecord.breakdowns.assists.driver} isMainStat />
				<BreakdownTile title="Callouts" value={serviceRecord.breakdowns.assists.callouts} isMainStat />
			</Box>
		</Box>
	);
}