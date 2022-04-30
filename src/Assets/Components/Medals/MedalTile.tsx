import { Box, Tooltip, Typography } from "@mui/material";
import { Medal } from "../../../Objects/Pieces/Medal";

export function MedalTile(props: { medal: Medal, small?: boolean })
{
	const { medal, small } = props;

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
			<Tooltip title={medal.description}>
				<Box sx={{ textAlign: "right" }}>
					<img src={medal.images.medium} alt={medal.name} height={small ? "48px" : "64px"} />
				</Box>
			</Tooltip>
			<Typography variant="caption" sx={{ textAlign: small ? "center" : "left", mt: small ? 0 : 0.5, ml: 0.5, fontSize: small ? "0.6rem" : "0.8rem" }}>{medal.name}</Typography>
			<Typography variant={small ? "h6" : "h5"} sx={{ textAlign: small ? "center" : "left", mb: small ? 0 : 0.5, ml: 0.5 }}>{medal.count}</Typography>
		</Box>
		:
		<Box sx={{ 
			background: "secondary.main", 
			display: "grid",
			gridTemplateColumns: "92px auto 25%",
			margin: 0, 
			alignItems: "center",
			padding: 0.5 }}>
			<Tooltip title={medal.description}>
				<Box sx={{ textAlign: "left", ml: 2 }}>
					<img src={medal.images.medium} alt={medal.name} height={small ? "48px" : "64px"} />
				</Box>
			</Tooltip>
			<Box>
				<Typography variant="subtitle1" sx={{ fontSize: "0.8rem", ml:1 }}>{medal.name}</Typography>
				<Typography variant="caption" sx={{ display: "block", fontSize: "0.8rem", ml:1 }}>{medal.description}</Typography>
			</Box>
			{medal.count <= 0 ? undefined : <Typography variant={"h5"} sx={{ textAlign: "right", mr: 2 }}>{medal.count}</Typography>}
		</Box>

	);
}