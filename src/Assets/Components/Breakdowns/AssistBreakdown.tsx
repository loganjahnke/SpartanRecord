import { Box } from "@mui/material";
import { TitleCard } from "../Cards/TitleCard";
import { BreakdownProps, BreakdownTile } from "./BreakdownTile";

export function AssistBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	let wingmanCount = 0;
	const wingmanMedal = serviceRecord.medals.filter(medal => medal.id === 1284032216);
	if (wingmanMedal.length === 1)
	{
		wingmanCount = wingmanMedal[0].count;
	}

	return (
		<TitleCard title="Assists">
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Assists" value={showPerMatch ? serviceRecord.summary.assists / serviceRecord.matchesPlayed : serviceRecord.summary.assists} isMainStat tooltip="Total assists" />
				<BreakdownTile title="Wingman" value={showPerMatch ? wingmanCount / serviceRecord.matchesPlayed : wingmanCount} isMainStat tooltip="Games with 10+ assists" />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="EMP" value={showPerMatch ? serviceRecord.breakdowns.assists.emp / serviceRecord.matchesPlayed : serviceRecord.breakdowns.assists.emp} isMainStat tooltip="EMP assists" />
				<BreakdownTile title="Driver" value={showPerMatch ? serviceRecord.breakdowns.assists.driver / serviceRecord.matchesPlayed : serviceRecord.breakdowns.assists.driver} isMainStat tooltip="Assists earned as the driver of a vehicle" />
				<BreakdownTile title="Callouts" value={showPerMatch ? serviceRecord.breakdowns.assists.callouts / serviceRecord.matchesPlayed : serviceRecord.breakdowns.assists.callouts} isMainStat tooltip="Callout assists" />
			</Box>
		</TitleCard>
	);
}