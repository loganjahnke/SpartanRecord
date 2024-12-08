import { Box, Divider, Toolbar } from "@mui/material";
import { useCallback, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { ViewProps } from "../Props/ViewProps";
import { SRTabs } from "../../Assets/Components/Layout/AHDrawer";
import { CareerRankProgression } from "../../Assets/Components/CareerRank/CareerRankProgression";
import { Player } from "../../Objects/Model/Player";
import { SR } from "../../Objects/Helpers/Statics/SR";
import { Cookie } from "../../Objects/Helpers/Cookie";
import { Debugger } from "../../Objects/Helpers/Debugger";
import { UhOh } from "../UhOh";

export function CareerRankView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, player, isSubscribedToPatreon, setLoadingMessage, setBackgroundLoadingProgress, updatePlayer, switchTab, setApiError } = props;
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
	const loadFromFirebase = useCallback(async () =>
	{
		if (!gamertag) { return new Player(); }

		// Set page gamertag and show loading message
		setLoadingMessage("Loading " + gamertag);
				
		// Get the player from firebase and show on screen
		const firebasePlayer = await app.GetPlayerFromFirebase(gamertag);

		// Update state
		updatePlayer(firebasePlayer.gamertag, firebasePlayer.appearance, firebasePlayer.serviceRecord, firebasePlayer.csrs, firebasePlayer.careerRank);

		return firebasePlayer;

	}, [gamertag, app, setLoadingMessage, updatePlayer]);

	/**
	 * Loads the player from HaloDotAPI
	 * @param currSR the current service record from Firebase
	 */
	const loadFromHaloDotAPI = useCallback(async (firebasePlayer: Player) =>
	{
		// If we are already syncing this gamertag, quit early
		if (!gamertag || app.IsSyncing(gamertag)) 
		{ 
			clearLoadingMessages(); 
			return; 
		}

		// Ensure we can update from HaloDotAPI
		if (!await app.CanUpdate())
		{
			setApiError(true);
			if (firebasePlayer.serviceRecord.IsEmpty())
			{
				firebasePlayer.serviceRecord.error = "Cannot load data, try again later.";
				updatePlayer(gamertag, undefined, firebasePlayer.serviceRecord);
			}
			return false;
		}

		// Show background loading message
		setLoadingMessage("");
		setBackgroundLoadingProgress(SR.DefaultLoading);

		// Otherwise get latest data from HaloDotAPI
		app.AddToSyncing(gamertag);

		// Get updated player
		const haloDotAPIPlayer = await app.GetPlayerFromHaloDotAPI(gamertag, undefined, firebasePlayer.serviceRecord);
		if (!haloDotAPIPlayer || !haloDotAPIPlayer.serviceRecord || haloDotAPIPlayer.serviceRecord.IsEmpty()) 
		{
			clearLoadingMessages();
			app.RemoveFromSyncing(gamertag);

			if (firebasePlayer.serviceRecord.IsEmpty())
			{
				firebasePlayer.serviceRecord.error = "Cannot load data, try again later.";
				updatePlayer(gamertag, undefined, firebasePlayer.serviceRecord);
			}

			return;
		}

		// Error checking
		if (firebasePlayer.serviceRecord.IsEmpty() && haloDotAPIPlayer.serviceRecord.IsEmpty())
		{
			firebasePlayer.serviceRecord.error = "Cannot load data, try again later.";
			updatePlayer(gamertag, undefined, firebasePlayer.serviceRecord);
			return false;
		}

		// Update state
		updatePlayer(haloDotAPIPlayer.gamertag, haloDotAPIPlayer.appearance, haloDotAPIPlayer.serviceRecord, haloDotAPIPlayer.csrs, haloDotAPIPlayer.careerRank, haloDotAPIPlayer.isPrivate, firebasePlayer);

		// Store into Firebase
		await app.SetPlayerIntoFirebase(haloDotAPIPlayer, undefined, firebasePlayer.serviceRecord);

		// Check if HaloDotAPI automatically corrected the gamertag
		// Make sure we point Firebase to the right gamertag
		if (haloDotAPIPlayer.gamertag !== gamertag)
		{
			await app.UpdateGamertagReference(haloDotAPIPlayer.gamertag, gamertag);
		}

		// Remove from syncing tracker
		app.RemoveFromSyncing(gamertag);

		// Add to recent players cookie
		if (haloDotAPIPlayer.serviceRecordData && !(haloDotAPIPlayer.serviceRecordData as any).error) { Cookie.addRecent(haloDotAPIPlayer.gamertag); }

		return haloDotAPIPlayer.serviceRecordData && !(haloDotAPIPlayer.serviceRecordData as any).error;

	}, [gamertag, app, setLoadingMessage, updatePlayer, setBackgroundLoadingProgress, clearLoadingMessages, setApiError]);

	/**
	 * Loads the data for the view
	 */
	const loadData = useCallback(async () => 
	{		
		Debugger.LoadView("CareerRankView");

		// Gamertag is required
		if (!gamertag) { switchTab("/", SRTabs.Search); return; }

		// Update tab
		switchTab(undefined, SRTabs.CareerRank);

		// Get from firebase
		const firebasePlayer = await loadFromFirebase();

		// Load from HaloDotAPI
		await loadFromHaloDotAPI(firebasePlayer);

		// Clear loading messages
		clearLoadingMessages();

		// Log
		app.logger.LogCareerRank();

	}, [app, gamertag, switchTab, loadFromFirebase, loadFromHaloDotAPI, clearLoadingMessages]);
	
	useEffect(() =>
	{
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gamertag]);

	if (player && player.serviceRecord?.error) { return <UhOh ignoreHelmet primaryMessage={`Couldn't load ${player!.gamertag}`} secondaryMessage={player!.serviceRecord.error} switchTab={switchTab} /> }
	return (
		<Box component="main" className="pageContainer">
			<Helmet>
				<title>{"Spartan Record | Career Rank"}</title>
				<meta name="description" content={`Halo Infinite Career Rank for ${gamertag}`} />
				<meta property="og:title" content="Spartan Record" />
            	<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/career_rank/${gamertag}`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<Box className="underToolbarContainer">
				{player && <CareerRankProgression current={player.careerRank} serviceRecord={player.serviceRecord} isSubscribedToPatreon={isSubscribedToPatreon} />}
			</Box>
		</Box>
	);
}