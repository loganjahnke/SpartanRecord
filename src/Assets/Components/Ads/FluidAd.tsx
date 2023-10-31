import { Ad } from "./Ad";

interface AdProps
{
	adId: string;
	isAdFree?: boolean;
}

export function FluidAd(props: AdProps)
{
	const { adId, isAdFree } = props;
	return <Ad adId={adId} format="fluid" isAdFree={isAdFree} />;
}