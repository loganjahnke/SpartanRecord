import { useEffect, useRef } from "react";
import { Debugger } from "../../../Objects/Helpers/Debugger";

interface AdProps
{
	adId: string;
	format: string;
	layout?: string;
	isAdFree?: boolean;
}

export function Ad(props: AdProps)
{
	const { adId, format, layout, isAdFree } = props;

	const adDisplayedRef = useRef<boolean>(isAdFree ?? false);

	useEffect(() =>
	{
		const pushAd = () => 
		{
			if (adDisplayedRef.current) { return; }

			try 
			{				
				const adsbygoogle = (window as any).adsbygoogle;
				adsbygoogle.push({});
				adDisplayedRef.current = true;
			} 
			catch (e) 
			{
				Debugger.AxiosError("Ads", e);
			}
		}
	  
		let interval = setInterval(() => 
		{
			if ((window as any).adsbygoogle) 
			{
				pushAd();
				clearInterval(interval);
			}
		}, 300)
	  
		return () => 
		{
			clearInterval(interval)
		}
	}, []);

	if (isAdFree) { return <></>; }
	return (
		<ins className="adsbygoogle"
			style={{ display: "block" }}
			data-ad-client="ca-pub-1147948296547143"
			data-ad-slot={adId}
			data-ad-format={format}
			data-ad-layout-key={layout ?? ""}
			data-full-width-responsive={format === "auto" ? "true" : ""}></ins>
	);
}