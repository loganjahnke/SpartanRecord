import { Box, Typography } from "@mui/material";
import { Player } from "../../../Objects/Model/Player";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

interface PlayerCardProps
{
	player: Player;
    noImages?: boolean;
    rightAlign?: boolean;
    showNameplate?: boolean;
}

export function PlayerCard(props: PlayerCardProps)
{
	const { player, noImages, rightAlign, showNameplate } = props;

	return showNameplate ? (
        <Box className="playerCard" sx={{ backgroundColor: "transparent", display: "flex", alignItems: "center", justifyContent: "flex-end", textAlign: "left", height: "100%", mr: -1 }}>
            <Box sx={{ display: "flex", alignItems: "center", width: "256px", height: "48px", backgroundSize: "contain", backgroundImage: `url(${player.appearance.nameplateURL})` }}>
                <Box sx={{ ml: 1, display: "flex", alignItems: "center" }}>{!noImages && player.appearance?.emblemURL && <img src={player.appearance.emblemURL} alt="emblem" height="48px" />}</Box>
                <Box sx={{ display: "flex", flexDirection: "column", ml: 2, flexGrow: 1, mixBlendMode: "difference" }}>
                    <Typography variant="body1">{player.gamertag}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 100, color: ArrowheadTheme.text_primary }}>{player.appearance?.serviceTag}</Typography>
                </Box>
            </Box>
        </Box>
    )
    : (
        <Box className="playerCard" sx={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "center", width: "50%", textAlign: rightAlign ? "right" : noImages ? "center" : "left" }}>
            {!rightAlign && !noImages && player.appearance?.emblemURL && <img src={player.appearance.emblemURL} alt="emblem" height="48px" />}
            <Box sx={{ display: "flex", flexDirection: "column", mr: rightAlign && !noImages ? 1 : 0, ml: rightAlign || noImages ? 0 : 1, flexGrow: 1 }}>
                <Typography variant="body1">{player.gamertag}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 100 }}>{player.appearance?.serviceTag}</Typography>
            </Box>
            {rightAlign && !noImages && player.appearance?.emblemURL && <img src={player.appearance.emblemURL} alt="emblem" height="48px" />}
        </Box>
	);
}