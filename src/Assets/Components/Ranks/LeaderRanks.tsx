import { Box, Typography } from "@mui/material";
import { LeaderRankTile } from "./RankTile";
import { Leader } from "../../../Objects/Model/Leader";

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