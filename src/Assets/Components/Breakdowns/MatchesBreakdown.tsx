import { Box } from "@mui/material";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { BreakdownTile } from "./BreakdownTile";

export function MatchesBreakdown(props: { serviceRecord: ServiceRecord, icon: string })
{
	const { serviceRecord, icon } = props;

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
			<Box sx={{ p: 3, pb: 0 }}>
				<img src={icon} alt="emblem" height="48px" />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Matches Played" value={serviceRecord.matchesPlayed} isMainStat />
				<BreakdownTile title="Win Rate" value={serviceRecord.winRate} isMainStat isPercent />
			</Box>
			<BreakdownTile title="Wins" value={serviceRecord.breakdowns.matches.wins} total={serviceRecord.matchesPlayed} />
			<BreakdownTile title="Losses" value={serviceRecord.breakdowns.matches.losses} total={serviceRecord.matchesPlayed} />
			<BreakdownTile title="Draws" value={serviceRecord.breakdowns.matches.draws} total={serviceRecord.matchesPlayed} />
			<BreakdownTile title="Left Early" value={serviceRecord.breakdowns.matches.left} total={serviceRecord.matchesPlayed} />
		</Box>
	);
}