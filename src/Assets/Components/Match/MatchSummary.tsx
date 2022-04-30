import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Match } from "../../../Objects/Model/Match";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

interface MatchSummaryProps
{
	match: Match;
	category: string;
	goToMatch: Function;
	value: number;
}

export function MatchSummary(props: MatchSummaryProps)
{
	const { match, goToMatch, category, value } = props;

	function onCardAreaClick()
	{
		goToMatch(match.id);
	}

	return (
		<Grid item xs={12} md={4} lg={3}>
			<Card>
				<CardActionArea onClick={onCardAreaClick}>
					<CardMedia component="img" height="200" image={match.map.asset.thumbnail} alt={match.map.name} />
					<CardContent>
						<Typography gutterBottom variant="h5" component="div" sx={{ textAlign: "center" }}>{match.playlist.name}</Typography>
						<Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
							<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
								<Typography variant="caption">{category}</Typography>
								<Typography variant="body1">{value.toLocaleString()}</Typography>
							</Box>
						</Box>
						<Typography variant="body1" component="div" sx={{ mt: 2, mb: -1.5, textAlign: "center", color: "#666", fontSize: "0.6rem" }}>{match.date.toLocaleString()}</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		</Grid>
	);
}