import { Box } from "@mui/material";
import { BreakdownProps, BreakdownTile } from "../BreakdownTile";
import { ArrowheadTheme } from "../../../Theme/ArrowheadTheme";

export function FirefightBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	return (
		<>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Bosses Killed" value={showPerMatch ? serviceRecord.firefight.boss_kills / serviceRecord.matchesPlayed : serviceRecord.firefight.boss_kills} isMainStat />
			</Box>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
				<BreakdownTile title="Brutes Killed" value={showPerMatch ? serviceRecord.firefight.brute_kills / serviceRecord.matchesPlayed : serviceRecord.firefight.brute_kills} small isMainStat backgroundColor={ArrowheadTheme.box} />
				<BreakdownTile title="Elites Killed" value={showPerMatch ? serviceRecord.firefight.elite_kills / serviceRecord.matchesPlayed : serviceRecord.firefight.elite_kills} small isMainStat backgroundColor={ArrowheadTheme.box} />
				<BreakdownTile title="Grunts Killed" value={showPerMatch ? serviceRecord.firefight.grunt_kills / serviceRecord.matchesPlayed : serviceRecord.firefight.grunt_kills} small isMainStat backgroundColor={ArrowheadTheme.box} />
				<BreakdownTile title="Hunters Killed" value={showPerMatch ? serviceRecord.firefight.hunter_kills / serviceRecord.matchesPlayed : serviceRecord.firefight.hunter_kills} small isMainStat backgroundColor={ArrowheadTheme.box} />
				<BreakdownTile title="Jackals Killed" value={showPerMatch ? serviceRecord.firefight.jackal_kills / serviceRecord.matchesPlayed : serviceRecord.firefight.jackal_kills} small isMainStat backgroundColor={ArrowheadTheme.box} />
				<BreakdownTile title="Marines Killed" value={showPerMatch ? serviceRecord.firefight.marine_kills / serviceRecord.matchesPlayed : serviceRecord.firefight.marine_kills} small isMainStat backgroundColor={ArrowheadTheme.box} />
				<BreakdownTile title="Sentinels Killed" value={showPerMatch ? serviceRecord.firefight.sentinel_kills / serviceRecord.matchesPlayed : serviceRecord.firefight.sentinel_kills} small isMainStat backgroundColor={ArrowheadTheme.box} />
				<BreakdownTile title="Skimmers Killed" value={showPerMatch ? serviceRecord.firefight.skimmer_kills / serviceRecord.matchesPlayed : serviceRecord.firefight.skimmer_kills} small isMainStat backgroundColor={ArrowheadTheme.box} />
			</Box>
		</>
	);
}