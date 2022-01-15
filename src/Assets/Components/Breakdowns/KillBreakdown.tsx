import { Box } from "@mui/material";
import { BreakdownProps, BreakdownTile } from "./BreakdownTile";

export function KillBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

      const total = (showPerMatch ? serviceRecord.breakdowns.kills.melee / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.melee) +
            (showPerMatch ? serviceRecord.breakdowns.kills.grenades / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.grenades) +
            (showPerMatch ? serviceRecord.breakdowns.kills.headshots / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.headshots) +
            (showPerMatch ? serviceRecord.breakdowns.kills.powerWeapons / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.powerWeapons);

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
                        <BreakdownTile title="Kills" value={showPerMatch ? serviceRecord.summary.kills / serviceRecord.matchesPlayed : serviceRecord.summary.kills} isMainStat />
                        <BreakdownTile title="Deaths" value={showPerMatch ? serviceRecord.summary.deaths / serviceRecord.matchesPlayed : serviceRecord.summary.deaths} isMainStat />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "row", width: "95%", mb: 1,
				".MuiBox-root:first-child": { borderRadius: "8px 0 0 8px", mr: "1px" }, 
				".MuiBox-root:last-child": { borderRadius: "0 8px 8px 0", ml: "1px" },
				".MuiBox-root:not(:first-child):not(:last-child)": { ml: "1px", mr: "1px" }}}>
                        <BreakdownTile title="Melee" value={showPerMatch ? serviceRecord.breakdowns.kills.melee / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.melee} total={total} />
                        <BreakdownTile title="Grenades" value={showPerMatch ? serviceRecord.breakdowns.kills.grenades / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.grenades} total={total} />
                        <BreakdownTile title="Headshots" value={showPerMatch ? serviceRecord.breakdowns.kills.headshots / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.headshots} total={total} />
                        <BreakdownTile title="Power Weapons" value={showPerMatch ? serviceRecord.breakdowns.kills.powerWeapons / serviceRecord.matchesPlayed : serviceRecord.breakdowns.kills.powerWeapons} total={total} />
                  </Box>
		</Box>
	);
}