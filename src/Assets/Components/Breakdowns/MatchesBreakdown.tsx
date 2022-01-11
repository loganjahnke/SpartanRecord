import { Box } from "@mui/material";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { BreakdownPosition, BreakdownTile } from "./BreakdownTile";

export function MatchesBreakdown(props: { serviceRecord: ServiceRecord })
{
	const { serviceRecord } = props;

	const total = serviceRecord.matchesPlayed - serviceRecord.breakdowns.matches.left - serviceRecord.breakdowns.matches.draws;

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Matches Played" value={serviceRecord.matchesPlayed} isMainStat />
				<BreakdownTile title="Win Rate" value={serviceRecord.winRate} isMainStat isPercent />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", width: "95%", mb: 1,
				".MuiBox-root:first-child": { borderRadius: "8px 0 0 8px", mr: "1px" }, 
				".MuiBox-root:last-child": { borderRadius: "0 8px 8px 0", ml: "1px" },
				".MuiBox-root:not(:first-child):not(:last-child)": { ml: "1px", mr: "1px" } }}>
				<BreakdownTile title="Wins" value={serviceRecord.breakdowns.matches.wins} total={total} backgroundColor={ArrowheadTheme.good} />
				<BreakdownTile title="Losses" value={serviceRecord.breakdowns.matches.losses} total={total} backgroundColor={ArrowheadTheme.bad} />
			</Box>
		</Box>
	);
}