import { Box, Button, Typography } from "@mui/material";
import { GetColorForTeam } from "../../../Objects/Helpers/AllTeams";
import { Player } from "../../../Objects/Model/Player";
import { MatchPlayer } from "../../../Objects/Pieces/MatchPlayer";

import ArrowheadImg from "../../Images/arrowhead.png";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

export function RankTile(props: { player: Player, myGamertag?: string, value: number, isPercent?: boolean, goToMember: Function })
{
	const { player, value, myGamertag, isPercent, goToMember } = props;

	return (
		<Box sx={{ backgroundColor: "secondary.main", borderRadius: 3, display: "flex", flexDirection: "row", alignItems: "center", width: "90%", margin: 1, padding: 0, height: "48px" }}>
			<Button onClick={() => goToMember(player.gamertag)} sx={{ width: "100%", height: "100%", justifyContent: "flex-start", p: 0, borderRadius: 2, textTransform: "none", textAlign: "left", backgroundColor: myGamertag === player.gamertag ? ArrowheadTheme.good : "" }}>
				<img src={player.appearance.emblemURL === "" ? ArrowheadImg : player.appearance.emblemURL} alt="emblem" width="48px" />
				<Box sx={{ ml: 1, display: "flex", flexDirection: "column", fontSize: "0.8rem" }}>
					<Typography variant="h6">{player.gamertag}</Typography>
				</Box>
                <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "right", mr: 2 }}>{(Math.round(value * 100) / 100).toLocaleString()}{isPercent ? "%" : ""}</Typography>
			</Button>
		</Box>
	);
}

export function MatchRankTile(props: { player: MatchPlayer, value: number, myGamertag?: string, isPercent?: boolean, goToMember: Function })
{
	const { player, value, myGamertag, isPercent, goToMember } = props;

	return (
		<Box sx={{ backgroundColor: "secondary.main", borderRadius: 3, display: "flex", flexDirection: "row", alignItems: "center", width: "90%", margin: 1, padding: 0, height: "48px" }}>
			<Button onClick={() => goToMember(player.gamertag)} sx={{ width: "100%", height: "100%", justifyContent: "flex-start", p: 0, borderRadius: 2, textTransform: "none", textAlign: "left", backgroundColor: myGamertag === player.gamertag ? ArrowheadTheme.good : "" }}>
				{player.team.emblem && <Box sx={{ 
					backgroundImage: `url(${player.team.emblem})`, 
					backgroundColor: GetColorForTeam(player.team.name), 
					backgroundSize: "80%",
					backgroundRepeat: "no-repeat",
					width: "48px", 
					height: "48px", 
					backgroundPosition: "center", 
					objectFit: "contain", 
					borderRadius: "8px 0px 0px 8px" }} />}
				<Box sx={{ ml: 1, display: "flex", flexDirection: "column", fontSize: "0.8rem" }}>
					<Typography variant="h6">{player.gamertag}</Typography>
				</Box>
                <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "right", mr: 2 }}>{(Math.round(value * 100) / 100).toLocaleString()}{isPercent ? "%" : ""}</Typography>
			</Button>
		</Box>
	);
}