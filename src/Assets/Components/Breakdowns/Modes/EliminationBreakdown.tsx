import { Box } from "@mui/material";
import { BreakdownRowTile } from "../BreakdownRowTile";
import { BreakdownProps, BreakdownTile } from "../BreakdownTile";

export function EliminationBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	return (
		<>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Eliminations" value={showPerMatch ? serviceRecord.elimination.eliminations / serviceRecord.matchesPlayed : serviceRecord.elimination.eliminations} isMainStat />
				<BreakdownTile title="Executions" value={showPerMatch ? serviceRecord.elimination.executions / serviceRecord.matchesPlayed : serviceRecord.elimination.executions} isMainStat />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownRowTile title="Elimination Assists" value={showPerMatch ? serviceRecord.elimination.eliminationAssists / serviceRecord.matchesPlayed : serviceRecord.elimination.eliminationAssists} isMainStat  />
				<BreakdownRowTile title="Allies Revived" value={showPerMatch ? serviceRecord.elimination.alliesRevived / serviceRecord.matchesPlayed : serviceRecord.elimination.alliesRevived} isMainStat  />
				<BreakdownRowTile title="Enemy Revives Denied" value={showPerMatch ? serviceRecord.elimination.enemyRevivesDenied / serviceRecord.matchesPlayed : serviceRecord.elimination.enemyRevivesDenied} isMainStat  />
				<BreakdownRowTile title="Kills as Last Player" value={showPerMatch ? serviceRecord.elimination.killsAsLastPlayerStanding / serviceRecord.matchesPlayed : serviceRecord.elimination.killsAsLastPlayerStanding} isMainStat  />
				<BreakdownRowTile title="Last Player Kills" value={showPerMatch ? serviceRecord.elimination.lastPlayersStandingKilled / serviceRecord.matchesPlayed : serviceRecord.elimination.lastPlayersStandingKilled} isMainStat  />
				<BreakdownRowTile title="Times Revived by Ally" value={showPerMatch ? serviceRecord.elimination.timesRevivedByAlly / serviceRecord.matchesPlayed : serviceRecord.elimination.timesRevivedByAlly} isMainStat  />
				<BreakdownRowTile title="Rounds Survived" value={showPerMatch ? serviceRecord.elimination.roundsSurvived / serviceRecord.matchesPlayed : serviceRecord.elimination.roundsSurvived} isMainStat  />
			</Box>
		</>
	);
}