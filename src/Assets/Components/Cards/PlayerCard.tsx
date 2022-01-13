import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Player } from "../../../Objects/Model/Player";

interface PlayerCardProps
{
	player: Player;
}

export function PlayerCard(props: PlayerCardProps)
{
	const { player } = props;

	return (
        <Card sx={{ borderRadius: 3 }}>
            {player.appearance?.backdropURL ? <CardMedia component="img" height="200" image={player.appearance.backdropURL} alt="backdrop" sx={{ backgroundColor: "divider" }} /> : undefined}
            <CardContent sx={{ pt: 4, backgroundColor: "divider", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                {player.appearance?.emblemURL ? <img src={player.appearance.emblemURL} alt="emblem" height="48px" /> : undefined}
                <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
                    <Typography variant="body1">{player.gamertag}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 100 }}>{player.appearance?.serviceTag}</Typography>
                </Box>
            </CardContent>
        </Card>
	);
}