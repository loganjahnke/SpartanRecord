import { Box, Button, Typography } from "@mui/material";
import { Player } from "../../../Objects/Model/Player";
import { MatchPlayer } from "../../../Objects/Pieces/MatchPlayer";

import ArrowheadImg from "../../Images/arrowhead.png";

export function RankTile(props: { player: Player, value: number, rank: number, isPercent?: boolean, goToMember: Function })
{
	const { player, value, rank, isPercent, goToMember } = props;

	return (
		<Box sx={{ backgroundColor: "secondary.main", borderRadius: 3, display: "flex", flexDirection: "row", alignItems: "center", width: "90%", margin: 1, padding: 1 }}>
			<Button onClick={() => goToMember(player.gamertag)} sx={{ width: "100%", justifyContent: "flex-start", borderRadius: 2, textTransform: "none", textAlign: "left" }}>
				<img src={player.appearance.emblemURL === "" ? ArrowheadImg : player.appearance.emblemURL} alt="emblem" height="48px" />
				<Box sx={{ ml: 1, display: "flex", flexDirection: "column" }}>
					<Typography variant="body2">{player.gamertag}</Typography>
					<Typography variant="body1" sx={{ fontWeight: 100 }}>{(Math.round(value * 100) / 100).toLocaleString()}{isPercent ? "%" : ""}</Typography>
				</Box>
                <Typography variant="h4" sx={{ flexGrow: 1, textAlign: "right" }}>#{rank}</Typography>
			</Button>
		</Box>
	);
}

export function MatchRankTile(props: { player: MatchPlayer, value: number, rank: number, isPercent?: boolean, goToMember: Function })
{
	const { player, value, rank, isPercent, goToMember } = props;

	return (
		<Box sx={{ backgroundColor: "secondary.main", borderRadius: 3, display: "flex", flexDirection: "row", alignItems: "center", width: "90%", margin: 1, padding: 1 }}>
			<Button onClick={() => goToMember(player.gamertag)} sx={{ width: "100%", justifyContent: "flex-start", borderRadius: 2, textTransform: "none", textAlign: "left" }}>
				<Box sx={{ ml: 1, display: "flex", flexDirection: "column" }}>
					<Typography variant="body2">{player.gamertag}</Typography>
					<Typography variant="body1" sx={{ fontWeight: 100 }}>{(Math.round(value * 100) / 100).toLocaleString()}{isPercent ? "%" : ""}</Typography>
				</Box>
                <Typography variant="h4" sx={{ flexGrow: 1, textAlign: "right" }}>#{rank}</Typography>
			</Button>
		</Box>
	);
}