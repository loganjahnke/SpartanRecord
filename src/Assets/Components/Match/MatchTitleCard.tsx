import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import { Match } from "../../../Objects/Model/Match";

import "../../Styles/Components/MatchTitleCard.css";

interface MatchTitleCardProps
{
	match?: Match;
}

export function MatchTitleCard(props: MatchTitleCardProps)
{
	const { match } = props;

	if (!match) { return <></>; }
	return (
		<>
			<Grid item sm={0} md={3} xl={3} />
			<Grid item xs={12} md={6} xl={6}>
				<Card sx={{ height: "100%", borderRadius: 3 }}>
					{match.map.asset.thumbnail && <CardMedia sx={{ backgroundPosition: "center" }} component="img" image={match.map.asset.thumbnail} alt="card media" />}
					<CardContent className="matchTitleCardContent">
						<Typography className="matchTitleCardLabel" variant="h5">{match.mode.name} <span className="matchTitleCardOn">on</span> {match.map.name}</Typography>
					</CardContent>
				</Card>
			</Grid>
			<Grid item sm={0} md={3} xl={3} />
		</>
	);
}