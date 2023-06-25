import { Box, Button, Divider, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { ViewProps } from "../Props/ViewProps";
import { SRTabs } from "../../Assets/Components/Layout/AHDrawer";
import { CareerRankProgression } from "../../Assets/Components/CareerRank/CareerRankProgression";

export function CareerRankView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, setBackgroundLoadingProgress, player, updatePlayer, switchTab, isAllowed } = props;
	const { gamertag } = useParams();
	//#endregion
	
	//#region State
	//#endregion

	/**
	 * Clears the loading messages
	 */
	const clearLoadingMessages = useCallback(() =>
	{
		setLoadingMessage("");
		setBackgroundLoadingProgress("");
	}, [setLoadingMessage, setBackgroundLoadingProgress]);

	/**
	 * Loads the player from firebase
	 * @returns the player object
	 */
	const loadPlayer = useCallback(async () =>
	{
		if (!gamertag) { return; }

		// Set page gamertag and show loading message
		setLoadingMessage("Loading " + gamertag);
				
		// Get the player from firebase and show on screen
		const player = await app.GetPlayerAppearanceOnly(gamertag);

		// Update state
		updatePlayer(player.gamertag, player.appearance, undefined, undefined, player.careerRank);
		
	}, [gamertag, app, setLoadingMessage, updatePlayer]);

	/**
	 * Loads the data for the view
	 */
	const loadData = useCallback(async () => 
	{		
		// Gamertag is required
		if (!gamertag) { switchTab("/", SRTabs.Search); return; }

		// Update tab
		switchTab(undefined, SRTabs.CareerRank);

		// Get player
		const firebasePlayer = await loadPlayer();

		// Clear loading messages
		clearLoadingMessages();

	}, [app, gamertag, switchTab, loadPlayer, clearLoadingMessages]);
	
	useEffect(() =>
	{
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gamertag]);

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
				{player && player.serviceRecord?.error !== undefined &&
					<Box sx={{ m: 10, color: "primary.main" }}>
						<Typography variant="h3">Couldn't load {player.gamertag}</Typography>
						<Typography variant="h6">{player.serviceRecord.error}</Typography>
						<Button sx={{ mt: 4 }} onClick={() => switchTab("/", SRTabs.Search)} variant="contained">Back to Search</Button>
					</Box>
				}
				{player && <>
					<CareerRankProgression current={player.careerRank} />
				</>}
			</Box>
		</Box>
	);
}