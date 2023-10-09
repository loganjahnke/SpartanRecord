import { Box, Grid, Typography } from "@mui/material";
import { CareerRankProgressionRowTile } from "./CareerRankProgressionRowTile";
import { CareerRankProgressionProps } from "./CareerRankProps";
import { CareerRankBackground } from "../../../Objects/Helpers/AllCareerRanks";

export function CareerRankProgressionRow(props: CareerRankProgressionProps)
{
	const { allRanks, type, current, avgScore } = props;

	return (
		<Box className="progressionRow">
			<Box className="progressionRowTitleContainer">
				<Typography variant="h3" className="progressionRowTitle" sx={{
					fontSize: { lg: "24px !important", xl: "32px !important" },
					mb: { lg: "0px !important", xl: "-25px !important" },
					backgroundImage: CareerRankBackground(current)
				}}>
					{type}
				</Typography>
			</Box>
			<Grid container columns={type === "Hero" ? 1 : 44}>
				{allRanks
					.filter(rank => rank.properties.type === type)
					.filter(rank => rank.attributes.grade === 1)
					.map(rank => <CareerRankProgressionRowTile rank={rank} current={current} avgScore={avgScore} />)
				}
			</Grid>
		</Box>
	);
}