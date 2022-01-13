import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SpartanCompany } from "../Objects/Model/SpartanCompany";
import { MemberList } from "../Assets/Components/Members/MemberList";

import { TopMedals } from "../Assets/Components/Medals/TopMedals";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { MatchesBreakdown } from "../Assets/Components/Breakdowns/MatchesBreakdown";
import { KDARanks } from "../Assets/Components/Ranks/KDARanks";
import { WinRateRanks } from "../Assets/Components/Ranks/WinRateRanks";
import { AccuracyRanks } from "../Assets/Components/Ranks/AccuracyRanks";
import { KillBreakdown } from "../Assets/Components/Breakdowns/KillBreakdown";
import { AHAppBar } from "../Assets/Components/Layout/AHAppBar";
import { AHDrawer } from "../Assets/Components/Layout/AHDrawer";
import { AHLoading } from "../Assets/Components/Layout/AHLoading";
import { Player } from "../Objects/Model/Player";
import { Arrowhead } from "../Database/Arrowhead";

export function SpartanCompanyView(props: { app: Arrowhead })
{
	//#region Props and Navigate
	const { app } = props;
	const { company } = useParams();
	const navigate = useNavigate();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
	const [spartanCompany, setSpartanCompany] = useState(app.arrowheadUser?.spartanCompany ?? (company ? new SpartanCompany(company) : undefined))
	const [myPlayer, setMyPlayer] = useState(app.arrowheadUser?.player);
	const [loadingMessage, setLoadingMessage] = useState("");
	const [sharedSR, setSharedSR] = useState(new ServiceRecord());
	const [mobileOpen, setMobileOpen] = useState(false);
	//#endregion

    const loadData = useCallback(async () => 
    {
		if (!spartanCompany) { return; }
		if (!await app.db.GetMembers(spartanCompany)) { return; }
		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Service Records");
		
        // Get last update instant
        lastUpdate.current = await app.db.GetLastUpdate();
		
		// Get service records for all users
		for (const gamertag of spartanCompany.members)
		{
			setLoadingMessage("Loading " + gamertag);

			const player = await app.db.GetPlayer(gamertag);
			if (!player) { continue; }
			
			spartanCompany.AddPlayer(player);
		}

		const sr = spartanCompany.GetServiceRecord();
		app.LogViewSpartanCompany(spartanCompany.name);

		setSharedSR(sr);
		setLoadingMessage("");
    }, [lastUpdate, app, spartanCompany, setSharedSR]);
    
    useEffect(() =>
    {
        loadData();
    }, [app, company]);

	/**
	 * On tab click, navigates to the right one
	 */
	const changeView = useCallback((url: string) => navigate(url), [navigate]);

	/**
	 * Goes to the service record
	 */
	const goToServiceRecord = useCallback((gamertag: string) =>
	{
		memberListSetPlayer(app.arrowheadUser?.spartanCompany?.GetPlayer(gamertag) ?? new Player(gamertag));
		navigate("/service_record/" + gamertag);
	}, [navigate, app, memberListSetPlayer]);

	/** Opens or closes the drawer */
	function handleDrawerToggle()
	{
		setMobileOpen(!mobileOpen);
	};

	/**
	 * Sets the player
	 * @param player the player to set
	 */
	function memberListSetPlayer(player: Player)
	{
		setMyPlayer(player);
	}

	/** Logs out the current user */
	async function logout()
	{
		setLoadingMessage("Logging out");
		await app.Logout();
		setLoadingMessage("");
	}

	const container = window !== undefined ? () => window.document.body : undefined;

	return (
		<Box sx={{ display: "flex", backgroundColor: "background.paper" }}>
			<AHAppBar player={app.arrowheadUser?.player} handleDrawerToggle={handleDrawerToggle} openAuth={changeView} />
			<AHLoading loadingMessage={loadingMessage} />
			<AHDrawer loggedInUser={app.arrowheadUser} currentTab={12} container={container} mobileOpen={mobileOpen} switchTab={changeView} handleDrawerToggle={handleDrawerToggle} onLogout={logout} />
      		<Box component="main" sx={{ flexGrow: 1 }}>
				<Toolbar />
				<Divider />
				<Box sx={{ p: 2 }}>
					<Grid container spacing={2}>
						<Grid container item spacing={2} xs={12} md={4} xl={3}>
							<Grid item xs={12}>
								{spartanCompany ? <MemberList company={spartanCompany} goToMember={goToServiceRecord} setPlayer={memberListSetPlayer} /> : undefined}
							</Grid>
						</Grid>
						<Grid container item spacing={2} xs={12} md={4} xl={6} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<TopMedals medals={sharedSR.medals} />
							</Grid>
							<Grid item xs={12}>
								<KillBreakdown serviceRecord={sharedSR} />
							</Grid>
							<Grid item xs={12}>
								<MatchesBreakdown serviceRecord={sharedSR} />
							</Grid>
						</Grid>
						<Grid container item spacing={2} xs={12} md={4} xl={3}>
							<Grid item xs={12}>
								{spartanCompany ? <WinRateRanks company={spartanCompany} sharedSR={sharedSR} goToMember={goToServiceRecord} /> : undefined}
							</Grid>
							<Grid item xs={12}>
								{spartanCompany ? <KDARanks company={spartanCompany} sharedSR={sharedSR} goToMember={goToServiceRecord} /> : undefined}
							</Grid>
							<Grid item xs={12}>
								{spartanCompany ? <AccuracyRanks company={spartanCompany} sharedSR={sharedSR} goToMember={goToServiceRecord} /> : undefined}
							</Grid>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Box>
	);
}