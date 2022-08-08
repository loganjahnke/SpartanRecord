import { Box, Divider, Toolbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { ViewProps } from "./Props/ViewProps";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { SRTabs } from "../Assets/Components/Layout/AHDrawer";
import { ServiceRecordGrid } from "../Assets/Components/ServiceRecord/ServiceRecordGrid";
import { AutocodeHelpers } from "../Database/Schemas/AutocodeHelpers";
import { AutocodeMultiplayerServiceRecord } from "../Database/Schemas/AutocodeMultiplayerServiceRecord";
import moment from "moment";

export function DayView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, setBackgroundLoadingProgress, player, updatePlayer, switchTab, isAllowed } = props;
	const { gamertag, date } = useParams();
	//#endregion
	
	//#region State
	const [serviceRecord, setServiceRecord] = useState<ServiceRecord>(new ServiceRecord());
	const [showPerMatch, setShowPerMatch] = useState(false);
	//#endregion

	const loadData = useCallback(async () => 
	{		
		if (!gamertag) { switchTab("/", SRTabs.Search); return; }

		// Set page gamertag and show loading message
		setLoadingMessage("Loading " + gamertag);

		// Parse date string if passed in
		let dateObj = new Date();
		if (date && moment(date).isValid())
		{
			dateObj = moment(date).toDate();
		}
		
		// Get the matches from firebase and show on screen
		setServiceRecord(await app.GetMatchesForDay(gamertag, dateObj));
		setLoadingMessage("");

		switchTab(undefined, SRTabs.ServiceRecord);
	}, [app, gamertag, updatePlayer, setBackgroundLoadingProgress, switchTab, isAllowed, setLoadingMessage, date]);
	
	useEffect(() =>
	{
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gamertag, date]);

	return (
		<Box component="main" sx={{ flexGrow: 1 }}>
			<Helmet>
				<title>{"Spartan Record | " + gamertag}</title>
				<meta name="description" content={`Halo Infinite service record for ${gamertag}`} />
				<meta property="og:title" content="Spartan Record" />
            	<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/service_record/${gamertag}`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<Box sx={{ p: player ? 2 : 0, height: "calc(100% - 64px)" }}>
				{serviceRecord && <ServiceRecordGrid 
					serviceRecord={serviceRecord} 
					isAllowed={isAllowed}
					showPerMatch={showPerMatch}
					setShowPerMatch={setShowPerMatch} />}
			</Box>
		</Box>
	);
}