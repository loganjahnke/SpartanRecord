import { Typography } from "@mui/material";
import { GridItemCentered } from "../../Common/GridItemCentered";
import { CalloutsProps } from "../Props/CalloutsProps";
import { ImageCardWithContent } from "../../Cards/ImageCardWithContent";

import logo from "../../../Images/Primary/Spartan-Record-Logo-Primary-White.png";

interface WelcomeToYearInReviewProps extends CalloutsProps
{
	year?: string;
}

/**
 * A component to wrap text around a zoom animation
 */
export function WelcomeToYearInReview(props: WelcomeToYearInReviewProps)
{
	const { year } = props;

	if (year === undefined) { return <></>; }
	return (
		<GridItemCentered>
			<ImageCardWithContent autoHeight maxWidth center>
				<Typography variant="h6" sx={{ letterSpacing: "1px", mb: 1 }}>Welcome to your</Typography>
				<img src={logo} alt="Spartan Record" width="200px" />
				<Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: "1px", mt: 1 }}>{year} Year in Review</Typography>
			</ImageCardWithContent>
		</GridItemCentered>
	);
}