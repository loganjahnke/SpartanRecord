import { Box, Typography } from "@mui/material";
import { SpartanCompany } from "../../../Objects/Model/SpartanCompany";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { BreakdownTile } from "../Breakdowns/BreakdownTile";
import { MatchRankTile, RankTile } from "./RankTile";
import { MatchPlayer } from "../../../Objects/Pieces/MatchPlayer";
import { MatchRanksProps } from "./KDARanks";

export function DamageRanks(props: { company: SpartanCompany, sharedSR: ServiceRecord, goToMember: Function, myGamertag?: string })
{
	const { company, sharedSR, goToMember, myGamertag } = props;

	return (
        <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <BreakdownTile title={`Damage / Game`} value={sharedSR.damagePerGame} isMainStat />
                </Box>
                {[...company.players]
                    .sort((a, b) => b.serviceRecord.damagePerGame - a.serviceRecord.damagePerGame)
                    .slice(0, 5)
                    .map((player) => <RankTile player={player} value={player.serviceRecord.damagePerGame} myGamertag={myGamertag} goToMember={goToMember} />)}
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