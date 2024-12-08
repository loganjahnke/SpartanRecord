import { Box, Typography } from "@mui/material";
import { Medal } from "../../../Objects/Pieces/Medal";
import { TitleCard } from "../Cards/TitleCard";
import { MedalTile } from "./MedalTile";
import { OpacityBox } from "../Animations/OpacityBox";

interface TopMedalsProps
{
	medals: Medal[];
	matchesPlayed?: number;
	showPerMatch?: boolean;
	animate?: boolean;
}

export function TopMedals(props: TopMedalsProps)
{
    return (
        <TitleCard title="Top Medals" stretch>
			<TopMedalsInner {...props} />
		</TitleCard>
    );
}

export function TopMedalsInner(props: TopMedalsProps)
{
    const { medals, matchesPlayed, showPerMatch, animate } = props;

    const topMedals = medals.sort((a, b) => a.count < b.count ? 1 : -1).slice(0, Math.min(medals.length, 3));

    return (
		<Box sx={{ 
			display: "flex", 
			flexDirection: "column", 
			justifyContent: "center", 
			alignItems: "center", 
			textAlign: "left",
			clear: "both" }}>
			<Box sx={{width: "100%" }}>
				{topMedals.length > 0 
					? topMedals.map((medal, index) => {
						const medalComponent = <MedalTile medal={medal} matchesPlayed={showPerMatch ? matchesPlayed : undefined} />;
						if (animate) { return <OpacityBox delay={((index + 1) * 350) + "ms"} content={medalComponent} ignoreBoxStyling />; }
						return medalComponent;
					}) 
					: <Typography variant="body1" sx={{ mt: 4, mb: 4, width: "100%", textAlign: "center" }}>No medals earned.</Typography>}
			</Box>
		</Box>
    );
}