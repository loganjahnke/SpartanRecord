import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Match } from "../../../Objects/Model/Match";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

interface MatchSummaryProps
{
	match: Match;
	goToMatch: Function;
}

export function MatchSummary(props: MatchSummaryProps)
{
	const { match, goToMatch } = props;

	function onCardAreaClick()
	{
		// goToMatch(match.id);
	}

	return (
		<Grid item xs={12} md={4} lg={3}>
			<Card>
				<CardActionArea onClick={onCardAreaClick}>
					<CardMedia component="img" height="200" image={match.map.asset.thumbnail} alt={match.map.name} />
					<CardContent>
						<Typography gutterBottom variant="h5" component="div" sx={{ textAlign: "center" }}>{match.mode.name}</Typography>
						<Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
							<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
								<Typography variant="caption">Result</Typography>
								<Typography variant="body1" sx={{ color: match.player.outcome === "win" ? ArrowheadTheme.good : match.player.outcome === "loss" ? ArrowheadTheme.bad : ArrowheadTheme.text_primary }}>
									{match.player.outcome === "win" 
										? "Win"
										: match.player.outcome === "loss" 
										? "Loss"
										: match.player.outcome === "draw"
										? "Tie"
										: "Left Early" 
									}
								</Typography>
							</Box>
							<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
								<Typography variant="caption">Kills</Typography>
								<Typography variant="body1">{match.player.stats.summary.kills}</Typography>
							</Box>
							<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
								<Typography variant="caption">Deaths</Typography>
								<Typography variant="body1">{match.player.stats.summary.deaths}</Typography>
							</Box>
						</Box>
					</CardContent>
				</CardActionArea>
			</Card>
		</Grid>
	);
}