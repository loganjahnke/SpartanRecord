import { Typography } from "@mui/material";
import { GridItemCentered } from "../../Common/GridItemCentered";
import { CalloutsProps } from "../Props/CalloutsProps";
import { Zoomer } from "../Zoomer";

interface WelcomeToYearInReviewProps extends CalloutsProps
{
	
}

/**
 * A component to wrap text around a zoom animation
 */
export function WelcomeToYearInReview(props: WelcomeToYearInReviewProps)
{
	const { delay } = props;

	return (
		<GridItemCentered>
			<Zoomer delay={delay} zoom content={
				<>
					<Typography variant="h6" sx={{ letterSpacing: "1px" }}>Welcome to your</Typography>
					<Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: "1px" }}>2024 Year in Review</Typography>
				</>
			} />
		</GridItemCentered>
	);
}