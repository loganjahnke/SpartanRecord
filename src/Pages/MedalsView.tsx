import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { AHAppBar } from "../Assets/Components/Layout/AHAppBar";
import { AHDrawer } from "../Assets/Components/Layout/AHDrawer";
import { AHLoading } from "../Assets/Components/Layout/AHLoading";
import { MedalTypeBreakdown } from "../Assets/Components/Medals/MedalTypeBreakdown";
import { MedalType } from "../Objects/Pieces/Medal";
import { Arrowhead } from "../Database/Arrowhead";

export function MedalsView(props: { app: Arrowhead })
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
	const [mySR, setMySR] = useState(app.arrowheadUser?.player?.serviceRecord ?? new ServiceRecord());
	const [tab, setTab] = useState(10);
	const [mobileOpen, setMobileOpen] = useState(false);
	//#endregion

	const loadData = useCallback(async () => 
	{		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Service Records");
		
		// Get last update instant
		lastUpdate.current = await app.db.GetLastUpdate();
		
		// Get player's service record
		if (gamertag && gamertag === app.arrowheadUser?.player?.gamertag)
		{
			setLoadingMessage("Loading " + gamertag);
			app.LogViewServiceRecord(gamertag);
			if (app.arrowheadUser.player.serviceRecord)
			{
				setMySR(app.arrowheadUser.player.serviceRecord);	
			}
			else
			{
				app.arrowheadUser.player = await app.db.GetPlayer(gamertag);
				setMySR(app.arrowheadUser.player.serviceRecord);
			}			
		}
		else if (gamertag)
		{
			setLoadingMessage("Loading " + gamertag);
			const player = await app.db.GetPlayer(gamertag);
			setMySR(player.serviceRecord);
			app.LogViewMedals(gamertag);
		}

		setLoadingMessage("");
	}, [lastUpdate, app, gamertag, setMySR]);
	
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
			<AHDrawer loggedInUser={app.arrowheadUser} currentTab={tab} container={container} mobileOpen={mobileOpen} switchTab={changeView} handleDrawerToggle={handleDrawerToggle} onLogout={logout} />
	  		<Box component="main" sx={{ flexGrow: 1 }}>
				<Toolbar />
				<Divider />
				<Box sx={{ p: 2 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<MedalTypeBreakdown type={MedalType.Spree} medals={mySR.medals} />
						</Grid>
						<Grid item xs={12} md={6}>
							<MedalTypeBreakdown type={MedalType.MultiKill} medals={mySR.medals} />
						</Grid>
						<Grid item xs={12} lg={4}>
							<MedalTypeBreakdown type={MedalType.CTF} medals={mySR.medals} />
						</Grid>
						<Grid item xs={12} lg={4}>
							<MedalTypeBreakdown type={MedalType.Oddball} medals={mySR.medals} />
						</Grid>
						<Grid item xs={12} lg={4}>
							<MedalTypeBreakdown type={MedalType.Strongholds} medals={mySR.medals} />
						</Grid>
						<Grid item xs={12} lg={4}>
							<MedalTypeBreakdown type={MedalType.Stockpile} medals={mySR.medals} />
						</Grid>
						<Grid item xs={12} lg={8}>
							<MedalTypeBreakdown type={MedalType.Sniper} medals={mySR.medals} />
						</Grid>
						<Grid item xs={12}>
							<MedalTypeBreakdown type={MedalType.Weapons} medals={mySR.medals} />
						</Grid>
						<Grid item xs={12}>
							<MedalTypeBreakdown type={MedalType.Boom} medals={mySR.medals} />
						</Grid>
						<Grid item xs={12}>
							<MedalTypeBreakdown type={MedalType.Skill} medals={mySR.medals} />
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Box>
	);
}