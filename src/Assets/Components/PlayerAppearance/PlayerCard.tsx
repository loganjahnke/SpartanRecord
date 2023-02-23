import { Box, Typography } from "@mui/material";
import { Player } from "../../../Objects/Model/Player";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

interface PlayerCardProps
{
	player?: Player;
    noImages?: boolean;
    rightAlign?: boolean;
    showNameplate?: boolean;
    topDown?: boolean;
    noMargin?: boolean;
}

export function DynamicPlayerCard(props: PlayerCardProps)
{
    return <>
        <Box sx={{ display: { xs: "none", sm: "block" }}}><PlayerCard {...props} showNameplate={true} /></Box>
        <Box sx={{ display: { sm: "none" }}}><PlayerCard {...props} showNameplate={false} /></Box>
    </>;
}

export function PlayerCard(props: PlayerCardProps)
{
	const { player, noImages, rightAlign, showNameplate, topDown, noMargin } = props;

    if (!player) { return <></>; }
	return showNameplate ? (
        <Box className="playerCard" sx={{ backgroundColor: "transparent", display: "flex", alignItems: "center", justifyContent: rightAlign ? "flex-end" : "flex-start", textAlign: "left", height: "100%", mr: noMargin ? 0 : -1 }}>
            <Box sx={{ display: "flex", alignItems: "center", width: "256px", height: "48px", backgroundSize: "contain", backgroundImage: `url(${player.appearance.nameplateURL})` }}>
                <Box sx={{ ml: 1, display: "flex", alignItems: "center" }}>{!noImages && player.appearance?.emblemURL && <img src={player.appearance.emblemURL} alt="emblem" height="48px" />}</Box>
                <Box sx={{ display: "flex", flexDirection: "column", ml: 2, flexGrow: 1 }}>
                    <Typography variant="body1" sx={{ textShadow: "black 0 0 4px" }}>{player.gamertag}</Typography>
                    <Typography variant="body2" sx={{ textShadow: "black 0 0 4px", fontWeight: 100, color: ArrowheadTheme.text_primary }}>{player.appearance?.serviceTag}</Typography>
                </Box>
            </Box>
        </Box>
    )
    : !topDown ? (
        <Box className="playerCard" sx={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "center", textAlign: rightAlign ? "right" : noImages ? "center" : "left" }}>
            {!rightAlign && !noImages && player.appearance?.emblemURL && <img src={player.appearance.emblemURL} alt="emblem" height="48px" />}
            <Box sx={{ display: "flex", flexDirection: "column", mr: rightAlign && !noImages ? 1 : 0, ml: rightAlign || noImages ? 0 : 1, flexGrow: 1 }}>
                <Typography variant="body1">{player.gamertag}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 100 }}>{player.appearance?.serviceTag}</Typography>
            </Box>
            {rightAlign && !noImages && player.appearance?.emblemURL && <img src={player.appearance.emblemURL} alt="emblem" height="48px" />}
        </Box>
    ) : (
        <Box className="playerCard" sx={{ backgroundColor: "transparent", display: "flex", flexDirection: "column", alignItems: "center", textAlign: rightAlign ? "right" : noImages ? "center" : "left" }}>
            {!noImages && player.appearance?.emblemURL && <img src={player.appearance.emblemURL} alt="emblem" height="48px" />}
            <Box sx={{ mt: 1 }} />
            <Typography variant="body1">{player.gamertag}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 100 }}>{player.appearance?.serviceTag}</Typography>
        </Box>
    );
}