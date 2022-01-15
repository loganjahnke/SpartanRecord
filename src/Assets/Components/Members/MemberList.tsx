import { Box, Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { SpartanCompany } from "../../../Objects/Model/SpartanCompany";

import { Player } from "../../../Objects/Model/Player";
import { Halo5Converter } from "../../../Objects/Helpers/Halo5Converter";

import ArrowheadImg from "../../Images/arrowhead.png";

export function MemberList(props: { company: SpartanCompany, goToMember: Function, setPlayer: Function })
{
	const { company, goToMember, setPlayer } = props;

	return (
		<Card sx={{ borderRadius: 3 }}>
            <CardMedia component="img" height="200" image={"https://assets.halo.autocode.gg/static/infinite/images/multiplayer/playlists/ffa-slayer.jpg"} alt="Members" />
            <CardContent sx={{ backgroundColor: "divider", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
				<Typography variant="h6" sx={{ mb: 1 }}>{company.name} Company</Typography>
				{company.players.map(player => <MemberComponent player={player} goToMember={goToMember} setPlayer={setPlayer} />)}
            </CardContent>
        </Card>
	);
}

function MemberComponent(props: { player: Player, goToMember: Function, setPlayer: Function })
{
	const { player, goToMember, setPlayer } = props;

	function setPlayerClick(): void
	{
		setPlayer(player);
		goToMember(player.gamertag);
	}

	return (
		<Box sx={{ backgroundColor: "secondary.main", borderRadius: 3, display: "flex", flexDirection: "row", alignItems: "center", width: "90%", margin: 1, padding: 1 }}>
			<Button onClick={setPlayerClick} sx={{ width: "100%", justifyContent: "flex-start", borderRadius: 2, textTransform: "none", textAlign: "left" }}>
				<img src={player.appearance.emblemURL === "" ? ArrowheadImg : player.appearance.emblemURL} alt="emblem" height="48px" />
				<Box sx={{ ml: 1, flexGrow: 1, display: "flex", flexDirection: "column" }}>
					<Typography variant="body1">{player.gamertag}</Typography>
					<Typography variant="body2" sx={{ fontWeight: 100 }}>{Halo5Converter.GetLevelFromScore(player.serviceRecord.totalScore)}</Typography>
				</Box>
			</Button>
		</Box>
	);
}