import { Box, Typography } from "@mui/material";
import { Leader343RankTile, LeaderRankTile } from "./RankTile";
import { Leader } from "../../../Objects/Model/Leader";
import { Leaderboard343 } from "../../../Objects/Model/Leaderboard343";

export function LeaderRanks(props: { leaders: Leader[], goToMember: Function, myGamertag?: string, category: string, isPercent?: boolean })
{
	const { leaders, category, goToMember, myGamertag, isPercent } = props;

	return (
        <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", m: 3 }}>
                    <Typography variant="h5">{category}</Typography>
                </Box>
                {leaders
                    .map((leader, index) => <LeaderRankTile leader={leader} myGamertag={myGamertag} goToMember={goToMember} isPercent={isPercent} rank={index + 1} />)}
            </Box>
		</Box>
	);
}

export function CSRLeaderRanks(props: { leaderboard: Leaderboard343, playlistId?: string, goToMember: Function })
{
	const { leaderboard, playlistId, goToMember } = props;

	return (
        <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", m: 3 }}>
                    <Typography variant="h5">
                        {
                            playlistId === "edfef3ac-9cbe-4fa2-b949-8f29deafd483" ? "Ranked Arena Leaderboard" :
                            playlistId === "6233381c-fc96-40b9-b1ff-f6a4de72dd7a" ? "Ranked Snipers Leaderboard" :
                            playlistId === "dcb2e24e-05fb-4390-8076-32a0cdb4326e" ? "Ranked Slayer Leaderboard" :
                            playlistId === "57e417dd-7366-4dda-9bdd-2802151d5e81" ? "Ranked Tactical Slayer Leaderboard" :
                            "Ranked Doubles Leaderboard"
                        }                        
                    </Typography>
                </Box>
                {leaderboard.leaders.length === 0 && <Typography variant="h6" sx={{ mb: 2 }}>No leaders for this playlist this season.</Typography>}
                {leaderboard.leaders
                    .map((leader, index) => <Leader343RankTile leader={leader} goToMember={goToMember} rank={index + 1} />)}
            </Box>
		</Box>
	);
}