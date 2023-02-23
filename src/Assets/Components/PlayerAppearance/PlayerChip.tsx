import { Chip, Box, Typography } from "@mui/material";
import { Player } from "../../../Objects/Model/Player";

interface PlayerChipProps
{
	player: Player;
	onClick?: (gamertag: string) => void;
}

export function PlayerChip(props: PlayerChipProps)
{
	const { player, onClick } = props;

	return (
		<Chip sx={{ backgroundPosition: "center", backgroundImage: `url(${player.appearance.nameplateURL})`, margin: "4px 4px", p: 0.5, height: "36px" }} icon={<img  height="24px" src={player.appearance.emblemURL} alt="Emblem" />} onClick={onClick ? () => onClick(player.gamertag) : undefined} 
			label={
				<Box sx={{ textAlign: "left", mt: 0.5, filter: "invert(1)", mixBlendMode: "difference" }}>
					<Typography variant="subtitle1" sx={{ color: "black", lineHeight: 1 }}>{player.gamertag}</Typography>
					<Typography variant="caption" sx={{ color: "black", fontSize: "0.7rem" }}>{player.appearance.serviceTag}</Typography>
				</Box>
			} 
		/>
	)
}