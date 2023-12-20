import { Box, Typography } from "@mui/material";
import { SpartanCompany } from "../../../Objects/Model/SpartanCompany";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { BreakdownTile } from "../Breakdowns/BreakdownTile";
import { MatchRankTile, RankTile } from "./RankTile";
import { MatchRanksProps } from "./KDARanks";

export function KillRanks(props: { company: SpartanCompany, sharedSR: ServiceRecord, goToMember: Function, myGamertag?: string })
{
	const { company, sharedSR, goToMember, myGamertag } = props;

	return (
        <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <BreakdownTile title={`Kills / Game`} value={sharedSR.killsPerGame} isMainStat />
                </Box>
                {[...company.players]
                    .sort((a, b) => b.serviceRecord.killsPerGame - a.serviceRecord.killsPerGame)
                    .slice(0, 5)
                    .map((player) => <RankTile player={player} value={player.serviceRecord.killsPerGame} myGamertag={myGamertag} goToMember={goToMember} />)}
            </Box>
		</Box>
	);
}

export function KillMatchRanks(props: MatchRanksProps)
{
	const { players, myGamertag, goToMember } = props;

    const sliceCount = Math.min(8, players.length);

	return (
        <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", m: 3 }}>
                    <Typography variant="h5">Top Kills</Typography>
                </Box>
                {[...players]
                    .sort((a, b) => b.stats.summary.kills - a.stats.summary.kills)
                    .slice(0, sliceCount)
                    .map((player) => <MatchRankTile player={player} value={player.stats.summary.kills} myGamertag={myGamertag} goToMember={goToMember} />)}
            </Box>
		</Box>
	);
}