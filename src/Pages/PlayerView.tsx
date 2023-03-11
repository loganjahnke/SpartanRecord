import { Box, Button, Divider, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { ViewProps } from "./Props/ViewProps";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { Cookie } from "../Objects/Helpers/Cookie";
import { SRTabs } from "../Assets/Components/Layout/AHDrawer";
import { ServiceRecordGrid } from "../Assets/Components/ServiceRecord/ServiceRecordGrid";
import { SR } from "../Objects/Helpers/Statics/SR";
import { Player } from "../Objects/Model/Player";
import { Debugger } from "../Objects/Helpers/Debugger";

export function PlayerView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, setBackgroundLoadingProgress, player, updatePlayer, switchTab, isAllowed } = props;
	const { gamertag } = useParams();
	//#endregion
	
	//#region State
	const [historicStats, setHistoricStats] = useState<ServiceRecord[]>([]);
	const [showPerMatch, setShowPerMatch] = useState(false);
	const [season, setSeason] = useState(-1);
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
		const player = await app.GetPlayerFromFirebase(gamertag, season, true);

		// Update state
		updatePlayer(player.gamertag, player.appearance, player.serviceRecord, player.csrs);
		setHistoricStats(player.historicStats ?? [new ServiceRecord(), new ServiceRecord(), new ServiceRecord()]);

		return player;

	}, [gamertag, app, season, setLoadingMessage, updatePlayer, setHistoricStats]);

	/**
	 * Loads the player from HaloDotAPI
	 * @param currSR the current service record from Firebase
	 */
	const loadFromHaloDotAPI = useCallback(async (currSR: ServiceRecord) =>
	{
		// If we are already syncing this gamertag, quit early
		if (!gamertag || app.IsSyncing(gamertag)) 
		{ 
			clearLoadingMessages(); 
			return; 
		}

		// If we already have this data, don't bother reloading from HaloDotAPI
		if (season !== undefined && season !== -1 && season < SR.Season && await app.DoesPlayerHavePrevSeasons(gamertag))
		{ 
			clearLoadingMessages();
			return; 
		}

		// Show background loading message
		setLoadingMessage("");
		setBackgroundLoadingProgress(SR.DefaultLoading);

		// Otherwise get latest data from HaloDotAPI
		app.AddToSyncing(gamertag);

		// Get updated player
		const haloDotAPIPlayer = await app.GetPlayerFromHaloDotAPI(gamertag, season);
		if (!haloDotAPIPlayer) 
		{
			clearLoadingMessages();
			app.RemoveFromSyncing(gamertag);
			return;
		}

		// Update state
		updatePlayer(haloDotAPIPlayer.gamertag, haloDotAPIPlayer.appearance, haloDotAPIPlayer.serviceRecord, haloDotAPIPlayer.csrs, haloDotAPIPlayer.isPrivate);

		// Store into Firebase
		await app.SetPlayerIntoFirebase(haloDotAPIPlayer, season, currSR);

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

	}, [gamertag, app, season, setLoadingMessage, updatePlayer, setBackgroundLoadingProgress, clearLoadingMessages]);

	/**
	 * Loads historic season statistics
	 */
	const loadHistoricStatistics = useCallback(async (currHistoricStats?: ServiceRecord[]) =>
	{
		// If we are already syncing this gamertag, quit early
		if (!gamertag || (season !== undefined && season !== -1)) 
		{ 
			clearLoadingMessages();
			return; 
		}

		// Update loading message
		setBackgroundLoadingProgress("Loading historic statistics");

		// Only update current season since we have the previous ones
		if (currHistoricStats && currHistoricStats.length > 0 && await app.DoesPlayerHavePrevSeasons(gamertag))
		{
			Debugger.Simple("PlayerView", "loadHistoricStatistics()", "Previous statistics already cached");

			// Add old ones, remove newest one
			const prevSRs = Array.from(currHistoricStats);
			prevSRs.pop();

			// Get data from HaloDotAPI, update Firebase
			const sr = await app.GetServiceRecordData(gamertag, SR.Season);
			await app.SetPreviousSeasonStats(gamertag, SR.Season, sr);

			// Add to prevSRs
			prevSRs.push(new ServiceRecord(sr));

			// Update state
			setHistoricStats(prevSRs);
			clearLoadingMessages();
			return;
		}

		// Loop through all old seasons if we don't have this cached in Firebase
		const prevSRs = [];
		for (let i = 1; i <= SR.Season; i++)
		{
			Debugger.Simple("PlayerView", "loadHistoricStatistics()", "Getting season " + i + " from HaloDotAPI");

			const sr = await app.GetServiceRecordData(gamertag, i);
			await app.SetPreviousSeasonStats(gamertag, i, sr);
			prevSRs.push(new ServiceRecord(sr));
		}
		
		// Show background loading message
		setHistoricStats(prevSRs);
		clearLoadingMessages();

	}, [gamertag, app, season, setBackgroundLoadingProgress, setHistoricStats, clearLoadingMessages]);

	/**
	 * Loads the data for the view
	 */
	const loadData = useCallback(async () => 
	{		
		// Gamertag is required
		if (!gamertag) { switchTab("/", SRTabs.Search); return; }

		// Update tab
		switchTab(undefined, SRTabs.ServiceRecord);

		// Get from firebase
		const firebasePlayer = await loadFromFirebase();

		// Load from HaloDotAPI
		if (await loadFromHaloDotAPI(firebasePlayer.serviceRecord))
		{
			// Update historic statistics
			await loadHistoricStatistics(firebasePlayer.historicStats);
		}

		// Clear loading messages
		clearLoadingMessages();

		// Log event
		app.logger.LogViewServiceRecord();

	}, [app, gamertag, switchTab, loadFromFirebase, loadFromHaloDotAPI, loadHistoricStatistics, clearLoadingMessages]);
	
	useEffect(() =>
	{
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gamertag, season]);

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
				{player && <ServiceRecordGrid 
					serviceRecord={player.serviceRecord} 
					isAllowed={isAllowed}
					csrs={player.csrs}
					historicStats={historicStats}
					showPerMatch={showPerMatch}
					setSeason={setSeason}
					setShowPerMatch={setShowPerMatch}
					season={season}
					onMetricChanged={() => app.logger.LogChangeSeasonMetric()} 
				/>}
			</Box>
		</Box>
	);
}