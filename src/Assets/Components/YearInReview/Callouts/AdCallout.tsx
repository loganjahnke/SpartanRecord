import { GridItemCentered } from "../../Common/GridItemCentered";
import { CalloutsProps } from "../Props/CalloutsProps";
import { FluidAd } from "../../Ads/FluidAd";
import { GrowBox } from "../../Animations/GrowBox";

interface AdCalloutProps extends CalloutsProps
{
	isSubscribedToPatreon?: boolean;
}

/**
 * A component to wrap text around a zoom animation
 */
export function AdCallout(props: AdCalloutProps)
{
	const { delay, isSubscribedToPatreon } = props;

	if (isSubscribedToPatreon) { return <></>; }
	return (
		<GridItemCentered>
			<GrowBox delay={delay} content={
				<FluidAd adId="4720270834" isAdFree={isSubscribedToPatreon} />
			} />
		</GridItemCentered>
	);
}