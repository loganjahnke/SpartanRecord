import { Box, Button, Divider, Grid, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ServiceRecordFilters } from "../Assets/Components/ServiceRecord/ServiceRecordFilters";
import { ViewProps } from "./Props/ViewProps";
import { Cookie } from "../Objects/Helpers/Cookie";
import { SeasonChooser } from "../Assets/Components/ServiceRecord/SeasonChooser";
import { CaptureTheFlagBreakdown } from "../Assets/Components/Breakdowns/CaptureTheFlagBreakdown";
import { ZoneBreakdown } from "../Assets/Components/Breakdowns/ZoneBreakdown";
import { StockpileBreakdown } from "../Assets/Components/Breakdowns/StockpileBreakdown";
import { OddballBreakdown } from "../Assets/Components/Breakdowns/OddballBreakdown";
import { EliminationBreakdown } from "../Assets/Components/Breakdowns/EliminationBreakdown";
import { SRTabs } from "../Assets/Components/Layout/AHDrawer";
import { Helmet } from "react-helmet";
import { HaloDotAPISeason } from "../Database/Schemas/AutocodeMetadata";
import { Debugger } from "../Objects/Helpers/Debugger";

export function ModesView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, player, updatePlayer, switchTab } = props;
	const { gamertag } = useParams();
	//#endregion
	
	//#region State
	const [showPerMatch, setShowPerMatch] = useState(false);
	const [season, setSeason] = useState("");
	const [seasons, setSeasons] = useState<HaloDotAPISeason[]>([]);
	//#endregion

	//useScript("//pl17321505.safestgatetocontent.com/a7b55266c8d1e7c39ed0ac2f85cf49fa/invoke.js");

	const loadData = useCallback(async () => 
	{		
		Debugger.LoadView("ModesView");

		if (!gamertag) { switchTab("/", SRTabs.Search); return; }

		// Set page gamertag and show loading message
		setLoadingMessage("Loading " + gamertag);
		Cookie.addRecent(gamertag);

		// Load available seasons
		if (!seasons || seasons.length === 0) 
		{ 
			const allSeasons = await app.GetSeasons();
			setSeasons(allSeasons);
		}
		
		// Get the player from firebase and show on screen
		const player = await app.GetPlayerFromFirebase(gamertag, season);
		updatePlayer(player.gamertag, player.appearance, player.serviceRecord);
		
		switchTab(undefined, SRTabs.Modes);
		setLoadingMessage("");
	}, [app, gamertag, season, seasons, updatePlayer, setSeasons, switchTab, setLoadingMessage]);
	
	useEffect(() =>
	{
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gamertag, season]);

	return (
		<Box component="main" sx={{ flexGrow: 1 }}>
			<Helmet>
				<title>{`Spartan Record | Modes | ${gamertag}`}</title>
				<meta name="description" content={`Halo Infinite mode statistics for ${gamertag}`} />
				<meta property="og:title" content="Spartan Record" />
				<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/modes/${gamertag}`} />
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
				{player && player.serviceRecord?.error === undefined &&
					<Grid container spacing={2}>
						{/* Top */}
						<Grid item xs={12}>
							<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
								<SeasonChooser season={season} seasons={seasons} setSeason={setSeason} />
								<Box sx={{ flexGrow: 1 }}></Box>
								<ServiceRecordFilters setPerMatch={setShowPerMatch} />
							</Box>
						</Grid>
						{/* left */}
						<Grid container item spacing={2} sm={12} md={6} xl={4} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<CaptureTheFlagBreakdown serviceRecord={player.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<EliminationBreakdown serviceRecord={player.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
						</Grid>
						{/* middle */}
						<Grid container item spacing={2} sm={12} md={6} xl={4} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<ZoneBreakdown serviceRecord={player.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<StockpileBreakdown serviceRecord={player.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
						</Grid>
						{/* right */}
						<Grid container item spacing={2} sm={12} md={12} xl={4} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<OddballBreakdown serviceRecord={player.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
						</Grid>
					</Grid>}
			</Box>
		</Box>
	);
}