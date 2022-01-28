import { Box, Divider, Tooltip, Typography } from "@mui/material";
import React from "react";
import { Medal } from "../../../Objects/Pieces/Medal";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

export function MedalTile(props: { medal: Medal, small?: boolean })
{
	const { medal, small } = props;

	return (
		<Box sx={{ 
			background: "secondary.main", 
			width: small ? "85px" : "auto", 
			minWidth: small ? "85px" : "130px",
			maxWidth: small ? "85px" : "225px",
			display: "flex", 
			flexDirection: small ? "column" : "row", 
			alignItems: "center", 
			justifyContent: "center", 
			margin: 0, 
			padding: 0.5 }}>
			<Tooltip title={medal.description}>
				<Box sx={{ textAlign: "right" }}>
					<img src={medal.images.medium} alt={medal.name} height={small ? "48px" : "64px"} />
				</Box>
			</Tooltip>
			<Box sx={{ 
				display: "flex", 
				flexDirection: "column", 
				alignItems: small ? "center" : "flex-start", 
				margin: small ? 0 : 1, 
				padding: small ? 0 : 1 }}>
				<Typography variant="caption" sx={{ textAlign: small ? "center" : "left", mt: small ? 0 : 0.5, ml: 0.5, fontSize: small ? "0.6rem" : "0.8rem" }}>{medal.name}</Typography>
				<Typography variant={small ? "h6" : "h5"} sx={{ textAlign: small ? "center" : "left", mb: small ? 0 : 0.5, ml: 0.5 }}>{medal.count}</Typography>
			</Box>
		</Box>
	);
}