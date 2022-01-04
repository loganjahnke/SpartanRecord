import { Box, Typography } from "@mui/material";

export function Statistic(props: { title: string, icon: string, value: number })
{
    const { title, icon, value } = props;

    return (
        <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", alignItems: "flex-start", padding: 2 }}>
            <img src={icon} alt="icon" height="64px" />
            <Typography variant="caption" sx={{ mt: 2 }}>{title}</Typography>
            <Typography variant="h4">{value.toLocaleString()}</Typography>
        </Box>
    );
}