import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SpartanCompany } from "../Objects/Model/SpartanCompany";

import { TopMedals } from "../Assets/Components/Medals/TopMedals";
import { KillBreakdown } from "../Assets/Components/Breakdowns/KillBreakdown";
import { AssistBreakdown } from "../Assets/Components/Breakdowns/AssistBreakdown";
import { MatchesBreakdown } from "../Assets/Components/Breakdowns/MatchesBreakdown";
import { ShotsBreakdown } from "../Assets/Components/Breakdowns/ShotsBreakdown";
import { DamageBreakdown } from "../Assets/Components/Breakdowns/DamageBreakdown";
import { Player } from "../Objects/Model/Player";
import { ServiceRecordChart } from "../Assets/Components/Charts/ServiceRecordChart";
import { AHDrawer } from "../Assets/Components/Layout/AHDrawer";
import { AHAppBar } from "../Assets/Components/Layout/AHAppBar";
import { ArrowheadUser } from "../Objects/Model/ArrowheadUser";
import { AHLoading } from "../Assets/Components/Layout/AHLoading";
import { KDABreakdown } from "../Assets/Components/Breakdowns/KDABreakdown";
import { LevelBreakdown } from "../Assets/Components/Breakdowns/LevelBreakdown";
import { Arrowhead } from "../Database/Arrowhead";
import { PlayerCard } from "../Assets/Components/Cards/PlayerCard";

export function PlayerView(props: { app: Arrowhead })
{
	//#region Props and Navigate
	const { app } = props;
	const { gamertag } = useParams();
	const navigate = useNavigate();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
	const [loadingMessage, setLoadingMessage] = useState("");
	const [myPlayer, setMyPlayer] = useState(app.arrowheadUser?.player ?? new Player());
	const [tab, setTab] = useState(1);
	const [mobileOpen, setMobileOpen] = useState(false);
	//#endregion

	const loadData = useCallback(async () => 
	{		
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

	/**
	 * On tab click, navigates to the right one
	 */
	const changeView = useCallback((url: string) => navigate(url), [navigate]);

	function handleDrawerToggle()
	{
		setMobileOpen(!mobileOpen);
	};

	const container = window !== undefined ? () => window.document.body : undefined;

	/** Logs out the current user */
	async function logout()
	{
		setLoadingMessage("Logging out");
		await app.Logout();
		setLoadingMessage("");
	}

	return (
		<Box sx={{ display: "flex", backgroundColor: "background.paper" }}>
			<AHAppBar player={app.arrowheadUser?.player} handleDrawerToggle={handleDrawerToggle} openAuth={changeView} />
			<AHLoading loadingMessage={loadingMessage} />
			<AHDrawer loggedInUser={app.arrowheadUser} currentTab={tab} container={container} mobileOpen={mobileOpen} switchTab={changeView} handleDrawerToggle={handleDrawerToggle} onLogout={logout}/>
	  		<Box component="main" sx={{ flexGrow: 1 }}>
				<Toolbar />
				<Divider />
				<Box sx={{ p: 2 }}>
					<Grid container spacing={2}>
						{/** Far left */}
						<Grid container item spacing={2} xs={12} md={4} xl={4} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<PlayerCard player={myPlayer} />
							</Grid>
							<Grid item xs={12}>
								<MatchesBreakdown serviceRecord={myPlayer.serviceRecord} />
							</Grid>
							<Grid item xs={12}>
								<KillBreakdown serviceRecord={myPlayer.serviceRecord} />
							</Grid>
							<Grid item xs={12}>
								<ShotsBreakdown serviceRecord={myPlayer.serviceRecord} />
							</Grid>
						</Grid>
						{/** Middle 6 */}
						<Grid container item spacing={2} xs={12} md={4} xl={5} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<TopMedals medals={myPlayer.serviceRecord.medals} />
							</Grid>
							<Grid item xs={12}>
								<ServiceRecordChart historicServiceRecords={myPlayer.historicStats ?? []} />
							</Grid>
						</Grid>
						{/** Far right */}
						<Grid container item spacing={2} xs={12} md={4} xl={3} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<KDABreakdown serviceRecord={myPlayer.serviceRecord} />
							</Grid>
							<Grid item xs={12}>
								<LevelBreakdown serviceRecord={myPlayer.serviceRecord} />
							</Grid>
							<Grid item xs={12}>
								<AssistBreakdown serviceRecord={myPlayer.serviceRecord} />
							</Grid>
							<Grid item xs={12}>
								<DamageBreakdown serviceRecord={myPlayer.serviceRecord} />
							</Grid>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Box>
	);
}