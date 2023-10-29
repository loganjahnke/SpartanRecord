import { Box } from "@mui/material";
import { BreakdownProps, BreakdownTile } from "../BreakdownTile";
import { ArrowheadTheme } from "../../../Theme/ArrowheadTheme";

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
				<BreakdownTile title="Elimination Assists" value={showPerMatch ? serviceRecord.elimination.eliminationAssists / serviceRecord.matchesPlayed : serviceRecord.elimination.eliminationAssists} small isMainStat backgroundColor={ArrowheadTheme.box}  />
				<BreakdownTile title="Allies Revived" value={showPerMatch ? serviceRecord.elimination.alliesRevived / serviceRecord.matchesPlayed : serviceRecord.elimination.alliesRevived} small isMainStat backgroundColor={ArrowheadTheme.box}  />
				<BreakdownTile title="Enemy Revives Denied" value={showPerMatch ? serviceRecord.elimination.enemyRevivesDenied / serviceRecord.matchesPlayed : serviceRecord.elimination.enemyRevivesDenied} small isMainStat backgroundColor={ArrowheadTheme.box}  />
				<BreakdownTile title="Kills as Last Player" value={showPerMatch ? serviceRecord.elimination.killsAsLastPlayerStanding / serviceRecord.matchesPlayed : serviceRecord.elimination.killsAsLastPlayerStanding} small isMainStat backgroundColor={ArrowheadTheme.box}  />
				<BreakdownTile title="Last Player Kills" value={showPerMatch ? serviceRecord.elimination.lastPlayersStandingKilled / serviceRecord.matchesPlayed : serviceRecord.elimination.lastPlayersStandingKilled} small isMainStat backgroundColor={ArrowheadTheme.box}  />
				<BreakdownTile title="Times Revived by Ally" value={showPerMatch ? serviceRecord.elimination.timesRevivedByAlly / serviceRecord.matchesPlayed : serviceRecord.elimination.timesRevivedByAlly} small isMainStat backgroundColor={ArrowheadTheme.box}  />
				<BreakdownTile title="Rounds Survived" value={showPerMatch ? serviceRecord.elimination.roundsSurvived / serviceRecord.matchesPlayed : serviceRecord.elimination.roundsSurvived} small isMainStat backgroundColor={ArrowheadTheme.box}  />
			</Box>
		</>
	);
}