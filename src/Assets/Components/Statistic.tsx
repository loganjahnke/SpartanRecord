import { Box, Typography } from "@mui/material";

export function Statistic(props: { title: string, icon: string, value: number })
{
    const { title, icon, value } = props;

    return (
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        </Box>
    );
}