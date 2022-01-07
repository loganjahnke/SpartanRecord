import { Box } from "@mui/material";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { BreakdownTile } from "./BreakdownTile";

export function AssistBreakdown(props: { serviceRecord: ServiceRecord, icon: string })
{
	const { serviceRecord, icon } = props;

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
			<Box sx={{ p: 3, pb: 0 }}>
				<img src={icon} alt="emblem" height="48px" />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Assists" value={serviceRecord.summary.assists} isMainStat />
			</Box>
			<BreakdownTile title="EMP" value={serviceRecord.breakdowns.assists.emp} total={serviceRecord.summary.assists} />
			<BreakdownTile title="Driver" value={serviceRecord.breakdowns.assists.driver} total={serviceRecord.summary.assists} />
			<BreakdownTile title="Callouts" value={serviceRecord.breakdowns.assists.callouts} total={serviceRecord.summary.assists} />
		</Box>
	);
}