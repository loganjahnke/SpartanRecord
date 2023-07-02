import { Box, Checkbox, Divider, FormControlLabel, FormGroup, Grid, Toolbar, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { PlayerMatchSummary } from "../../Assets/Components/Match/PlayerMatchSummary";
import { ViewProps } from "../Props/ViewProps";
import { ServiceRecord } from "../../Objects/Model/ServiceRecord";
import { MatchesBreakdown } from "../../Assets/Components/Breakdowns/MatchesBreakdown";
import { KillDeathCard } from "../../Assets/Components/Breakdowns/KillDeathCard";
import { KDABreakdown } from "../../Assets/Components/Breakdowns/KDABreakdown";
import { PlayerMatch } from "../../Objects/Model/PlayerMatch";
import { SRTabs } from "../../Assets/Components/Layout/AHDrawer";
import { RecentMatchesChart } from "../../Assets/Components/Charts/RecentMatchesChart";
import { Helmet } from "react-helmet";
import { Cookie } from "../../Objects/Helpers/Cookie";
import { Debugger } from "../../Objects/Helpers/Debugger";

interface MultiMatchesViewProps extends ViewProps
{
	customs?: boolean;
	local?: boolean;
}

export function MultiMatchesView(props: MultiMatchesViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, setBackgroundLoadingProgress, switchTab, player, updatePlayer, isAllowed, customs, local, setApiError } = props;
	const { gamertag } = useParams();
	//#endregion
	
	//#region State
	const [matches, setMatches] = useState<PlayerMatch[]>([]);
	const [combinedSR, setCombinedSR] = useState(new ServiceRecord());
	const [loadingMore, setLoadingMore] = useState(false);
	const offset = useRef<number>(0);
	//#endregion

	/**
	 * Creates a combined service record from the matches
	 */
	const createServiceRecord = useCallback((recents: PlayerMatch[]) =>
	{
		const serviceRecord = new ServiceRecord();
		for (const match of recents) { serviceRecord.AddPlayerMatch(match); }
		setCombinedSR(serviceRecord);
	}, [setCombinedSR]);

	/**
	 * Loads the recent matches from HaloDotAPI
	 * @param append are we appending to existing data?
	 */
	const loadFromHaloDotAPI = useCallback(async (append: boolean) =>
	{
		if (!gamertag) { return; }

		// Ensure we can update from HaloDotAPI
		if (!await app.CanUpdate()) 
		{ 
			setApiError(true); 
			return;
		}
		
		// Get from HaloDotAPI
		const recent = await app.GetPlayerMatches(gamertag, 25, offset.current, customs, local);

		// Set state
		if (append) 
		{ 
			const newMatches = matches.concat(recent);
			setMatches(newMatches); 
			createServiceRecord(newMatches);
		}
		else 
		{ 
			setMatches(recent); 
			createServiceRecord(recent);
		}

	}, [app, gamertag, matches, isAllowed, customs, local, setMatches, createServiceRecord, setLoadingMessage, setBackgroundLoadingProgress]);

	/**
	 * Sets the appearance for the gamertag, if needed
	 */
	const setAppearance = useCallback(async () =>
	{
		if (!gamertag) { return; }
		if (!player || !player.appearance || !player.serviceRecord || !player.appearance.emblemURL)
		{
			const p = await app.GetPlayerFromFirebase(gamertag);
			updatePlayer(p.gamertag, p.appearance, p.serviceRecord, p.csrs);
		}
	}, [app, gamertag, player, updatePlayer]);

	/**
	 * Loads the data for the view
	 * @param append are we adding more matches to the view?
	 */
	const loadData = useCallback(async (append?: boolean) => 
	{
		Debugger.LoadView("MultiMatchesView");

		if (!gamertag) { return; }

		// Clear messages from other views
		setLoadingMessage("");
		setBackgroundLoadingProgress("");

		// Load from HaloDotAPI
		setLoadingMessage("Loading matches for " + gamertag);
		
		// Set appearance
		await setAppearance();
		
		// Get matches
		await loadFromHaloDotAPI(!!append);		
		
		// Log
		app.logger.LogViewMatches();

		// Set tab
		switchTab(undefined, customs ? SRTabs.MatchesCustoms : local ? SRTabs.MatchesLocal : SRTabs.Matches);
		
		// Clear loading messages
		setLoadingMessage("");
		setBackgroundLoadingProgress("");

	}, [app, gamertag, customs, switchTab, setLoadingMessage, setBackgroundLoadingProgress, loadFromHaloDotAPI, setAppearance]);

	const loadMore = useCallback(async () =>
	{
		offset.current += 25;

		setLoadingMore(true);
		await loadData(true);
		setLoadingMore(false);

	}, [offset, loadData]);
	
	useEffect(() =>
	{
		offset.current = 0;
		setMatches([]);
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gamertag, customs, local]);

    function goToMatch(id: string): void
    {
		if (gamertag)
		{
			switchTab(`/match/${id}/${gamertag}`, SRTabs.Matches);
		}
		else 
		{
			switchTab(`/match/${id}`, SRTabs.Matches);
		}
    }

	return (
		<Box component="main" sx={{ flexGrow: 1 }}>
			<Helmet>
				<title>{`Spartan Record | Matches | ${gamertag}`}</title>
				<meta name="description" content={`Halo Infinite matches for ${gamertag}`} />
				<meta property="og:title" content="Spartan Record" />
				<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/matches/${gamertag}`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<Box sx={{ p: 2 }}>
				<Grid container spacing={2}>
					{/* Top */}
					<Grid item xs={12} lg={4}>
						<KDABreakdown serviceRecord={combinedSR} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MatchesBreakdown serviceRecord={combinedSR} matchesPlayedTitle={`Last ${combinedSR.matchesPlayed} Matches`} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<KillDeathCard serviceRecord={combinedSR} />
					</Grid>
					<Grid item xs={12}>
						<RecentMatchesChart matches={matches} sr={player?.serviceRecord ?? new ServiceRecord()} openMatch={goToMatch} onMetricChanged={() => app.logger.LogChangeSeasonMetric()} />
					</Grid>
				</Grid>
				<Grid container spacing={2} sx={{ mt: 1 }}>
					{matches?.length > 0 ? matches.map(match => <PlayerMatchSummary match={match} player={match.expandedPlayer} goToMatch={goToMatch} gamertag={gamertag ?? ""} showExpanded hideExpected={customs || local || match.variant.name.includes("Infection")} />) : undefined}
				</Grid>
				{matches.length > 0 && <Grid item xs={12}>
					<Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 2 }}>
						<LoadingButton loading={loadingMore} variant="outlined" onClick={loadMore}>Load 25 More</LoadingButton>
					</Box>
				</Grid>}
			</Box>
		</Box>
	);
}