import { Box, Divider, Grid, Toolbar, Typography } from "@mui/material";
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
import { Debugger } from "../../Objects/Helpers/Debugger";
import { HaloDotAPIPlaylist } from "../../Database/Schemas/AutocodeMetadata";
import { PlaylistChooser } from "../../Assets/Components/Playlists/PlaylistChooser";
import { Grow } from "../../Assets/Components/Common/Grow";
import { FluidAd } from "../../Assets/Components/Ads/FluidAd";

interface MultiMatchesViewProps extends ViewProps
{
	customs?: boolean;
	local?: boolean;
}

export function MultiMatchesView(props: MultiMatchesViewProps)
{
	//#region Props and Navigate
	const { app, isSubscribedToPatreon, player, customs, local, setLoadingMessage, setBackgroundLoadingProgress, switchTab, updatePlayer, setApiError } = props;
	const { gamertag } = useParams();
	//#endregion
	
	//#region State
	const [matches, setMatches] = useState<PlayerMatch[]>([]);
	const [matchesToShow, setMatchesToShow] = useState<PlayerMatch[]>([]);
	const [combinedSR, setCombinedSR] = useState(new ServiceRecord());
	const [loadingMore, setLoadingMore] = useState(false);
	const [playlists, setPlaylists] = useState<HaloDotAPIPlaylist[]>([]);
	const [selectedPlaylist, setSelectedPlaylist] = useState("");
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
	 * Loads the playlists and filters them to just the active ones
	 */
	const loadActivePlaylists = useCallback(async () =>
	{
		const allPlaylists = await app.GetPlaylists();
		const filtered = allPlaylists.filter(playlist => playlist.attributes.active);
		setPlaylists(filtered);
	}, [app, setPlaylists]);

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
			return newMatches; 
		}
		
		return recent;

	}, [app, matches, gamertag, customs, local, setApiError]);

	/**
	 * Sets the appearance for the gamertag, if needed
	 */
	const setAppearance = useCallback(async () =>
	{
		if (!gamertag) { return; }
		if (!player || !player.appearance || !player.serviceRecord || !player.appearance.emblemURL)
		{
			const p = await app.GetPlayerAppearanceOnly(gamertag);
			updatePlayer(p.gamertag, p.appearance, p.serviceRecord, p.csrs);
		}
	}, [app, gamertag, player, updatePlayer]);

	/**
	 * Calculate the matches and service record to show to the user
	 * @param playlist the name of the playlist to filter to
	 */
	const calculateMatchesToShow = useCallback((allMatches: PlayerMatch[], playlist: string) =>
	{
		setMatches(allMatches);

		if (playlist === "" || playlist === "All")
		{
			setMatchesToShow(allMatches);
			createServiceRecord(allMatches);
			return;
		}

		if (playlist.includes("Ranked Arena")) { playlist = "Ranked Arena"; }

		const filtered = allMatches.filter(match => playlist === match.playlist.name);
		setMatchesToShow(filtered);
		createServiceRecord(filtered);

	}, [createServiceRecord, setMatchesToShow]);

	/**
	 * Handler for when the playlist changes
	 * @param newPlaylist the new playlist name
	 */
	const onPlaylistChanged = useCallback(async (newPlaylist: string) =>
	{
		setSelectedPlaylist(newPlaylist);
		calculateMatchesToShow(matches, newPlaylist);
	}, [matches, setSelectedPlaylist, calculateMatchesToShow]);	

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

		// Load playlists
		const [allMatches] = await Promise.all([
			loadFromHaloDotAPI(!!append),
			loadActivePlaylists(),
			setAppearance(),
		]);

		// Filter down, if appropriate
		calculateMatchesToShow(allMatches ?? [], selectedPlaylist);
		
		// Log
		app.logger.LogViewMatches();

		// Set tab
		switchTab(undefined, customs ? SRTabs.MatchesCustoms : local ? SRTabs.MatchesLocal : SRTabs.Matches);
		
		// Clear loading messages
		setLoadingMessage("");
		setBackgroundLoadingProgress("");

	}, [app, gamertag, customs, selectedPlaylist, local, switchTab, setLoadingMessage, setBackgroundLoadingProgress, loadFromHaloDotAPI, setAppearance, calculateMatchesToShow, loadActivePlaylists]);

	/**
	 * Tell the API to load more matches
	 */
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
		setMatchesToShow([]);
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gamertag, customs, local]);

	/**
	 * Navigate to the match
	 * @param id the match ID
	 */
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
					<Grid item xs={12}>
						<Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "baseline" }}>
							<PlaylistChooser playlists={playlists} playlist={selectedPlaylist} setPlaylist={onPlaylistChanged} />
							<Grow />
							{selectedPlaylist !== "" && <Typography variant="subtitle1">{`Showing ${matchesToShow.length} of ${matches.length} loaded matches`}</Typography>}
						</Box>
					</Grid>
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
						<RecentMatchesChart matches={matchesToShow} sr={player?.serviceRecord ?? new ServiceRecord()} openMatch={goToMatch} />
					</Grid>
				</Grid>
				<Grid container spacing={2} sx={{ mt: 1 }}>
					{matchesToShow && matchesToShow.length > 0 && matchesToShow.map((match, index) => (
						<>
							{!isSubscribedToPatreon && index % 5 === 0 && <>
								<Grid item xs={12} sx={{ display: { md: "none" }}}><FluidAd adId="4720270834" isAdFree={isSubscribedToPatreon} /></Grid>
								<Grid item xs={0} md={6} lg={4} xl={3} sx={{ maxHeight: "1025px" }}><FluidAd adId="4720270834" isAdFree={isSubscribedToPatreon} /><Box sx={{ mt: 2 }} /><FluidAd adId="4720270834" isAdFree={isSubscribedToPatreon} /></Grid>
							</>}
							<PlayerMatchSummary key={match.id} match={match} player={match.expandedPlayer} goToMatch={goToMatch} gamertag={gamertag ?? ""} showExpanded hideExpected={customs || local || match.variant.name.includes("Infection")} />
						</>
					))}
				</Grid>
				{matches.length > 0 && <Grid item xs={12}>
					<Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 2 }}>
						<LoadingButton loading={loadingMore} variant="outlined" onClick={loadMore}>Load More</LoadingButton>
					</Box>
				</Grid>}
			</Box>
		</Box>
	);
}