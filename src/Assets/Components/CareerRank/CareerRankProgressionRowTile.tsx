import { Box, Grid, Typography } from "@mui/material";
import { CareerRankMetadata } from "../../../Database/Schemas/AutocodeMetadata";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import "../../Styles/Components/CareerRankProgression.css";

export function CareerRankProgressionRowTile(props: { rank: CareerRankMetadata, isCurrent?: boolean })
{
	const { rank, isCurrent } = props;

	const colorA = rank.attributes.colors[0] + "15";
	const colorB = rank.attributes.colors[1] + "15";

	return (
		<>
			<Grid 
				item
				xs={2}
				className={isCurrent ? "progressionRankGridItemImage progressionRankCurrent" : "progressionRankGridItemImage"} 
				sx={{ 
					borderColor: rank.attributes.colors[1] + " !important",
					background: `linear-gradient(to bottom, transparent 0%, ${colorA} 25%, ${colorB} 50%, ${colorA} 75%, transparent 100%)` 
				}}
			>
				<Box className="progressionRank" sx={{ mt: { xs: "0", sm: "0", md: "0", lg: "0", xl: isCurrent ? "34px" : "28px" }}}>
					<img className="progressionImg" src={rank.image_urls.icon} title={rank.title + " " + rank.subtitle} />
					<Typography className="rankTitle" sx={{ display: { xs: "none", sm: "none", md: "none", lg: "none", xl: "block" }}}>{rank.title}</Typography>
				</Box>
			</Grid>
			{rank.title !== "General" && 
				<Grid className="progressionRankGridItemIcon" item xs={1} sx={{ background: `linear-gradient(to bottom, transparent 0%, ${colorA} 25%, ${colorB} 50%, ${colorA} 75%, transparent 100%)` }}>
					<Box className="progressionRank">
						<NavigateNextIcon className="progressionArrowIcon" htmlColor={rank.subtitle !== "Onyx" ? rank.attributes.colors[1] : "#C0A46E"} />
					</Box>
				</Grid>
			}
		</>
	);
}