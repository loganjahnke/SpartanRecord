import { Box, Tooltip, Typography } from "@mui/material";
import { Halo5Converter } from "../../../Objects/Helpers/Halo5Converter";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { TitleCard } from "../Cards/TitleCard";
import { BorderLinearProgress } from "../Custom/BorderLinearProgress";
import { BreakdownProps, BreakdownTile } from "./BreakdownTile";

export function LevelBreakdown(props: BreakdownProps)
{
	const { serviceRecord, showPerMatch } = props;

	const currLvl = Halo5Converter.GetNumericLevelFromScore(serviceRecord.totalScore);
	const nextLvl = Halo5Converter.GetNumericLevelFromScore(serviceRecord.totalScore) + 1;
	const currXP = Halo5Converter.GetScoreNeededForLevel(currLvl);
	const nextXP = Halo5Converter.GetScoreNeededForLevel(nextLvl);
	const progress = (serviceRecord.totalScore - currXP) * 100 / (nextXP - currXP);
	const xpNeeded = nextXP - serviceRecord.totalScore;

	return (
		<TitleCard title="Spartan Rank">
            <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-evenly", width: "100%" }}>
                <BreakdownTile title="Total Score" value={showPerMatch ? serviceRecord.totalScore / serviceRecord.matchesPlayed : serviceRecord.totalScore} isMainStat />
                <BreakdownTile title="Spartan Rank" value={Halo5Converter.GetLevelFromScore(serviceRecord.totalScore)} isMainStat />
            </Box>
			<Box sx={{ display: "flex", flexDirection: "row", width: "90%", alignItems: "center", m: 1, mt: 0 }}>
				<Typography variant="caption" sx={{ flexBasis: "12.5%", textAlign: "center" }}>{`SR${currLvl}`}</Typography>
				<Tooltip title={`${xpNeeded.toLocaleString()} XP needed for next level`}>
					<BorderLinearProgress variant="determinate" value={progress} sx={{ flexBasis: "75%", m: 1, "> .MuiLinearProgress-bar": { backgroundColor: ArrowheadTheme.good } }} />
				</Tooltip>
				<Typography variant="caption" sx={{ flexBasis: "12.5%", textAlign: "center" }}>{`SR${nextLvl}`}</Typography>
			</Box>
		</TitleCard>
	);
}