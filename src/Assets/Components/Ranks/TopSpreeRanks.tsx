import { Box, Typography } from "@mui/material";
import { SpartanCompany } from "../../../Objects/Model/SpartanCompany";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { BreakdownTile } from "../Breakdowns/BreakdownTile";
import { MatchRankTile, RankTile } from "./RankTile";
import { MatchRanksProps } from "./KDARanks";

export function TopSpreeRanks(props: MatchRanksProps)
{
	const { players, myGamertag, goToMember } = props;

	return (
        <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", m: 3 }}>
                    <Typography variant="h5">Top Spree</Typography>
                </Box>
                {[...players]
                    .sort((a, b) => (b.stats.summary.maxKillingSpree ?? 0) - (a.stats.summary.maxKillingSpree ?? 0))
                    .slice(0, 3)
                    .map((player) => <MatchRankTile player={player} value={(player.stats.summary.maxKillingSpree ?? 0)} myGamertag={myGamertag} goToMember={goToMember} isSpree />)}
            </Box>
		</Box>
	);
}