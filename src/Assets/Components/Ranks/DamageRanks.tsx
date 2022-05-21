import { Box, Typography } from "@mui/material";
import { SpartanCompany } from "../../../Objects/Model/SpartanCompany";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { BreakdownTile } from "../Breakdowns/BreakdownTile";
import { MatchRankTile, RankTile } from "./RankTile";
import { MatchPlayer } from "../../../Objects/Pieces/MatchPlayer";
import { MatchRanksProps } from "./KDARanks";

export function DamageRanks(props: { company: SpartanCompany, sharedSR: ServiceRecord, goToMember: Function })
{
	const { company, sharedSR, goToMember } = props;

	return (
        <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <BreakdownTile title={`${company.name} Damage`} value={sharedSR.damage.dealt} isMainStat />
                </Box>
                {[...company.players]
                    .sort((a, b) => b.serviceRecord.damage.dealt - a.serviceRecord.damage.dealt)
                    .slice(0, 3)
                    .map((player, index) => <RankTile player={player} value={player.serviceRecord.damage.dealt} rank={index + 1} goToMember={goToMember} />)}
            </Box>
		</Box>
	);
}

export function DamageMatchRanks(props: MatchRanksProps)
{
	const { players, myGamertag, goToMember } = props;

	return (
        <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", m: 3 }}>
                    <Typography variant="h5">Top Damage</Typography>
                </Box>
                {[...players]
                    .sort((a, b) => b.stats.damage.dealt - a.stats.damage.dealt)
                    .slice(0, 3)
                    .map((player) => <MatchRankTile player={player} value={player.stats.damage.dealt} myGamertag={myGamertag} goToMember={goToMember} />)}
            </Box>
		</Box>
	);
}