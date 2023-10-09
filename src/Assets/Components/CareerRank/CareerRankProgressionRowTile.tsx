import { Box, Grid, Tooltip, Typography } from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { CareerRankTileProps } from "./CareerRankProps";

import "../../Styles/Components/CareerRankProgression.css";

export function CareerRankProgressionRowTile(props: CareerRankTileProps)
{
	const { rank, current, avgScore } = props;

	const colorA = rank.attributes.colors[0] + "15";
	const colorB = rank.attributes.colors[1] + "15";

	const isCurrent = rank.title + rank.subtitle === current.data.current.title + current.data.current.subtitle;
	const xpToRank = rank.properties.threshold - current.data.level.total_xp;

	return (
		<>
			<Grid 
				item
				xs={rank.title === "Hero" ? 1 : 2}
				className={isCurrent ? "progressionRankGridItemImage progressionRankCurrent" : "progressionRankGridItemImage"} 
				sx={{ 
					justifyContent: rank.title === "Hero" ? "center" : "",
					borderColor: rank.attributes.colors[1] + " !important",
					background: `linear-gradient(to bottom, transparent 0%, ${colorA} 25%, ${colorB} 50%, ${colorA} 75%, transparent 100%)` 
				}}
			>
				<Tooltip disableFocusListener arrow title={
					<Box className="rankRowLabelValues">
						<Typography className="rankColTitle">{rank.title}</Typography>
						<Typography className="rankColTitle">{rank.properties.threshold.toLocaleString()} xp</Typography>
						{xpToRank > 0 && <Typography className="rankColTitle rankNoUppercase"><span className="rankColExpected">Expected games to rank:</span> {Math.ceil(xpToRank / avgScore).toLocaleString()}</Typography>}
					</Box>
				}>
					<Box className="progressionRank" sx={{ 
						mt: { 
							xs: "0", 
							sm: "0", 
							md: "0", 
							lg: "0", 
							xl: isCurrent ? "34px" : "28px" 
						},
					}}>
						{rank.title !== "Hero" && <img className="progressionImg" src={rank.image_urls.icon} alt={rank.title + " " + rank.subtitle} />}
						{rank.title === "Hero" && <img className="progressionImg" src={rank.image_urls.icon} alt={rank.title + " " + rank.subtitle} height="108px" />}
						<Typography className="rankTitle" sx={{ display: { xs: "none", sm: "none", md: "none", lg: "none", xl: "block" }}}>{rank.title}</Typography>
					</Box>
				</Tooltip>
			</Grid>
			{rank.title !== "General" && rank.title !== "Hero" && 
				<Grid className="progressionRankGridItemIcon" item xs={1} sx={{ background: `linear-gradient(to bottom, transparent 0%, ${colorA} 25%, ${colorB} 50%, ${colorA} 75%, transparent 100%)` }}>
					<Box className="progressionRank">
						<NavigateNextIcon className="progressionArrowIcon" htmlColor={rank.subtitle !== "Onyx" ? rank.attributes.colors[1] : "#C0A46E"} />
					</Box>
				</Grid>
			}
		</>
	);
}