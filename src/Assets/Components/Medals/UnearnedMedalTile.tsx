import { Box, Tooltip, Typography } from "@mui/material";
import { Medal } from "../../../Objects/Pieces/Medal";

export function UnearnedMedalTile(props: { medal: Medal })
{
	const { medal } = props;

	return (
        <Tooltip disableFocusListener arrow title={medal.description}>
            <Box sx={{ background: "secondary.main", borderRadius: 3, display: "flex", flexDirection: "column", width: "80px", alignItems: "center", margin: 1.5, padding: 0 }}>
                <img src={medal.images.medium} alt={medal.name} height="48px" />
                <Typography variant="caption" sx={{ textAlign: "center", mt: 1, fontSize: "0.6rem" }}>{medal.name}</Typography>
            </Box>
        </Tooltip>
	);
}