import { Box, Tooltip, Typography } from "@mui/material";
import React from "react";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { BreakdownTileProps } from "./BreakdownTile";

export function BreakdownRowTile(props: BreakdownTileProps)
{
	const { title, value, total, isMainStat, isPercent, isHeader, backgroundColor, small, tooltip, icon } = props;

    const background = backgroundColor ?? (isMainStat && !small ? ArrowheadTheme.box : ArrowheadTheme.secondary);

    let flexBasis = "";
    if (total !== undefined && typeof value === "number")
    {
        const percentage = value / total;
        flexBasis = `${Math.round(percentage * 100)}%`;
    }

    if (value === 0 && !isMainStat) { return <React.Fragment />; }

	return (
        <Tooltip title={tooltip ?? (title + ": " + (typeof value === "number" ? (Math.round(value * 100) / 100).toLocaleString() : value) + (isPercent ? "%" : ""))}>
            <Box sx={{ 
				background: background, 
				display: "grid",
				gridTemplateColumns: icon ? "48px auto 33%" : "auto 33%",
				margin: 0.5, 
				alignItems: "center",
				padding: 0.5,
				width: "100%" }}>
				{icon}
				<Box>
					<Typography variant={tooltip ? "subtitle1" : "body2"} sx={{ fontSize: tooltip ? "0.8rem" : "1rem", ml:1 }}>{title}</Typography>
					{tooltip && <Typography variant="caption" sx={{ display: "block", fontSize: "0.8rem", ml:1 }}>{tooltip}</Typography>}
				</Box>
				<Typography variant={"h5"} sx={{ textAlign: "right", mr: 2 }}>{typeof value === "number" ? (Math.round(value * 100) / 100).toLocaleString() : value}{isPercent ? "%" : ""}</Typography>
			</Box>
        </Tooltip>
	);
}