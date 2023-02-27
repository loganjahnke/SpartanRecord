import { Grid, Box } from "@mui/material";
import { RankedIcon } from "../../Icons/CustomIcons";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

import "../../Styles/Components/BackgroundWinnerIcon.css";

export function BackgroundWinnerIcon(props: { winner?: boolean })
{
	const { winner } = props;

	if (!winner) { return <Grid item sx={{ display: { xs: "none", sm: "none", md: "none", lg: "none", xl: "flex" }}} xs={0} xl={3} />; }
	return (
		<Grid item className="winnerGrid" sx={{ display: { xs: "none", sm: "none", md: "none", lg: "none", xl: "flex" }}} xs={0} xl={3}>
			<Box sx={{ display: { xs: "none", sm: "none", md: "none", lg: "none", xl: "block" }}}>
				<RankedIcon className="winnerIcon" />
			</Box>
		</Grid>
	);
}