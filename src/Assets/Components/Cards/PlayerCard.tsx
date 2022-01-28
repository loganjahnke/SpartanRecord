import { Box, Typography } from "@mui/material";
import { Player } from "../../../Objects/Model/Player";

interface PlayerCardProps
{
	player: Player;
    noImages?: boolean;
}

export function PlayerCard(props: PlayerCardProps)
{
	const { player, noImages } = props;

	return (
        <Box className="playerCard" sx={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: noImages ? "center" : "flex-start", width: "25%" }}>
            {!noImages && player.appearance?.emblemURL ? <img src={player.appearance.emblemURL} alt="emblem" height="48px" /> : undefined}
            <Box sx={{ display: "flex", flexDirection: "column", ml: noImages ? 0 : 1, flexGrow: 1, textAlign: noImages ? "center" : "left" }}>
                <Typography variant="body1">{player.gamertag}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 100 }}>{player.appearance?.serviceTag}</Typography>
            </Box>
        </Box>
	);
}