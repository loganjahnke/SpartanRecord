import { Box, Grid, Typography } from "@mui/material";
import { Medal } from "../../../Objects/Pieces/Medal";

export function TopMedals(props: { medals: Medal[], matchesPlayed?: number, showPerMatch?: boolean })
{
    const { medals, matchesPlayed, showPerMatch } = props;

    const topMedals = medals.sort((a, b) => a.count < b.count ? 1 : -1).slice(0, Math.min(medals.length, 3));

    return (
        <Box sx={{ backgroundColor: "divider", borderRadius: 3, padding: 1 }}>
            <Grid container spacing={2}>
                {topMedals.map(medal =>
                {
                    return (
                        <Grid item key={medal.name} xs={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <img src={medal.images.small} alt="medal" />
                            <Typography variant="caption" sx={{ mt: 2 }}>{medal.name}</Typography>
                            <Typography variant="h4">{(showPerMatch ? medal.count / (matchesPlayed ?? 1) : medal.count).toLocaleString()}</Typography>
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    );
}