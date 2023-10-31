import { Box, Typography } from "@mui/material";
import { CareerRankTileProps } from "./CareerRankProps";

import "../../Styles/Components/CareerRankProgression.css";

export function CareerRankProgressionColumnTile(props: CareerRankTileProps)
{
	const { rank, current, avgScore } = props;

	const colorA = rank.attributes.colors[0] + "15";
	const colorB = rank.attributes.colors[1] + "15";

	const isCurrent = rank.title + rank.subtitle === current.data.current.title + current.data.current.subtitle;
	const xpToRank = rank.properties.threshold - current.data.level.total_xp;

	return (
		<Box>
			<Box 
				className="progressionRankGridItemImageColumn" 
				sx={{ 
					marginLeft: isCurrent ? "0px" : "4px",
					borderLeft: isCurrent ? "4px solid" : "",
					borderRight: isCurrent ? "4px solid" : "",
					borderColor: rank.attributes.colors[1] + " !important",
					background: `linear-gradient(to left, transparent 0%, ${colorA} 25%, ${colorB} 50%, ${colorA} 75%, transparent 100%)` 
				}}
			>
				<img className="progressionColImg" alt={rank.title + " " + rank.subtitle} src={rank.image_urls.icon} height="72px" title={rank.title + " " + rank.subtitle} />
				<Box className="rankColLabelValues">
					<Typography className="rankColTitle">{rank.title}</Typography>
					<Typography className="rankColTitle">{rank.properties.threshold.toLocaleString()} xp</Typography>
					{xpToRank > 0 && <Typography className="rankColTitle rankNoUppercase"><span className="rankColExpected">Expected games to rank:</span> {Math.ceil(xpToRank / avgScore).toLocaleString()}</Typography>}
				</Box>
			</Box>
		</Box>
	);
}