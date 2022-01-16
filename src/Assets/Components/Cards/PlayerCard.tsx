import { Box, Card, CardContent, Typography } from "@mui/material";
import { Player } from "../../../Objects/Model/Player";

interface PlayerCardProps
{
	player: Player;
    noImages?: boolean;
}

export function PlayerCard(props: PlayerCardProps)
{
	const { player, noImages } = props;

    const highestRank = player?.GetHighestCurrentRank();

	return (
        <Card className="playerCard" sx={{ borderRadius: 3 }}>
            <CardContent sx={{ pt: 3, backgroundColor: "divider", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: noImages ? "center" : "flex-start" }}>
                {!noImages && player.appearance?.emblemURL ? <img src={player.appearance.emblemURL} alt="emblem" height="48px" /> : undefined}
                <Box sx={{ display: "flex", flexDirection: "column", ml: noImages ? 0 : 1, flexGrow: 1, textAlign: noImages ? "center" : "left" }}>
                    <Typography variant="body1">{player.gamertag}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 100 }}>{player.appearance?.serviceTag}</Typography>
                </Box>
                {!noImages && highestRank?.ranks?.current?.tierImageUrl ? <img src={highestRank.ranks.current.tierImageUrl} alt="highest rank" height="48px" /> : undefined}
            </CardContent>
        </Card>
	);
}