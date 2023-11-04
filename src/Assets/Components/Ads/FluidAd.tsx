import { Ad } from "./Ad";

interface AdProps
{
	adId: string;
	isAdFree?: boolean;
}

export function FluidAd(props: AdProps)
{
	const { adId, isAdFree } = props;

	let layout = adId === "8600101244" ? "-ef+6k-30-ac+ty" : "-6t+ed+2i-1n-4w";
	return <Ad adId={adId} format="fluid" layout={layout} isAdFree={isAdFree} />;
}