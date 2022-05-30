import { Box, Button, Divider, Grid, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { TopMedals } from "../Assets/Components/Medals/TopMedals";
import { KillDeathCard } from "../Assets/Components/Breakdowns/KillDeathCard";
import { AssistBreakdown } from "../Assets/Components/Breakdowns/AssistBreakdown";
import { MatchesBreakdown } from "../Assets/Components/Breakdowns/MatchesBreakdown";
import { ShotsBreakdown } from "../Assets/Components/Breakdowns/ShotsBreakdown";
import { DamageBreakdown } from "../Assets/Components/Breakdowns/DamageBreakdown";
import { KDABreakdown } from "../Assets/Components/Breakdowns/KDABreakdown";
import { LevelBreakdown } from "../Assets/Components/Breakdowns/LevelBreakdown";
import { VehicleBreakdown } from "../Assets/Components/Breakdowns/VehicleBreakdown";
import { ServiceRecordFilters } from "./Subpage/ServiceRecordFilters";
import { ViewProps } from "./Props/ViewProps";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { Cookie } from "../Objects/Helpers/Cookie";
import { KillBreakdownCard } from "../Assets/Components/Breakdowns/KillBreakdownCard";
import { SeasonChooser } from "./Subpage/SeasonChooser";
import { ServiceRecordChart } from "../Assets/Components/Charts/ServiceRecordChart";
import { MMRBreakdown } from "../Assets/Components/Breakdowns/MMRBreakdown";
import { CSRSBreakdown } from "../Assets/Components/Breakdowns/CSRSBreakdown";
import { TimePlayed } from "../Assets/Components/Breakdowns/TimePlayed";

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

	// useScript("//pl17321505.safestgatetocontent.com/a7b55266c8d1e7c39ed0ac2f85cf49fa/invoke.js");

	const loadData = useCallback(async () => 
	{		
		if (!gamertag) { switchTab("/", "Search"); return; }

		document.title = "Spartan Record | " + gamertag;

		// Set page gamertag and show loading message
		setLoadingMessage("Loading " + gamertag);
		Cookie.addRecent(gamertag);
		
		// Get the player from firebase and show on screen
		const player = await app.GetPlayerFromFirebase(gamertag, season, isAllowed);
		updatePlayer(player.gamertag, player.appearance, player.serviceRecord, player.mmr, player.csrs);
		if (isAllowed) { setHistoricStats(player.historicStats ?? []); }

		if (!player.serviceRecord.IsEmpty())
		{
			// Set loading message to nada, start background load
			setLoadingMessage("");
			setBackgroundLoadingProgress(-1);
		}		

		// If they are, sync with autocode
		if (!app.IsSyncing(gamertag))
		{
			app.AddToSyncing(gamertag);

			// Sync into firebase
			const newPlayer = await app.GetPlayerFromAutocode(gamertag, season, player.mmr);
			if (newPlayer)
			{
				updatePlayer(newPlayer.gamertag, newPlayer.appearance, newPlayer.serviceRecord, newPlayer.mmr, newPlayer.csrs);
				await app.SetPlayerIntoFirebase(newPlayer, season);
			}
			
			setLoadingMessage("");
			app.RemoveFromSyncing(gamertag);
			setBackgroundLoadingProgress(undefined);
		}
		else 
		{ 
			setLoadingMessage("");
			setBackgroundLoadingProgress(undefined); 
		}
	}, [app, gamertag, updatePlayer, setBackgroundLoadingProgress, season, switchTab]);
	
	useEffect(() =>
	{
		loadData();
	}, [gamertag, season]);

	return (
		<Box component="main" sx={{ flexGrow: 1 }}>
			<Toolbar />
			<Divider />
			<Box sx={{ p: player ? 2 : 0, height: "calc(100% - 64px)" }}>
				{player && player.serviceRecord?.error !== undefined &&
					<Box sx={{ m: 10, color: "primary.main" }}>
						<Typography variant="h3">Couldn't load {player.gamertag}</Typography>
						<Typography variant="h6">{player.serviceRecord.error}</Typography>
						<Button sx={{ mt: 4 }} onClick={() => switchTab("/", "Search")} variant="contained">Back to Search</Button>
					</Box>
				}
				{player && !player.serviceRecord?.IsEmpty() && player.serviceRecord?.error === undefined &&
					<Grid container spacing={2}>
						{/* Top */}
						<Grid item xs={12}>
							<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
								<SeasonChooser setSeason={setSeason} />
								<Box sx={{ flexGrow: 1 }}></Box>
								<ServiceRecordFilters setPerMatch={setShowPerMatch} />
							</Box>
						</Grid>
						{/* Far left */}
						<Grid container item spacing={2} md={12} lg={6} xl={4} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<MatchesBreakdown serviceRecord={player.serviceRecord} />
							</Grid>
							<Grid item xs={12}>
								<KillDeathCard serviceRecord={player.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<KDABreakdown serviceRecord={player.serviceRecord} />
							</Grid>
							<Grid item xs={12}>
								<LevelBreakdown serviceRecord={player.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<ShotsBreakdown serviceRecord={player.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<TimePlayed serviceRecord={player.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
						</Grid>
						{/* Middle 6 */}
						<Grid container item spacing={2} sm={12} md={6} lg={6} xl={3} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<KillBreakdownCard serviceRecord={player.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<VehicleBreakdown serviceRecord={player.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
							{player.mmr && <Grid item xs={12}>
								<MMRBreakdown mmr={player.mmr} />
							</Grid>}
							{/* {!isAllowed && <Grid item xs={12}>
								<Box id="container-a7b55266c8d1e7c39ed0ac2f85cf49fa" />
							</Grid>} */}
						</Grid>
						{/* Far right */}
						<Grid container item spacing={2} sm={12} md={6} lg={12} xl={5} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<TopMedals medals={player.serviceRecord.medals} matchesPlayed={player.serviceRecord.matchesPlayed} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<AssistBreakdown serviceRecord={player.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<DamageBreakdown serviceRecord={player.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
							{player.csrs && player.csrs.length > 0 && <Grid item xs={12}>
								<CSRSBreakdown csrs={player.csrs} />
							</Grid>}
							{isAllowed && season === -1 && <Grid item xs={12}>
								<ServiceRecordChart historicServiceRecords={historicStats} currentSR={player.serviceRecord} />
							</Grid>}
							{/* <Grid item xs={12}>
								<CampaignBreakdown campaignRecord={player.campaignRecord} />
							</Grid> */}
						</Grid>						
					</Grid>}
			</Box>
		</Box>
	);
}