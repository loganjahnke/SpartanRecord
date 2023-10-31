import { useEffect } from "react";
import { Debugger } from "../../../Objects/Helpers/Debugger";

interface AdProps
{
	adId: string;
}

export function AutoAd(props: AdProps)
{
	const { adId } = props;

	useEffect(() =>
	{
		const pushAd = () => 
		{
			try 
			{
				const adsbygoogle = (window as any).adsbygoogle;
				adsbygoogle.push({})
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

	return (
		<ins className="adsbygoogle"
			style={{ display: "block" }}
			data-ad-client="ca-pub-1147948296547143"
			data-ad-slot={adId}
			data-ad-format="auto"
			data-full-width-responsive="true"></ins>
	);
}