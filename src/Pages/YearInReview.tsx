import { Box, Button, Divider, Grid, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { ViewProps } from "./Props/ViewProps";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { SRTabs } from "../Assets/Components/Layout/AHDrawer";
import { Player } from "../Objects/Model/Player";
import { Debugger } from "../Objects/Helpers/Debugger";
import { WelcomeToYearInReview } from "../Assets/Components/YearInReview/Callouts/WelcomeToYearInReview";
import { PlaytimeCallout } from "../Assets/Components/YearInReview/Callouts/PlaytimeCallout";
import { MatchesCallout } from "../Assets/Components/YearInReview/Callouts/MatchesCallout";
import { AdCallout } from "../Assets/Components/YearInReview/Callouts/AdCallout";
import { PlayerCardCallout } from "../Assets/Components/YearInReview/Callouts/PlayerCardCallout";
import { CareerRankCallout } from "../Assets/Components/YearInReview/Callouts/CareerRankCallout";
import { KillBreakdownCallout } from "../Assets/Components/YearInReview/Callouts/KillBreakdownCallout";

export function YearInReview(props: ViewProps)
{
	//#region Props and Navigate
	const { app, player, isSubscribedToPatreon, setLoadingMessage, setBackgroundLoadingProgress, updatePlayer, switchTab } = props;
	const { gamertag } = useParams();
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
	const load2024 = useCallback(async () =>
	{
		if (!gamertag) { return new Player(); }

		// Set page gamertag and show loading message
		setLoadingMessage("Loading 2024 Year in Review");
				
		// Get player appearance and career rank
		const [player, seasons2024] = await Promise.all([
			app.GetPlayerAppearanceAndCROnly(gamertag),
			app.Get2024Seasons()
		]);
		
		// Check for all uncached 2024 seasons
		const uncachedSeasons = await app.GetUncachedHistoricSeasons(player.gamertag, seasons2024, 2024);

		// Get all the 2024 service records from Firebase
		const serviceRecords2024 = await Promise.all(seasons2024.map(async (season) => {
			if (uncachedSeasons.includes(season.properties.identifier))
			{
				const srFromGruntAPI = await app.GetServiceRecordData(player.gamertag, season.properties.identifier);
				await app.SetPreviousSeasonStats(player.gamertag, season.properties.identifier, srFromGruntAPI, 2024);
				return new ServiceRecord(srFromGruntAPI, season.properties.identifier);
			}

			return app.GetServiceRecordFromFirebase(player.gamertag, season.properties.identifier, 2024);
		}));

		// Reduce into one service record
		for (const sr of serviceRecords2024)
		{
			player.serviceRecord.AddServiceRecord(sr);
		}

		// Update state
		updatePlayer(player.gamertag, player.appearance, player.serviceRecord, player.csrs, player.careerRank);
		clearLoadingMessages();

		return player;

	}, [gamertag, app, setLoadingMessage, setBackgroundLoadingProgress, clearLoadingMessages, updatePlayer]);

	/**
	 * Loads the data for the view
	 */
	const loadData = useCallback(async () => 
	{		
		Debugger.LoadView("YearInReview");

		// Gamertag is required
		if (!gamertag) { switchTab("/", SRTabs.Search); return; }

		// Update tab
		switchTab(undefined, SRTabs.YearInReview);

		// Get from firebase
		await load2024();

		// Clear loading messages
		clearLoadingMessages();

		// Log event
		app.logger.LogYearInReview();

	}, [app, gamertag, switchTab, load2024, clearLoadingMessages]);
	
	useEffect(() =>
	{
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gamertag]);

	if (!player) { <></>; }
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
				{player!.serviceRecord?.error !== undefined &&
					<Box sx={{ m: 10, color: "primary.main" }}>
						<Typography variant="h3">Couldn't load {player!.gamertag}</Typography>
						<Typography variant="h6">{player!.serviceRecord.error}</Typography>
						<Button sx={{ mt: 4 }} onClick={() => switchTab("/", SRTabs.Search)} variant="contained">Back to Search</Button>
					</Box>
				}
				<Grid container spacing={2}>
					<PlayerCardCallout player={player} />
					<WelcomeToYearInReview delay="250ms" />
					<PlaytimeCallout player={player} delay="3000ms" subdelay="5000ms" />
					<MatchesCallout player={player} delay="8000ms" subdelay="10000ms" />
					<AdCallout delay="12000ms" isSubscribedToPatreon={isSubscribedToPatreon} />
					<CareerRankCallout delay="15000ms" player={player} />
					<KillBreakdownCallout delay="20000ms" killDeathDelay="22500ms" chartDelay="27500ms" player={player} />
				</Grid>
			</Box>
		</Box>
	);
}