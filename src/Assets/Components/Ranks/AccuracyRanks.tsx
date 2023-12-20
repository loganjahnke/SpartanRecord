import { Box, Typography } from "@mui/material";
import { SpartanCompany } from "../../../Objects/Model/SpartanCompany";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { BreakdownTile } from "../Breakdowns/BreakdownTile";
import { MatchRankTile, RankTile } from "./RankTile";
import { MatchRanksProps } from "./KDARanks";

export function AccuracyRanks(props: { company: SpartanCompany, sharedSR: ServiceRecord, goToMember: Function, myGamertag?: string })
{
	const { company, sharedSR, goToMember, myGamertag } = props;

	return (
        <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <BreakdownTile title={`Accuracy`} value={sharedSR.shots.accuracy} isMainStat isPercent />
                </Box>
                {[...company.players]
                    .sort((a, b) => b.serviceRecord.shots.accuracy - a.serviceRecord.shots.accuracy)
                    .slice(0, 5)
                    .map((player) => <RankTile player={player} value={player.serviceRecord.shots.accuracy} myGamertag={myGamertag} goToMember={goToMember} isPercent />)}
            </Box>
		</Box>
	);
}

export function AccuracyMatchRanks(props: MatchRanksProps)
{
	const { players, myGamertag, goToMember } = props;

    const sliceCount = Math.min(8, players.length);

	return (
        <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", m: 3 }}>
                    <Typography variant="h5">Top Accuracy</Typography>
                </Box>
                {[...players]
                    .sort((a, b) => b.stats.shots.accuracy - a.stats.shots.accuracy)
                    .slice(0, sliceCount)
                    .map((player) => <MatchRankTile player={player} value={player.stats.shots.accuracy} myGamertag={myGamertag} goToMember={goToMember} isPercent />)}
            </Box>
		</Box>
	);
}