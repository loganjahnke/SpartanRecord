import { Box } from "@mui/material";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { TitleCard } from "../Cards/TitleCard";
import { BreakdownProps, BreakdownTile } from "./BreakdownTile";

export function KillDeathCard(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	return (
		<TitleCard title="Kills & Deaths">
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Kill Death Spread" value={(serviceRecord.summary.kills - serviceRecord.summary.deaths > 0 ? "+" : "") + (showPerMatch ? (serviceRecord.summary.kills - serviceRecord.summary.deaths) / serviceRecord.matchesPlayed : (serviceRecord.summary.kills - serviceRecord.summary.deaths)).toLocaleString()} isMainStat />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", width: "95%", mb: 1,
				".MuiBox-root:first-child": { borderRadius: "8px 0 0 8px", mr: "1px" }, 
				".MuiBox-root:last-child": { borderRadius: "0 8px 8px 0", ml: "1px" },
				".MuiBox-root:not(:first-child):not(:last-child)": { ml: "1px", mr: "1px" } }}>
				<BreakdownTile title="Kills" backgroundColor={ArrowheadTheme.good} value={showPerMatch ? serviceRecord.summary.kills / serviceRecord.matchesPlayed : serviceRecord.summary.kills} total={showPerMatch ? (serviceRecord.summary.kills + serviceRecord.summary.deaths) / serviceRecord.matchesPlayed : serviceRecord.summary.kills + serviceRecord.summary.deaths} />
				<BreakdownTile title="Deaths" backgroundColor={ArrowheadTheme.bad} value={showPerMatch ? serviceRecord.summary.deaths / serviceRecord.matchesPlayed : serviceRecord.summary.deaths} total={showPerMatch ? (serviceRecord.summary.kills + serviceRecord.summary.deaths) / serviceRecord.matchesPlayed : serviceRecord.summary.kills + serviceRecord.summary.deaths} />
			</Box>
		</TitleCard>
	);
}