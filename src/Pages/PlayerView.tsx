import { Box, Checkbox, CircularProgress, Divider, FormControlLabel, FormGroup, Grid, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { TopMedals } from "../Assets/Components/Medals/TopMedals";
import { KillBreakdown } from "../Assets/Components/Breakdowns/KillBreakdown";
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
import { CampaignBreakdown } from "../Assets/Components/Breakdowns/CampaignBreakdown";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";

interface PlayerViewProps
{
	setGamertag: (gamertag: string) => void;
}

export function PlayerView(props: ViewProps & PlayerViewProps)
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
			
			// Get the player from firebase
			const player = await app.GetPlayerFromFirebase(gamertag);

			// Set player to show latest data in firebase
			setMyPlayer(player);
			setHistoricStats(player.historicStats ?? []);
			setLoadingMessage("");
			setBackgroundLoadingProgress(-1);

			// If they are, sync with autocode
			if (!app.IsSyncing(gamertag))
			{
				app.AddToSyncing(gamertag);

				// Sync into firebase
				app.SyncPlayer(gamertag).then(async (result) =>
				{
					if (result)
					{
						setMyPlayer(await app.GetPlayerFromFirebase(gamertag));
					}					
				}).finally(() => 
				{
					app.RemoveFromSyncing(gamertag);
					setBackgroundLoadingProgress(undefined);
				});
			}
			else { setBackgroundLoadingProgress(undefined); }
			
		}
	}, [lastUpdate, app, gamertag, setMyPlayer, historicStats, setBackgroundLoadingProgress, setHistoricStats]);
	
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
						<Grid container item spacing={2} xs={12} md={4} xl={4} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<MatchesBreakdown serviceRecord={myPlayer.serviceRecord} />
							</Grid>
							<Grid item xs={12}>
								<KillBreakdown serviceRecord={myPlayer.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<ShotsBreakdown serviceRecord={myPlayer.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
						</Grid>
						{/* Middle 6 */}
						<Grid container item spacing={2} xs={12} md={4} xl={5} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<TopMedals medals={myPlayer.serviceRecord.medals} matchesPlayed={myPlayer.serviceRecord.matchesPlayed} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<ServiceRecordChart historicServiceRecords={historicStats} currentSR={myPlayer.serviceRecord} />
							</Grid>
							{/* <Grid item xs={12}>
								<CampaignBreakdown campaignRecord={myPlayer.campaignRecord} />
							</Grid> */}
						</Grid>
						{/* Far right */}
						<Grid container item spacing={2} xs={12} md={4} xl={3} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<KDABreakdown serviceRecord={myPlayer.serviceRecord} />
							</Grid>
							<Grid item xs={12}>
								<LevelBreakdown serviceRecord={myPlayer.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<AssistBreakdown serviceRecord={myPlayer.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<DamageBreakdown serviceRecord={myPlayer.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<VehicleBreakdown serviceRecord={myPlayer.serviceRecord} showPerMatch={showPerMatch} />
							</Grid>
						</Grid>
					</Grid>
				: <GamertagSearch search={search} onValueChanged={onGamertagTextChange} onKeyPress={searchForGamertagViaEnter} onSearch={searchForGamertag} />}
			</Box>
		</Box>
	);
}