import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { ViewProps } from "../Props/ViewProps";
import { SRTabs } from "../../Assets/Components/Layout/AHDrawer";
import { HaloDotAPIClip } from "../../Database/Schemas/HaloDotAPIClip";
import { ClipCard } from "./Components/ClipCard";
import { useParams } from "react-router";

import "../../Assets/Styles/Views/Clips.css";
import { Debugger } from "../../Objects/Helpers/Debugger";
import { UhOh } from "../UhOh";

export function ClipsView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, setBackgroundLoadingProgress, switchTab, updatePlayer } = props;
	const { gamertag } = useParams();
	//#endregion
	
	//#region State
	const [clips, setClips] = useState<HaloDotAPIClip[] | undefined>();
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
	 * Loads the store from HaloDotAPI
	 */
	const loadClips = useCallback(async () =>
	{
		if ((clips && clips.length > 0) || !gamertag) { return; }

		// Get the store
		const videos = await app.GetClips(gamertag);
		
		setClips(videos);

	}, [app, gamertag, clips, setClips]);

	/**
	 * Loads the data for the view
	 */
	const loadData = useCallback(async () => 
	{
		Debugger.LoadView("ClipsView");

		// Update tab
		switchTab(undefined, SRTabs.Clips);
		
		// Load and render store
		setLoadingMessage("Loading clips");
		await loadClips();

		// Clear loading messages
		clearLoadingMessages();

		// Ensure player is set
		if (gamertag)
		{
			const player = await app.GetPlayerAppearanceAndCROnly(gamertag);
			updatePlayer(gamertag, player?.appearance);
		}

	}, [app, gamertag, switchTab, loadClips, setLoadingMessage, clearLoadingMessages, updatePlayer]);
	
	useEffect(() =>
	{
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (clips && clips.length === 0) { return <UhOh primaryMessage="You don't have any clips" secondaryMessage="Head to back to search to look for a different Gamertag." switchTab={switchTab} /> }
	return (
		<Box component="main" className="pageContainer">
			<Helmet>
				<title>Spartan Record | Clips</title>
				<meta name="description" content={`Halo Infinite clips for ${gamertag ?? ""}`} />
				<meta property="og:title" content="Spartan Record" />
            	<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/clips/${gamertag}`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<Box className="underToolbarContainer">
				<Grid container spacing={2}>
					{clips && clips.map(clip => <ClipCard clip={clip} gamertag={gamertag ?? ""} />)}
				</Grid>
			</Box>
		</Box>
	);
}