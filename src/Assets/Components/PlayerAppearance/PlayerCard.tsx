import { Box, Rating, Typography } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { Converter } from "../../../Objects/Helpers/Statics/Converter";
import { Player } from "../../../Objects/Model/Player";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

import '../../Styles/Components/PlayerCard.css';

interface PlayerCardProps
{
	player?: Player;
    noImages?: boolean;
    rightAlign?: boolean;
    showNameplate?: boolean;
    topDown?: boolean;
    noMargin?: boolean;
    loading?: boolean;
    winner?: boolean;
    isFavorite?: boolean;
    onFavorite?: (gamertag: string) => void;
}

export function DynamicPlayerCard(props: PlayerCardProps)
{
    const { loading } = props;
    return <>
        <Box sx={{ display: { xs: "none", sm: "block" }}}><PlayerCard {...props} showNameplate={true} /></Box>
        {!loading && <Box sx={{ display: { sm: "none" }}}><PlayerCard {...props} showNameplate={false} /></Box>}
    </>;
}

export function PlayerCard(props: PlayerCardProps)
{
	const { player, noImages, rightAlign, showNameplate, topDown, noMargin, winner, onFavorite, isFavorite } = props;

    const [textColor, setTextColor] = useState(ArrowheadTheme.text_primary);
    const nameplateRef = useRef<HTMLImageElement>(null);

    const onImageLoad = useCallback(() =>
    {
        if (!nameplateRef.current) { return; }
        const background = Converter.ImageToAverageColor(nameplateRef.current);
        setTextColor(Converter.GetBestTextColor(background));
    }, [setTextColor]);

    if (!player) { return <></>; }
	return showNameplate ? (
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            {onFavorite && player && player.gamertag && <Rating sx={{ mr: 2 }} value={isFavorite ? 1 : 0} max={1} onChange={() => onFavorite(player.gamertag)} />}
            <Box className="playerCard" sx={{ backgroundColor: "transparent", display: "flex", alignItems: "center", justifyContent: rightAlign ? "flex-end" : "flex-start", textAlign: "left", height: "100%", mr: noMargin ? 0 : -1 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {!noImages && player.appearance?.nameplateURL && <img ref={nameplateRef} src={player.appearance.nameplateURL} alt="nameplate" width="256px" height="48px" onLoad={onImageLoad} crossOrigin="anonymous" />}
                    <Box sx={{ ml: 1, display: "flex", alignItems: "center", position: "absolute" }}>{!noImages && player.appearance?.emblemURL && <img src={player.appearance.emblemURL} alt="emblem" height="44px" crossOrigin="anonymous" />}</Box>
                    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, position: "absolute", ml: "72px" }}>
                        <Typography variant="body1" sx={{ color: textColor }}>{player.gamertag}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 100, color: textColor, fontStyle: "italic", letterSpacing: "1px" }}>{player.appearance?.serviceTag}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
    : !topDown ? (
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            {onFavorite && player && player.gamertag && <Rating sx={{ mr: 2 }} value={isFavorite ? 1 : 0} max={1} onChange={() => onFavorite(player.gamertag)} />}
            <Box className="playerCard" sx={{ backgroundColor: "transparent", display: "flex", flexDirection: "row", alignItems: "center", textAlign: rightAlign ? "right" : noImages ? "center" : "left" }}>
                {!rightAlign && !noImages && player.appearance?.emblemURL && <img src={player.appearance.emblemURL} alt="emblem" height="48px" crossOrigin="anonymous" />}
                <Box sx={{ display: "flex", flexDirection: "column", mr: rightAlign && !noImages ? 1 : 0, ml: rightAlign || noImages ? 0 : 1, flexGrow: 1 }}>
                    <Typography variant="body1">{player.gamertag}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 100 }}>{player.appearance?.serviceTag}</Typography>
                </Box>
                {rightAlign && !noImages && player.appearance?.emblemURL && <img src={player.appearance.emblemURL} alt="emblem" height="48px" />}
            </Box>
        </Box>
    ) : (
        <Box className={`${winner ? "topdownWinner" : ""}`} sx={{ backgroundColor: "transparent", display: "flex", flexDirection: "column", alignItems: "center", textAlign: rightAlign ? "right" : noImages ? "center" : "left" }}>
            {!noImages && player.appearance?.emblemURL && <img src={player.appearance.emblemURL} alt="emblem" height="48px" crossOrigin="anonymous" />}
            <Box sx={{ mt: 1 }} />
            <Typography className="playerNameGT" variant="body1">{player.gamertag}</Typography>
            <Typography className="playerNameST" variant="body2" sx={{ fontWeight: 100 }}>{player.appearance?.serviceTag}</Typography>
        </Box>
    );
}