import { Ad } from "./Ad";

interface AdProps
{
	adId: string;
	isAdFree?: boolean;
}

export function AutoAd(props: AdProps)
{
	const { adId, isAdFree } = props;
	return <Ad adId={adId} format="auto" isAdFree={isAdFree} />;
}