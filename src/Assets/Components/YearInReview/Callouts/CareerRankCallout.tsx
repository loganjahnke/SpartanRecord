import { Box, Typography } from "@mui/material";
import { GridItemCentered } from "../../Common/GridItemCentered";
import { CalloutsProps } from "../Props/CalloutsProps";
import { Zoomer } from "../Zoomer";
import { LifetimeRank } from "../../../../Objects/Helpers/AllCareerRanks";
import { EmptyCareerRank } from "../../../../Database/Schemas/CareerRankSchema";
import { CareerRankTile } from "../../CareerRank/CareerRankTile";

interface CareerRankCalloutProps extends CalloutsProps
{
	
}

/**
 * A component to wrap text around a zoom animation
 */
export function CareerRankCallout(props: CareerRankCalloutProps)
{
	const { delay, player } = props;

	if (!player) { return <></>; }

	const careerRankForTheYear = LifetimeRank(player.serviceRecord);

	return (
		<GridItemCentered>
			<Zoomer delay={delay} zoom content={
				<>
					<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
						<CareerRankTile rank={careerRankForTheYear ?? EmptyCareerRank()} hideBottomRow ultraLarge />
					</Box>
					<Typography>You got enough experience this year alone to get to <Typography component="span" variant="h5" sx={{ fontWeight: 600 }}>{careerRankForTheYear.data.current.subtitle}</Typography> career rank!</Typography>
				</>
			} />
		</GridItemCentered>
	);
}