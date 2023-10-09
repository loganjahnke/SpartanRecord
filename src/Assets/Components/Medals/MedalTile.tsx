import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { Medal } from "../../../Objects/Pieces/Medal";

import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

export function MedalTile(props: { medal: Medal, small?: boolean, matchesPlayed?: number, select?: (id: number) => void, selectedID?: number, disabled?: boolean })
{
	const { medal, small, matchesPlayed, select, selectedID, disabled } = props;

	/** Turns on or off debugging mode */
	const IS_DEBUGGING = process.env.NODE_ENV !== "production";

	return (
		small ?
		<Box sx={{ 
			background: "secondary.main", 
			width: "85px",
			minWidth: "85px",
			maxWidth: "85px",
			display: "flex", 
			flexDirection: "column", 
			alignItems: "center", 
			justifyContent: "center", 
			margin: 0, 
			padding: 0.5 }}>
			<Tooltip disableFocusListener arrow title={IS_DEBUGGING ? medal.id : medal.description}>
				<Box sx={{ textAlign: "right" }}>
					<img src={medal.images.medium} alt={medal.name} height={small ? "48px" : "64px"} />
				</Box>
			</Tooltip>
			<Typography variant="caption" sx={{ textAlign: small ? "center" : "left", mt: small ? 0 : 0.5, ml: 0.5, fontSize: small ? "0.6rem" : "0.8rem" }}>{medal.name}</Typography>
			{!!select 
				? <IconButton onClick={() => select(medal.id)}>{selectedID === medal.id ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}</IconButton>
				: <Typography variant={small ? "h6" : "h5"} sx={{ textAlign: small ? "center" : "left", mb: small ? 0 : 0.5, ml: 0.5 }}>{(matchesPlayed ? medal.count / matchesPlayed : medal.count).toLocaleString()}</Typography>}
		</Box>
		:
		!select ?
		<Box sx={{ 
			background: "secondary.main", 
			display: "grid",
			gridTemplateColumns: "92px auto 25%",
			margin: 0, 
			alignItems: "center",
			padding: 0.5 }}>
			<Tooltip disableFocusListener arrow title={IS_DEBUGGING ? medal.id : medal.description}>
				<Box sx={{ textAlign: "left", ml: 2 }}>
					<img src={medal.images.medium} alt={medal.name} height={small ? "48px" : "64px"} />
				</Box>
			</Tooltip>
			<Box>
				<Typography variant="subtitle1" sx={{ fontSize: "0.8rem", ml:1 }}>{medal.name}</Typography>
				<Typography variant="caption" sx={{ display: "block", fontSize: "0.8rem", ml:1 }}>{medal.description}</Typography>
			</Box>
			{medal.count > 0 && <Typography variant={"h5"} sx={{ textAlign: "right", mr: 2 }}>{(matchesPlayed ? medal.count / matchesPlayed : medal.count).toLocaleString()}</Typography>}
		</Box>
		:
		<Button 
			sx={{ backgroundColor: selectedID === medal.id ? ArrowheadTheme.good : "transparent", cursor: disabled ? "default" : "pointer", ":hover": { backgroundColor: disabled ? "transparent" : ArrowheadTheme.secondary } }} 
			onClick={disabled ? undefined : () => select(medal.id)} 
			title={disabled ? "Your company has not acquired this medal yet." : medal.name + ": " + medal.description}>
			<img src={medal.images.medium} alt={medal.name} height="64px" style={{ filter: disabled ? "grayscale(100%)" : "" }} />
		</Button>

	);
}