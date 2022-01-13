import { Box, Typography } from "@mui/material";
import React from "react";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

export enum BreakdownPosition
{
    first, middle, last
}

interface BreakdownTileProps
{
    title: string;
    value: number | string;
    total?: number;
    isMainStat?: boolean;
    isPercent?: boolean;
    isHeader?: boolean;
    backgroundColor?: string;
}

export function BreakdownTile(props: BreakdownTileProps)
{
	const { title, value, total, isMainStat, isPercent, isHeader, backgroundColor } = props;

    const background = backgroundColor ?? (isMainStat ? ArrowheadTheme.box : ArrowheadTheme.secondary);

    let flexBasis = "";
    if (total !== undefined && typeof value === "number")
    {
        const percentage = value / total;
        flexBasis = `${Math.round(percentage * 100)}%`;
    }

    if (value === 0 && !isMainStat) { return <React.Fragment />; }

	return (
		<Box sx={{ backgroundColor: background, display: "flex", flexDirection: "column", alignItems: isMainStat ? "center" : "flex-start", width: "auto", margin: isMainStat ? 1 : 0, mt: 1, mb: 1, padding: 1, flexBasis: flexBasis }}>
            <Typography variant={isHeader ? "h6" : "caption"} sx={{ fontSize: isMainStat ? "0.9rem" : "0.7rem", flexGrow: 1, flexWrap: "nowrap", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", mt: 0.5, ml: isMainStat ? 0 : 0.5, color: isMainStat ? "" : ArrowheadTheme.text_primary }}>{title}</Typography>
            <Typography variant={"h4"} sx={{ fontSize: isMainStat ? "2.02rem" : "1.2rem !important", textAlign: "left", mb: 0.5, ml: isMainStat ? 0 : 0.5 }}>{typeof value === "number" ? (Math.round(value * 100) / 100).toLocaleString() : value}{isPercent ? "%" : ""}</Typography>
		</Box>
	);
}