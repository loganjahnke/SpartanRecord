import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { TopMedals } from "../Assets/Components/Medals/TopMedals";
import { KillDeathCard } from "../Assets/Components/Breakdowns/KillDeathCard";
import { AssistBreakdown } from "../Assets/Components/Breakdowns/AssistBreakdown";
import { MatchesBreakdown } from "../Assets/Components/Breakdowns/MatchesBreakdown";
import { ShotsBreakdown } from "../Assets/Components/Breakdowns/ShotsBreakdown";
import { DamageBreakdown } from "../Assets/Components/Breakdowns/DamageBreakdown";
import { Player } from "../Objects/Model/Player";
import { ServiceRecordChart } from "../Assets/Components/Charts/ServiceRecordChart";
import { KDABreakdown } from "../Assets/Components/Breakdowns/KDABreakdown";
import { LevelBreakdown } from "../Assets/Components/Breakdowns/LevelBreakdown";
import { PlayerCard } from "../Assets/Components/Cards/PlayerCard";
import { GamertagSearch } from "./Subpage/GamertagSearch";
import { VehicleBreakdown } from "../Assets/Components/Breakdowns/VehicleBreakdown";
import { ServiceRecordFilters } from "./Subpage/ServiceRecordFilters";
import { ViewProps } from "./Props/ViewProps";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { Cookie } from "../Objects/Helpers/Cookie";
import { KillBreakdownCard } from "../Assets/Components/Breakdowns/KillBreakdownCard";

export function PlayerView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, setBackgroundLoadingProgress, setGamertag } = props;
	const { gamertag } = useParams();
	const navigate = useNavigate();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
	const [myPlayer, setMyPlayer] = useState(new Player());
	const [historicStats, setHistoricStats] = useState<ServiceRecord[]>([]);
	const [search, setSearch] = useState("");
	const [showPerMatch, setShowPerMatch] = useState(false);
	//#endregion

	const loadData = useCallback(async () => 
	{		
		if (gamertag === "search") { return; }

		// Get service record of gamertag
		if (gamertag)
		{
			// Set page gamertag and show loading message
			setGamertag(gamertag);
			setLoadingMessage("Loading " + gamertag);
			Cookie.addRecent(gamertag);
			
			// Get the player from firebase and show on screen
			const player = await app.GetPlayerFromFirebase(gamertag, false);

			// Set player
			setMyPlayer(player);
			//setHistoricStats(player.historicStats ?? []);

			// Set loading message to nada, start background load
			setLoadingMessage("");
			setBackgroundLoadingProgress(-1);

			// If they are, sync with autocode
			if (!app.IsSyncing(gamertag))
			{
				app.AddToSyncing(gamertag);

				// Sync into firebase
				app.GetPlayerFromAutocode(gamertag).then(async (result) =>
				{
					if (result)
					{
						setMyPlayer(result);
						await app.SetPlayerIntoFirebase(result);
					}					
				}).finally(() => 
				{
					app.RemoveFromSyncing(gamertag);
					setBackgroundLoadingProgress(undefined);
				});

				// app.SyncPlayer(gamertag).then(async (result) =>
				// {
				// 	if (result)
				// 	{
				// 		const player = await app.GetPlayerFromFirebase(gamertag, true);
				// 		setMyPlayer(player);
				// 		setHistoricStats(player.historicStats ?? []);
				// 	}					
				// }).finally(() => 
				// {
				// 	app.RemoveFromSyncing(gamertag);
				// 	setBackgroundLoadingProgress(undefined);
				// });
			}
			else { setBackgroundLoadingProgress(undefined); }
			
		}
	}, [lastUpdate, app, gamertag, setMyPlayer, setBackgroundLoadingProgress]);
	
	useEffect(() =>
	{
		loadData();
	}, [gamertag]);

	/** Controlled search component */
	function onGamertagTextChange(event: React.ChangeEvent<HTMLInputElement>)
	{
		setSearch(event.target.value);
	};

	/** When the search button is pressed */
	function searchForGamertag()
	{
		if (search === "") { return; }
		setGamertag(search);
		navigate(`/service_record/${search}`);
	}

	/** When enter is pressed */
	function searchForGamertagViaEnter(event: React.KeyboardEvent<HTMLDivElement>)
	{
		if (event.key === "Enter")
		{
			searchForGamertag();
		}
	};

	/** When the search button is pressed */
	function openRecent(gamertag: string)
	{
		setGamertag(gamertag);
		navigate(`service_record/${gamertag}`);
	}

	return (
		<Box component="main" sx={{ flexGrow: 1 }}>
			<Toolbar />
			<Divider />
			<Box sx={{ p: gamertag !== "search" && gamertag !== undefined ? 2 : 0, height: "calc(100% - 64px)" }}>
				{gamertag !== "search" && gamertag !== undefined ? 
					<Grid container spacing={2}>
						{/* Top */}
						<Grid item xs={12}>
							<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
								<PlayerCard player={myPlayer} />
								<Box sx={{ flexGrow: 1 }}></Box>
								<ServiceRecordFilters setPerMatch={setShowPerMatch} />
							</Box>
						</Grid>
						{/* Far left */}
						<Grid container item spacing={2} md={12} lg={6} xl={4} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<MatchesBreakdown serviceRecord={myPlayer.serviceRecord} />
							</Grid>
							<Grid item xs={12}>
								<KillDeathCard serviceRecord={myPlayer.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<KDABreakdown serviceRecord={myPlayer.serviceRecord} />
							</Grid>
							<Grid item xs={12}>
								<ShotsBreakdown serviceRecord={myPlayer.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
						</Grid>
						{/* Middle 6 */}
						<Grid container item spacing={2} sm={12} md={6} lg={6} xl={3} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<KillBreakdownCard serviceRecord={myPlayer.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<LevelBreakdown serviceRecord={myPlayer.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<VehicleBreakdown serviceRecord={myPlayer.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
						</Grid>
						{/* Far right */}
						<Grid container item spacing={2} sm={12} md={6} lg={12} xl={5} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<TopMedals medals={myPlayer.serviceRecord.medals} matchesPlayed={myPlayer.serviceRecord.matchesPlayed} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<AssistBreakdown serviceRecord={myPlayer.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<DamageBreakdown serviceRecord={myPlayer.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
							{/* <Grid item xs={12}>
								<ServiceRecordChart historicServiceRecords={historicStats} currentSR={myPlayer.serviceRecord} />
							</Grid> */}
							{/* <Grid item xs={12}>
								<CampaignBreakdown campaignRecord={myPlayer.campaignRecord} />
							</Grid> */}
						</Grid>
						
					</Grid>
				: <GamertagSearch search={search} openRecent={openRecent} onValueChanged={onGamertagTextChange} onKeyPress={searchForGamertagViaEnter} onSearch={searchForGamertag} />}
			</Box>
		</Box>
	);
}