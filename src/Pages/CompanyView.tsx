import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowheadFirebase } from "../Database/ArrowheadFirebase";
import { Company } from "../Objects/Model/Company";
import { MemberList } from "../Assets/Components/Members/MemberList";

import ArrowheadImg from "../Assets/Images/arrowhead.png";

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
import { User } from "../Objects/Model/User";
import { Player } from "../Objects/Model/Player";

export function CompanyView(props: { db: ArrowheadFirebase, company: Company, user: User, setPlayer: Function })
{
	//#region Props and Navigate
	const { db, company, user, setPlayer } = props;
	const navigate = useNavigate();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
	const [myPlayer, setMyPlayer] = useState(user.player);
	const [loadingMessage, setLoadingMessage] = useState("");
	const [spartanCompany, setSpartanCompany] = useState(company);
	const [sharedSR, setSharedSR] = useState(new ServiceRecord());
	const [tab, setTab] = useState(0);
	const [mobileOpen, setMobileOpen] = useState(false);
	//#endregion

    const loadData = useCallback(async () => 
    {
		if (!await db.PopulateMembers()) { return; }
		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Service Records");
		
        // Get last update instant
        await db.GetLastUpdate();
		lastUpdate.current = db.lastUpdate;
		
		// Get service records for all users
		for (const gamertag of db.members)
		{
			setLoadingMessage("Loading " + gamertag);

			const player = await db.GetPlayer(gamertag);
			if (!player) { continue; }
			
			spartanCompany.AddPlayer(player);
		}

		const sr = spartanCompany.GetServiceRecord();

		setSpartanCompany(spartanCompany);
		setSharedSR(sr);
		setLoadingMessage("");
    }, [spartanCompany, lastUpdate, db, setSpartanCompany, setSharedSR]);
    
    useEffect(() =>
    {
        loadData();
    }, []);

	/**
	 * On tab click, navigates to the right one
	 */
	const onTabClick = useCallback((url: string) => navigate(url), [navigate]);

	/**
	 * Goes to the service record
	 */
	const goToServiceRecord = useCallback((gamertag: string) =>
	{
		setTab(1);
		memberListSetPlayer(spartanCompany.GetPlayer(gamertag) ?? new Player(gamertag));
		navigate("/sr/" + gamertag);
	}, [navigate, setTab, spartanCompany, memberListSetPlayer]);

	function handleDrawerToggle()
	{
		setMobileOpen(!mobileOpen);
	};

	function memberListSetPlayer(player: Player)
	{
		setMyPlayer(player);
		setPlayer(player);
	}

	const container = window !== undefined ? () => window.document.body : undefined;

	return (
		<Box sx={{ display: "flex", backgroundColor: "background.paper" }}>
			<AHAppBar player={myPlayer} handleDrawerToggle={handleDrawerToggle} />
			<AHLoading loadingMessage={loadingMessage} />
			<AHDrawer spartanCompany={spartanCompany} currentTab={tab} container={container} mobileOpen={mobileOpen} switchTab={onTabClick} handleDrawerToggle={handleDrawerToggle} gamertag={myPlayer?.gamertag} />
      		<Box component="main" sx={{ flexGrow: 1 }}>
				<Toolbar />
				<Divider />
				<Box sx={{ p: 2 }}>
					<Grid container spacing={2}>
						<Grid container item spacing={2} xs={12} md={4} xl={3}>
							<Grid item xs={12}>
								<MemberList company={spartanCompany} goToMember={goToServiceRecord} setPlayer={memberListSetPlayer} />
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
								<WinRateRanks company={spartanCompany} sharedSR={sharedSR} goToMember={goToServiceRecord} />
							</Grid>
							<Grid item xs={12}>
								<KDARanks company={spartanCompany} sharedSR={sharedSR} goToMember={goToServiceRecord} />
							</Grid>
							<Grid item xs={12}>
								<AccuracyRanks company={spartanCompany} sharedSR={sharedSR} goToMember={goToServiceRecord} />
							</Grid>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Box>
	);
}