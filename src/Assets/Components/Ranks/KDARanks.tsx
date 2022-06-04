import { Box, Typography } from "@mui/material";
import { SpartanCompany } from "../../../Objects/Model/SpartanCompany";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { BreakdownTile } from "../Breakdowns/BreakdownTile";
import { MatchRankTile, RankTile } from "./RankTile";
import { MatchPlayer } from "../../../Objects/Pieces/MatchPlayer";

export function KDARanks(props: { company: SpartanCompany, sharedSR: ServiceRecord, goToMember: Function, myGamertag?: string })
{
	const { company, sharedSR, goToMember, myGamertag } = props;

	return (
        <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <BreakdownTile title={`KDA`} value={sharedSR.kda} isMainStat />
                </Box>
                {[...company.players]
                    .sort((a, b) => b.serviceRecord.kda - a.serviceRecord.kda)
                    .slice(0, 5)
                    .map((player) => <RankTile player={player} value={player.serviceRecord.kda} myGamertag={myGamertag} goToMember={goToMember} />)}
            </Box>
		</Box>
	);
}

export interface MatchRanksProps 
{
    players: MatchPlayer[];
    myGamertag?: string;
    goToMember: Function;
}

export function KDAMatchRanks(props: MatchRanksProps)
{
	const { players, myGamertag, goToMember } = props;

	return (
        <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", m: 3 }}>
                    <Typography variant="h5">Top KDA</Typography>
                </Box>
                {[...players]
                    .sort((a, b) => b.stats.kda - a.stats.kda)
                    .slice(0, 3)
                    .map((player) => <MatchRankTile player={player} value={player.stats.kda} myGamertag={myGamertag} goToMember={goToMember} />)}
            </Box>
		</Box>
	);
}