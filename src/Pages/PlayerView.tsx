import { Box, Checkbox, Divider, FormControlLabel, FormGroup, Grid, Toolbar, Typography } from "@mui/material";
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

export function PlayerView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage } = props;
	const { gamertag } = useParams();
	const navigate = useNavigate();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
	const [myPlayer, setMyPlayer] = useState(app.arrowheadUser?.player ?? new Player());
	const [search, setSearch] = useState("");
	const [showPerMatch, setShowPerMatch] = useState(false);
	//#endregion

	const loadData = useCallback(async () => 
	{		
		if (gamertag === "search") { return; }

		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Service Records");
		
		// Get last update instant
		lastUpdate.current = await app.db.GetLastUpdate();

		// Get player's service record
		if (gamertag && gamertag === app.arrowheadUser?.user?.displayName)
		{
			setLoadingMessage("Loading " + gamertag);
			app.arrowheadUser.player = await app.db.GetPlayer(gamertag, true);
			setMyPlayer(app.arrowheadUser.player);
			app.LogViewServiceRecord(gamertag);
		}
		else if (gamertag)
		{
			setLoadingMessage("Loading " + gamertag);
			const player = await app.db.GetPlayer(gamertag, true);
			setMyPlayer(player);
			app.LogViewServiceRecord(gamertag);
		}

		setLoadingMessage("");
	}, [lastUpdate, app, gamertag, setMyPlayer]);
	
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
								<ServiceRecordChart historicServiceRecords={myPlayer.historicStats ?? []} currentSR={myPlayer.serviceRecord} />
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