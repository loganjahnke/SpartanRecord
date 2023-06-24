import { Box } from "@mui/material";
import { TitleCard } from "../Cards/TitleCard";
import { CareerRankSchema, EmptyCareerRank } from "../../../Database/Schemas/CareerRankSchema";
import { CareerRankTile } from "./CareerRankTile";

export function CareerRankBreakdown(props: { careerRank?: CareerRankSchema })
{
	const { careerRank } = props;

	return (
		<TitleCard title="Career Rank">
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
				<CareerRankTile rank={careerRank ?? EmptyCareerRank()} />
			</Box>
		</TitleCard>
	);
}