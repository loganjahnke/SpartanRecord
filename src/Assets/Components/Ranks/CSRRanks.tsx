import { Box, Typography } from "@mui/material";
import { MatchRankTile } from "./RankTile";
import { MatchPlayer } from "../../../Objects/Pieces/MatchPlayer";

export interface MatchRanksProps 
{
    players: MatchPlayer[];
    myGamertag?: string;
    goToMember: Function;
}

export function CSRMatchRanks(props: MatchRanksProps)
{
	const { players, myGamertag, goToMember } = props;

	const sliceCount = Math.min(8, players.length);

	return (
        <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", m: 3 }}>
                    <Typography variant="h5">Top CSR</Typography>
                </Box>
                {[...players]
                    .sort((a, b) => b.csr.post.value - a.csr.post.value)
                    .slice(0, sliceCount)
                    .map((player) => <MatchRankTile player={player} value={player.csr.post.value} myGamertag={myGamertag} goToMember={goToMember} isCSR />)}
            </Box>
		</Box>
	);
}