import { Typography } from "@mui/material";
import { Match } from "../../../Objects/Model/Match";

import "../../Styles/Components/MatchTitleCard.css";
import { PlayerMatch } from "../../../Objects/Model/PlayerMatch";

interface MatchTitleCardProps
{
	match?: Match | PlayerMatch;
}

export function MatchTitleCard(props: MatchTitleCardProps)
{
	const { match } = props;

	if (!match) { return <></>; }
	return <Typography className="matchTitleCardLabel" variant="h5">{(match as PlayerMatch)?.variant?.name ?? (match as Match)?.mode?.name} <span className="matchTitleCardOn">on</span> {match.map.name}</Typography>;
}