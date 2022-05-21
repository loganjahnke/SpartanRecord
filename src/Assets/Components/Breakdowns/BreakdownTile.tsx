import { Box, Tooltip, Typography } from "@mui/material";
import React from "react";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

export interface BreakdownProps
{
    image?: string;
    background?: string;
    serviceRecord: ServiceRecord;
    showPerMatch?: boolean;
    small?: boolean;
}

export interface BreakdownTileProps
{
    title: string;
    value: number | string;
    total?: number;
    isMainStat?: boolean;
    isPercent?: boolean;
    isHeader?: boolean;
    backgroundColor?: string;
    small?: boolean;
    tooltip?: string;
    icon?: JSX.Element;
}

export function BreakdownTile(props: BreakdownTileProps)
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
                backgroundColor: background, 
                display: "flex", 
                flexDirection: "column", 
                alignItems: isMainStat ? "center" : "flex-start", 
                margin: isMainStat ? 1 : 0, 
                mt: 1, 
                mb: 1, 
                padding: 1, 
                width: isMainStat ? "auto" : flexBasis }}>
                <Typography variant={isHeader ? "h6" : "caption"} sx={{ 
                    display: "block",
                    width: isMainStat ? "auto" : "100%",
                    fontSize: isMainStat && !small ? "0.9rem" : "0.7rem", 
                    flexWrap: "nowrap", 
                    whiteSpace: "nowrap", 
                    overflow: "hidden", 
                    textOverflow: "ellipsis", 
                    mt: 0.5, 
                    ml: isMainStat ? 0 : 0.5, 
                    color: isMainStat ? "" : ArrowheadTheme.text_primary }}>{title}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 0.5 }}>
                    {icon}
                    <Typography variant={"h4"} sx={{ 
                        fontSize: isMainStat && !small ? "2.02rem" : "1.2rem !important", 
                        width: isMainStat ? "auto" : "100%",
                        textAlign: "left", 
                        flexWrap: "nowrap", 
                        whiteSpace: "nowrap", 
                        overflow: "hidden", 
                        textOverflow: "ellipsis", 
                        ml: isMainStat ? 0 : 0.5 }}>{typeof value === "number" ? (Math.round(value * 100) / 100).toLocaleString() : value}{isPercent ? "%" : ""}</Typography>
                </Box>
		    </Box>
        </Tooltip>
	);
}