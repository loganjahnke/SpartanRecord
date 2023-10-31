import { Chip, Box, Typography } from "@mui/material";
import { useState, useRef, useCallback } from "react";
import { Converter } from "../../../Objects/Helpers/Statics/Converter";
import { Player } from "../../../Objects/Model/Player";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { Image } from "../Common/Image";
import { VIP } from "../../../Objects/Model/VIP";

interface PlayerChipProps
{
	player: Player | VIP;
	onClick?: (gamertag: string) => void;
}

export function PlayerChip(props: PlayerChipProps)
{
	const { player, onClick } = props;

	const [textColor, setTextColor] = useState(ArrowheadTheme.text_primary);
    const nameplateRef = useRef<HTMLImageElement>(null);
	
	const onImageLoad = useCallback(() =>
    {
        if (!nameplateRef.current) { return; }
        const background = Converter.ImageToAverageColor(nameplateRef.current);
        setTextColor(Converter.GetBestTextColor(background));
    }, [setTextColor]);

	return (
		<Chip sx={{ backgroundPosition: "center", backgroundImage: `url(${player.appearance.nameplateURL})`, margin: "4px 4px", p: 0.5, height: "36px" }} icon={<Image height="24px" src={player.appearance.emblemURL} alt="Emblem" crossOrigin="anonymous" />} onClick={onClick ? () => onClick(player.gamertag) : undefined} 
			label={
				<>
					<Box sx={{ display: "none" }}><img ref={nameplateRef} src={player.appearance.nameplateURL} alt="nameplate" width="256px" height="48px" onLoad={onImageLoad} crossOrigin="anonymous" /></Box>
					<Box sx={{ textAlign: "left", mt: 0.5 }}>
						<Typography variant="subtitle1" sx={{ color: textColor, lineHeight: 1 }}>{player.gamertag}</Typography>
						<Typography variant="caption" sx={{ color: textColor, fontSize: "0.7rem" }}>{player.appearance.serviceTag}</Typography>
					</Box>
				</>
			} 
		/>
	)
}