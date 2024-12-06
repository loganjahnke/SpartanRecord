import { Chip, Box, Typography } from "@mui/material";
import { Player } from "../../../Objects/Model/Player";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { Image } from "../Common/Image";
import { VIP } from "../../../Objects/Model/VIP";
import { CalendarMonth } from "@mui/icons-material";

interface PlayerChipProps
{
	player: Player | VIP;
	onClick?: (gamertag: string) => void;
	onSecondaryClick?: (gamertag: string) => void;
}

export function PlayerChip(props: PlayerChipProps)
{
	const { player, onClick, onSecondaryClick } = props;

	return (
		<Chip 
			sx={{ 
				border: "1px solid #95A3B3AA", 
				background: "linear-gradient(-25deg, rgba(7,32,40,1) 0%, rgba(0,48,60,1) 25%, rgba(1,64,82,1) 50%, rgba(0,48,60,1) 75%, rgba(7,32,40,1) 100%)", 
				margin: "4px 4px", p: 0.5, height: "36px" 
			}} 
			icon={<Image height="24px" src={player.appearance.emblemURL} alt="Emblem" crossOrigin="anonymous" />} 
			onClick={onClick ? () => onClick(player.gamertag) : undefined} 
			onDelete={onSecondaryClick ? () => onSecondaryClick(player.gamertag) : undefined}
			deleteIcon={<CalendarMonth />}
			label={
				<>
					<Box sx={{ textAlign: "left", mt: 0.5 }}>
						<Typography variant="subtitle1" sx={{ color: ArrowheadTheme.text_primary, lineHeight: 1 }}>{player.gamertag}</Typography>
						<Typography variant="caption" sx={{ color: ArrowheadTheme.text_primary, fontSize: "0.7rem" }}>{player.appearance.serviceTag}</Typography>
					</Box>
				</>
			} 
		/>
	)
}