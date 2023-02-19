import { Box, Button, Divider, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { ViewProps } from "./Props/ViewProps";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { SRTabs } from "../Assets/Components/Layout/AHDrawer";
import { ServiceRecordGrid } from "../Assets/Components/ServiceRecord/ServiceRecordGrid";

import moment from "moment";

export function DayView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, player, switchTab, isAllowed } = props;
	const { gamertag, date } = useParams();
	//#endregion
	
	//#region State
	const [serviceRecord, setServiceRecord] = useState<ServiceRecord | undefined>();
	const [showPerMatch, setShowPerMatch] = useState(false);
	const [dateObj, setDateObj] = useState(new Date(Date.now() - 86400000));
	//#endregion

	const loadData = useCallback(async () => 
	{		
		if (!gamertag) { switchTab("/", SRTabs.Search); return; }
		
		// Parse date string if passed in (yesterday is default)
		let tempDateObj = new Date(Date.now() - 86400000);
		if (date && moment(date).isValid())
		{
			tempDateObj = moment(date).toDate();
		}

		// Update state
		setDateObj(tempDateObj);

		// Set page gamertag and show loading message
		setLoadingMessage("Generating service record for " + tempDateObj.toLocaleDateString() + " for " + gamertag);
		
		// Get the matches from firebase and show on screen
		setServiceRecord(await app.GetMatchesForDay(gamertag, tempDateObj));
		setLoadingMessage("");

		switchTab(undefined, SRTabs.Yesterday);
	}, [app, gamertag, date, switchTab, setLoadingMessage, setDateObj]);
	
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
				{serviceRecord && serviceRecord.error !== undefined &&
					<Box sx={{ m: 10, color: "primary.main" }}>
						<Typography variant="h3">Couldn't load {gamertag}</Typography>
						<Typography variant="h6">{serviceRecord.error}</Typography>
						<Button sx={{ mt: 4 }} onClick={() => switchTab("/", SRTabs.Search)} variant="contained">Back to Search</Button>
					</Box>
				}
				{serviceRecord && serviceRecord.IsEmpty() &&
					<Box sx={{ m: 10, color: "primary.main" }}>
						<Typography variant="h3">Nothing to show!</Typography>
						<Typography variant="h6">No matches played on {dateObj.toLocaleDateString()} for {gamertag}</Typography>
						<Button sx={{ mt: 4 }} onClick={() => switchTab("/", SRTabs.Search)} variant="contained">Back to Search</Button>
					</Box>
				}
				{serviceRecord && <ServiceRecordGrid 
					serviceRecord={serviceRecord} 
					isAllowed={isAllowed}
					showPerMatch={showPerMatch}
					setShowPerMatch={setShowPerMatch}
					title={`${dateObj.toLocaleDateString("en-US", { 
						dateStyle: "full"
					})}`}
				/>}
			</Box>
		</Box>
	);
}