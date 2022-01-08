import { Box, Typography } from "@mui/material";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

export function BreakdownTile(props: { title: string, value: number | string, total?: number, isMainStat?: boolean, isPercent?: boolean, isHeader?: boolean })
{
	const { title, value, total, isMainStat, isPercent, isHeader } = props;

    let background = "";
    if (total !== undefined && typeof value === "number")
    {
        const percentage = value / total;
        background = `linear-gradient(to left, ${ArrowheadTheme.box}, ${ArrowheadTheme.box} ${100 - Math.round(percentage * 100)}%, ${ArrowheadTheme.secondary} ${100 - Math.round(percentage * 100)}%, ${ArrowheadTheme.secondary} ${Math.round(percentage * 100)}%)`;
    }

	return (
		<Box sx={{ background: background, borderRadius: 3, display: "flex", flexDirection: "column", alignItems: isMainStat ? "center" : "flex-start", width: isMainStat ? "auto" : "90%", margin: 1, padding: 1 }}>
            <Typography variant={isHeader ? "h6" : "caption"} sx={{ flexGrow: 1, mt: 0.5, ml: isMainStat ? 0 : 0.5 }}>{title}</Typography>
            <Typography variant="h4" sx={{ textAlign: "left", mb: 0.5, ml: isMainStat ? 0 : 0.5 }}>{typeof value === "number" ? (Math.round(value * 100) / 100).toLocaleString() : value}{isPercent ? "%" : ""}</Typography>
		</Box>
	);
}