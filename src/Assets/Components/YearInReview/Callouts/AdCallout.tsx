import { GridItemCentered } from "../../Common/GridItemCentered";
import { FluidAd } from "../../Ads/FluidAd";

interface AdCalloutProps
{
	isSubscribedToPatreon?: boolean;
}

/**
 * A component to wrap text around a zoom animation
 */
export function AdCallout(props: AdCalloutProps)
{
	const { isSubscribedToPatreon } = props;

	if (isSubscribedToPatreon) { return <></>; }
	return (
		<GridItemCentered>
			<FluidAd adId="4720270834" isAdFree={isSubscribedToPatreon} />
		</GridItemCentered>
	);
}