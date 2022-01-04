import { Box, Typography } from "@mui/material";
import { Company } from "../../Objects/Model/Company";

import GroupsIcon from '@mui/icons-material/Groups';
import { Player } from "../../Objects/Model/Player";
import { Halo5Converter } from "../../Objects/Helpers/Halo5Converter";

import ArrowheadImg from "../Images/arrowhead.png";

export function MemberList(props: { company: Company })
{
	const { company } = props;

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
			<GroupsIcon sx={{ fontSize: "160px", padding: 2 }} />
			{company.players.map(player => <MemberComponent player={player} />)}
		</Box>
	);
}

function MemberComponent(props: { player: Player })
{
	const { player } = props;

	return (
		<Box sx={{ backgroundColor: "secondary.main", borderRadius: 3, display: "flex", flexDirection: "row", alignItems: "center", width: "90%", margin: 1, padding: 1 }}>
			<img src={player.appearance.emblemURL === "" ? ArrowheadImg : player.appearance.emblemURL} alt="emblem" height="48px" />
			<Box sx={{ ml: 1, display: "flex", flexDirection: "column" }}>
				<Typography variant="body1">{player.gamertag}</Typography>
				<Typography variant="body2" sx={{ fontWeight: 100 }}>{Halo5Converter.GetLevelFromScore(player.serviceRecord.totalScore)}</Typography>
			</Box>
		</Box>
	);
}