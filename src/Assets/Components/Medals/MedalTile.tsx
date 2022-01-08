import { Box, Grid, Tooltip, Typography } from "@mui/material";
import { Medal } from "../../../Objects/Pieces/Medal";

export function MedalTile(props: { medal: Medal, wrap?: boolean })
{
	const { medal, wrap } = props;

	return (
		<Grid item xs={12} md={wrap ? 6 : 12}>
			<Box sx={{ background: "secondary.main", borderRadius: 3, display: "flex", flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "center", margin: 0, padding: 0 }}>
				<Tooltip title={medal.description}>
					<Box sx={{ textAlign: "right", width: "50%" }}>
						<img src={medal.images.medium} alt={medal.name} height="64px" />
					</Box>
				</Tooltip>
				<Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", margin: 1, padding: 1, width: "50%" }}>
					<Typography variant="caption" sx={{ textAlign: "left", mt: 0.5, ml: 0.5 }}>{medal.name}</Typography>
					<Typography variant="h5" sx={{ textAlign: "left", mb: 0.5, ml: 0.5 }}>{medal.count}</Typography>
				</Box>
			</Box>
		</Grid>
	);
}