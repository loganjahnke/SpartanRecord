import { Box, Typography } from "@mui/material";
import { Player } from "../../../Objects/Model/Player";

interface PlayerCardProps
{
	player: Player;
    noImages?: boolean;
    rightAlign?: boolean;
}

export function PlayerCard(props: PlayerCardProps)
{
	const { player, noImages, rightAlign } = props;

	return (
        <Box className="playerCard" sx={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: rightAlign ? "flex-end" : noImages ? "center" : "flex-start", width: "25%", textAlign: rightAlign ? "right" : noImages ? "center" : "left" }}>
            {!rightAlign && !noImages && player.appearance?.emblemURL && <img src={player.appearance.emblemURL} alt="emblem" height="48px" />}
            <Box sx={{ display: "flex", flexDirection: "column", mr: rightAlign && !noImages ? 1 : 0, ml: rightAlign || noImages ? 0 : 1, flexGrow: 1 }}>
                <Typography variant="body1">{player.gamertag}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 100 }}>{player.appearance?.serviceTag}</Typography>
            </Box>
            {rightAlign && !noImages && player.appearance?.emblemURL && <img src={player.appearance.emblemURL} alt="emblem" height="48px" />}
        </Box>
	);
}