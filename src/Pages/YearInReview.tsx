import { Box, Button, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
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
import { GridItemCentered } from "../Assets/Components/Common/GridItemCentered";
import { SpartanRecordCallout } from "../Assets/Components/YearInReview/Callouts/SpartanRecordCallout";
import { MedalsCallout } from "../Assets/Components/YearInReview/Callouts/MedalsCallout";
import { UhOh } from "./UhOh";

export function YearInReview(props: ViewProps)
{
	//#region Props and Navigate
	const { app, player, isSubscribedToPatreon, setLoadingMessage, setBackgroundLoadingProgress, updatePlayer, switchTab } = props;
	const { year, gamertag } = useParams();
	//#endregion

	//#region State
	const [step, setStep] = useState(0);
	//#endregion

	//#region Loading
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
	const loadYearInReview = useCallback(async () =>
	{
		if (!gamertag || year === undefined) { return new Player(); }

		const yearAsNumber = parseInt(year);
		if (!yearAsNumber) { return new Player(); }

		// Set page gamertag and show loading message
		setLoadingMessage(`Loading ${year} Year in Review`);
				
		// Get player appearance and career rank
		const [player, seasonsForYear] = await Promise.all([
			app.GetPlayerAppearanceAndCROnly(gamertag),
			app.GetSeasonsForYear(yearAsNumber)
		]);
		
		// Check for all uncached 2024 seasons
		const uncachedSeasons = await app.GetUncachedHistoricSeasons(player.gamertag, seasonsForYear, yearAsNumber);

		// Get all the 2024 service records from Firebase
		const serviceRecordsForSeasonsInYear = await Promise.all(seasonsForYear.map(async (season) => {
			if (uncachedSeasons.includes(season.properties.identifier))
			{
				const srFromGruntAPI = await app.GetServiceRecordData(player.gamertag, season.properties.identifier);
				await app.SetPreviousSeasonStats(player.gamertag, season.properties.identifier, srFromGruntAPI, yearAsNumber);
				return new ServiceRecord(srFromGruntAPI, season.properties.identifier);
			}

			return app.GetServiceRecordFromFirebase(player.gamertag, season.properties.identifier, yearAsNumber);
		}));

		// Reduce into one service record
		for (const sr of serviceRecordsForSeasonsInYear)
		{
			player.serviceRecord.AddServiceRecord(sr);
		}

		// Update state
		updatePlayer(player.gamertag, player.appearance, player.serviceRecord, player.csrs, player.careerRank);
		clearLoadingMessages();

		return player;

	}, [year, gamertag, app, setLoadingMessage, clearLoadingMessages, updatePlayer]);

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
		await loadYearInReview();

		// Clear loading messages
		clearLoadingMessages();

		// Log event
		app.logger.LogYearInReview();

	}, [app, gamertag, switchTab, loadYearInReview, clearLoadingMessages]);
	
	useEffect(() =>
	{
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [year, gamertag]);
	//#endregion

	//#region Button Handlers
	/** Handler for the Next button */
	const onNext = useCallback(() =>
	{
		setStep(step + 1);
	}, [step, setStep]);

	/** Handler for the Skip to End button */
	const onSkipToEnd = useCallback(() =>
	{
		setStep(999999);
	}, [setStep]);
	//#endregion

	if (!player || !year) { return <UhOh ignoreHelmet primaryMessage="Something went wrong Spartan" secondaryMessage="Go back to search to try again" switchTab={switchTab} />; }
	if (parseInt(year) < 2024 || parseInt(year) > 2024) { return <UhOh ignoreHelmet primaryMessage={`Sneaky Spartan`} secondaryMessage={`Right now 2024 is the only Year in Review available on SpartanRecord.com`} switchTab={switchTab} /> }
	if (player?.serviceRecord.error) { return <UhOh ignoreHelmet primaryMessage={`Couldn't load ${player!.gamertag}`} secondaryMessage={player!.serviceRecord.error} switchTab={switchTab} /> }
	if (player?.serviceRecord.IsEmpty()) { return <UhOh ignoreHelmet primaryMessage={`Nothing to show for ${player!.gamertag}`} secondaryMessage={`Did you play Halo Infinite with this gamertag in ${year}? Or is this gamertag invalid?`} switchTab={switchTab} /> }

	return (
		<Box component="main" sx={{ flexGrow: 1, height: "calc(100% + 34px)", overflow: "hidden", backgroundSize: "cover", backgroundPosition: "center", backgroundImage: `url(https://blobs-infiniteugc.svc.halowaypoint.com/ugcstorage/playlist/73b48e1e-05c4-4004-927d-965549b28396/17b616fb-f128-46c9-b966-7850b38445f9/images/hero.png)` }}>
			<Helmet>
				<title>{"Spartan Record | " + gamertag}</title>
				<meta name="description" content={`Halo Infinite service record for ${gamertag}`} />
				<meta property="og:title" content="Spartan Record" />
            	<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/service_record/${gamertag}`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<Box sx={{ p: player ? 2 : 0, minHeight: "calc(100% - 96px)", maxHeight: "calc(100% - 96px)", overflow: "auto", backgroundColor: "rgba(1,64,82, 0.8)" }}>
				<Grid container spacing={2}>
					<PlayerCardCallout player={player} />
					<WelcomeToYearInReview delay="250ms" year={year} />
					{step >= 1 && <PlaytimeCallout delay="250ms" player={player} subdelay="2000ms" />}
					{step >= 2 && <MatchesCallout delay="250ms" player={player} subdelay="2000ms" />}
					{step >= 3 && <AdCallout delay="250ms" isSubscribedToPatreon={isSubscribedToPatreon} />}
					{step >= 3 && <CareerRankCallout delay="250ms" heroDelay="2000ms" heroSnarkDelay="4000ms" player={player} />}
					{step >= 4 && <KillBreakdownCallout delay="250ms" killDeathDelay="2000ms" chartDelay="5000ms" player={player} />}
					{step >= 5 && <MedalsCallout delay="250ms" bestRareMedalDelay="3000ms" rarestRareMedalDelay="6000ms" player={player} />}
					{step >= 6 && <AdCallout delay="250ms" isSubscribedToPatreon={isSubscribedToPatreon} />}
					{step >= 6 && <SpartanRecordCallout delay="250ms" patreonDelay="2000ms" player={player} isSubscribedToPatreon={isSubscribedToPatreon} switchTab={switchTab} />}
					{step < 6 &&
						<GridItemCentered>
							<Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 6 }}>
								<Button variant="contained" sx={{ mr: 1 }} onClick={onNext}>Next</Button>
								<Button variant="outlined" sx={{ ml: 1 }} onClick={onSkipToEnd}>Skip to End</Button>
							</Box>
						</GridItemCentered>
					}
				</Grid>
			</Box>
		</Box>
	);
}