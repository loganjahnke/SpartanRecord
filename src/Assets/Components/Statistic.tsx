import { Box, Typography } from "@mui/material";

interface StatisticProp
{
    /** The title of the statistic */
    title: string; 
    /** The icon representing the statistic */
    icon: string;
    /** The value of the statistic */
    value: number;
    /** If this is a percent or not */
    isPercent?: boolean;
}

export function Statistic(props: StatisticProp)
{
    const { title, icon, value, isPercent } = props;

    return (
        <Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", alignItems: "flex-start", padding: 2 }}>
            <img src={icon} alt="icon" height="64px" />
            <Typography variant="caption" sx={{ mt: 2 }}>{title}</Typography>
            <Typography variant="h4">{(Math.round(value * 100) / 100).toLocaleString()}{isPercent ? "%" : ""}</Typography>
        </Box>
    );
}