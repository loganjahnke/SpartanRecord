import { Box, Tooltip, Typography } from "@mui/material";
import React from "react";
import { CSRS } from "../../../Objects/Model/CSRS";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { BorderLinearProgress, BorderLinearProgressMatches } from "../Custom/BorderLinearProgress";

export function CSRSBreakdownTile(props: { csrs: CSRS })
{
	const { csrs } = props;

    const background = ArrowheadTheme.box;
	const progress = csrs.ranks.current.tier === "Unranked" ? (10 - csrs.ranks.current.measurementMatchesRemaining) * 10
		: (csrs.ranks.current.value - csrs.ranks.current.tierStart) * 100 / (csrs.ranks.current.nextTierStart - csrs.ranks.current.tierStart);

	return (
		<Box sx={{ 
			background: background, 
			display: "grid",
			gridTemplateColumns: "48px auto",
			margin: 0.5, 
			alignItems: "center",
			padding: 0.5,
			width: "100%" }}>
			<img src={csrs.ranks.current.tierImageUrl} height="48px" width="48px" />
			<Box sx={{ mb: 1 }}>
				<Box sx={{ display: "flex", flexDirection: "row", mb: 0.5 }}>
					<Typography variant={"subtitle1"} sx={{ fontSize: "0.8rem", ml: 1 }}>{csrs.GetHeader()}</Typography>
					<Box sx={{ flexGrow: 1 }} />
					<Typography variant="caption" sx={{ display: "block", fontSize: "0.8rem", mr: 1 }}>{csrs.GetSubtitle()}</Typography>
				</Box>
				<Box>
					<Tooltip title={csrs.ranks.current.tier === "Unranked" ? `${csrs.ranks.current.measurementMatchesRemaining} placement matches remaining` : `${csrs.ranks.current.nextTierStart - csrs.ranks.current.value} needed for next tier`}>
						{csrs.ranks.current.tier === "Unranked" ? <BorderLinearProgressMatches variant="determinate" value={progress} sx={{ flexBasis: "75%", ml: 1, mr: 1 }} /> : <BorderLinearProgress variant="determinate" value={progress} sx={{ flexBasis: "75%", ml: 1, mr: 1 }} />}
					</Tooltip>
				</Box>
			</Box>
		</Box>
	);
}