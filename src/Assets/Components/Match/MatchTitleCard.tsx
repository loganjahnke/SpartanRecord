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
	return <Typography className="matchTitleCardLabel" variant="h5">{match.mode.name} <span className="matchTitleCardOn">on</span> {match.map.name}</Typography>;
}