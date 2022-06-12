import { Box, Typography } from "@mui/material";
import { Medal } from "../../../Objects/Pieces/Medal";
import { TitleCard } from "../Cards/TitleCard";
import { MedalTile } from "./MedalTile";

export function TopMedals(props: { medals: Medal[], matchesPlayed?: number, showPerMatch?: boolean })
{
    const { medals, matchesPlayed, showPerMatch } = props;

    const topMedals = medals.sort((a, b) => a.count < b.count ? 1 : -1).slice(0, Math.min(medals.length, 3));

    return (
        <TitleCard title="Top Medals" stretch>
			<Box sx={{ 
				display: "flex", 
				flexDirection: "column", 
				justifyContent: "center", 
				alignItems: "center", 
				clear: "both" }}>
				<Box sx={{width: "100%" }}>
					{topMedals.length > 0 
						? topMedals.map(medal => <MedalTile medal={medal} matchesPlayed={showPerMatch ? matchesPlayed : undefined} />) 
						: <Typography variant="body1" sx={{ mt: 4, mb: 4, width: "100%", textAlign: "center" }}>No medals earned.</Typography>}
				</Box>
			</Box>
		</TitleCard>
    );
}