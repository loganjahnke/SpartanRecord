import { Ad } from "./Ad";

interface AdProps
{
	adId: string;
	isAdFree?: boolean;
}

export function VerticalAd(props: AdProps)
{
	const { adId, isAdFree } = props;
	return <Ad adId={adId} format="autorelaxed" isAdFree={isAdFree} />
}