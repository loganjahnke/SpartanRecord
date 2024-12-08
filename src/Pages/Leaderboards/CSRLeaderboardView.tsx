import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { ViewProps } from "../Props/ViewProps";
import { SRTabs } from "../../Assets/Components/Layout/AHDrawer";
import { CSRLeaderRanks } from "../../Assets/Components/Ranks/LeaderRanks";
import { Debugger } from "../../Objects/Helpers/Debugger";
import { Leaderboard343 } from "../../Objects/Model/Leaderboard343";

export function CSRLeaderboardView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, switchTab } = props;
	const { playlist } = useParams();
	//#endregion
	
	//#region State
	const [leaderboard, setLeaderboard] = useState<Leaderboard343>();
	//#endregion

	const loadData = useCallback(async () => 
	{
		Debugger.LoadView("CSRLeaderboardView");

		// Set page gamertag and show loading message
		setLoadingMessage("Loading Leaderboard");
		
		// Get the player from firebase and show on screen
		setLeaderboard(await app.GetCSRLeaderboard(playlist));

		// Log leaderboard view
		app.logger.LogLeaderboard();

		setLoadingMessage("");
	}, [app, playlist, setLoadingMessage]);
	
	useEffect(() =>
	{
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playlist]);

	const goToSR = useCallback((gamertag: string) =>
	{
		switchTab("service_record/" + gamertag, SRTabs.ServiceRecord);
	}, [switchTab]);

	if (!leaderboard) { return <></>; }
	return (
		<Box component="main" className="pageContainer">
			<Helmet>
				<title>{"Spartan Record | Leaderboards"}</title>
				<meta name="description" content={`Halo Infinite leaderboards`} />
				<meta property="og:title" content="Spartan Record" />
            	<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/leaderboard`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<Box className="underToolbarContainer">
				<Grid container spacing={2}>
					{/* Top */}
					<Grid item xs={0} lg={2} />
					<Grid item xs={12} lg={8}>
						<CSRLeaderRanks leaderboard={leaderboard} playlistId={playlist} goToMember={goToSR} />
					</Grid>
					<Grid item xs={0} lg={2} />
				</Grid>
			</Box>
		</Box>
	);
}