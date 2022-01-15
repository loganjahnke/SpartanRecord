import { Box, Tooltip, Typography } from "@mui/material";
import { Medal } from "../../../Objects/Pieces/Medal";

export function MedalTile(props: { medal: Medal })
{
	const { medal } = props;

	return (
		<Box sx={{ background: "secondary.main", borderRadius: 3, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", margin: 0, padding: 0 }}>
			<Tooltip title={medal.description}>
				<Box sx={{ textAlign: "right" }}>
					<img src={medal.images.medium} alt={medal.name} height="64px" />
				</Box>
			</Tooltip>
			<Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", margin: 1, padding: 1 }}>
				<Typography variant="caption" sx={{ textAlign: "left", mt: 0.5, ml: 0.5 }}>{medal.name}</Typography>
				<Typography variant="h5" sx={{ textAlign: "left", mb: 0.5, ml: 0.5 }}>{medal.count}</Typography>
			</Box>
		</Box>
	);
}