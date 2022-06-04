import { Box, Button, Card, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import { SpartanCompany } from "../../../Objects/Model/SpartanCompany";

import { Player } from "../../../Objects/Model/Player";
import { Halo5Converter } from "../../../Objects/Helpers/Halo5Converter";

import ArrowheadImg from "../../Images/arrowhead.png";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

import ClearIcon from '@mui/icons-material/Clear';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';

export function MemberList(props: { company: SpartanCompany, goToMember: (gamertag: string) => void, deleteMember: (gamertag: string) => void })
{
	const { company, goToMember, deleteMember } = props;

	return (
		<Card sx={{ borderRadius: 3 }}>
            <CardMedia component="img" height="200" image={"https://assets.halo.autocode.gg/static/infinite/images/multiplayer/playlists/ffa-slayer.jpg"} alt="Members" />
            <CardContent sx={{ backgroundColor: "divider", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
				<Typography variant="h6" sx={{ mb: 1 }}>Members</Typography>
				{company.players.map(player => <MemberComponent player={player} goToMember={goToMember} deleteMember={deleteMember} />)}
            </CardContent>
        </Card>
	);
}

function MemberComponent(props: { player: Player, goToMember: (gamertag: string) => void, deleteMember: (gamertag: string) => void })
{
	const { player, goToMember, deleteMember } = props;

	return (
		<Box sx={{ backgroundColor: "secondary.main", borderRadius: 3, display: "flex", flexDirection: "row", alignItems: "center", width: "90%", margin: 1, padding: 1 }}>
			<img src={player.appearance.emblemURL === "" ? ArrowheadImg : player.appearance.emblemURL} alt="emblem" width="48px" />
			<Box sx={{ ml: 1, flexGrow: 1, display: "flex", flexDirection: "column" }}>
				<Typography variant="body1">{player.gamertag}</Typography>
				<Typography variant="body2" sx={{ fontWeight: 100 }}>{Halo5Converter.GetLevelFromScore(player.serviceRecord.totalScore)}</Typography>
			</Box>
			<IconButton sx={{ color: ArrowheadTheme.text_primary }} onClick={() => goToMember(player.gamertag)}><ModeStandbyIcon /></IconButton>
			<IconButton sx={{ color: ArrowheadTheme.text_primary }} onClick={() => deleteMember(player.gamertag)}><ClearIcon /></IconButton>
		</Box>
	);
}