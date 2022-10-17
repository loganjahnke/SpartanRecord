import { Box, Checkbox, Divider, FormControlLabel, FormGroup, Grid, Toolbar, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { PlayerMatchSummary } from "../Assets/Components/Match/PlayerMatchSummary";
import { ViewProps } from "./Props/ViewProps";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { MatchesBreakdown } from "../Assets/Components/Breakdowns/MatchesBreakdown";
import { KillDeathCard } from "../Assets/Components/Breakdowns/KillDeathCard";
import { KDABreakdown } from "../Assets/Components/Breakdowns/KDABreakdown";
import { PlayerMatch } from "../Objects/Model/PlayerMatch";
import { SRTabs } from "../Assets/Components/Layout/AHDrawer";
import { RecentMatchesChart } from "../Assets/Components/Charts/RecentMatchesChart";
import { Helmet } from "react-helmet";
import { Cookie } from "../Objects/Helpers/Cookie";
import { RecentMatchRow } from "../Assets/Components/Match/RecentMatchRow";

export function RecentMatchesView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, switchTab, player, updatePlayer } = props;
	const { gamertag } = useParams();
	//#endregion
	
	//#region State
	const [matches, setMatches] = useState<PlayerMatch[]>([]);
	const [combinedSR, setCombinedSR] = useState(new ServiceRecord());
	const [loadingMore, setLoadingMore] = useState(false);
	const [showExpanded, setShowExpanded] = useState(Cookie.getShowExpanded());
	const offset = useRef<number>(0);
	//#endregion

	const loadData = useCallback(async (hideLoading?: boolean) => 
	{		
		// Get player's service record
		if (gamertag)
		{
			if (!hideLoading) { setLoadingMessage("Loading matches for " + gamertag); }

			const additionalMatches = await app.GetPlayerMatches(gamertag, offset.current);
			const newMatches = matches.concat(additionalMatches);
			setMatches(newMatches);

			if (!player || !player.appearance || !player.serviceRecord || !player.appearance.emblemURL)
			{
				const p = await app.GetPlayerFromFirebase(gamertag);
				updatePlayer(p.gamertag, p.appearance, p.serviceRecord, p.mmr, p.csrs);
			}

			const serviceRecord = new ServiceRecord();
			for (const match of newMatches) { serviceRecord.AddPlayerMatch(match); }

			setCombinedSR(serviceRecord);
			app.LogViewMatches(gamertag);
		}

		switchTab(undefined, SRTabs.MatchesBeta);
		if (!hideLoading) { setLoadingMessage(""); }
	}, [app, gamertag, matches, setMatches, setCombinedSR, offset, switchTab, player, updatePlayer, setLoadingMessage]);

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
	}, [gamertag]);

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

	const onPressShowExpanded = useCallback((event: React.ChangeEvent<HTMLInputElement>) =>
	{
		setShowExpanded(event.target.checked);
		Cookie.setShowExpanded(event.target.checked);
	}, [setShowExpanded]);

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
					{/* Options */}
					<Grid item xs={12}>
						<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
							<Box sx={{ flexGrow: 1 }}></Box>
							<FormGroup sx={{ textAlign: "right" }}>
								<FormControlLabel control={<Checkbox checked={showExpanded} onChange={onPressShowExpanded} size="small" />} label={<Typography variant="subtitle1">Show Expanded Statistics</Typography>} />
							</FormGroup>
						</Box>
					</Grid>
					{/* Top */}
					<Grid item xs={12} lg={4}>
						<KDABreakdown serviceRecord={combinedSR} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MatchesBreakdown serviceRecord={combinedSR} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<KillDeathCard serviceRecord={combinedSR} />
					</Grid>
					<Grid item xs={12}>
						<RecentMatchesChart matches={matches} sr={player?.serviceRecord ?? new ServiceRecord()} openMatch={goToMatch} />
					</Grid>
				</Grid>
				<Grid container spacing={2} sx={{ mt: 1 }}>
					{matches?.length > 0 ? matches.map(match => <RecentMatchRow match={match} goToMatch={goToMatch} gamertag={gamertag ?? ""} showExpanded={showExpanded} />) : undefined}
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