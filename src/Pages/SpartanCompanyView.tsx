import { Avatar, Box, Button, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Toolbar, Typography } from "@mui/material";
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
import { SpartanCompanySearch } from "./Subpage/SpartanCompanySearch";

import AddIcon from '@mui/icons-material/Add';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';

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
	const [spartanCompany, setSpartanCompany] = useState((company && company !== "search" ? new SpartanCompany(company) : undefined))
	const [myPlayer, setMyPlayer] = useState(app.arrowheadUser?.player);
	const [loadingMessage, setLoadingMessage] = useState("");
	const [sharedSR, setSharedSR] = useState(new ServiceRecord());
	const [mobileOpen, setMobileOpen] = useState(false);
	const [search, setSearch] = useState("");
	//#endregion

    const loadData = useCallback(async () => 
    {
		let sc = spartanCompany;

		if (company === "search") { return; }
		if (company && sc?.name !== company) { sc = new SpartanCompany(company); }
		if (!sc) { return; }
		if (!await app.db.GetMembers(sc)) { return; }
		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Service Records");
		
        // Get last update instant
        lastUpdate.current = await app.db.GetLastUpdate();
		
		// Get service records for all users
		for (const gamertag of sc.members)
		{
			setLoadingMessage("Loading " + gamertag);

			const player = await app.db.GetPlayer(gamertag);
			if (!player) { continue; }
			
			sc.AddPlayer(player);
		}

		const sr = sc.GetServiceRecord();
		app.LogViewSpartanCompany(sc.name);

		setSpartanCompany(sc);
		setSharedSR(sr);
		setLoadingMessage("");
    }, [lastUpdate, app, spartanCompany, setSpartanCompany, setSharedSR, company]);
    
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

	/** Controlled search component */
	function onSpartanCompanyTextChange(event: React.ChangeEvent<HTMLInputElement>)
	{
		setSearch(event.target.value);
	};

	/** When the search button is pressed */
	function searchForSpartanCompany()
	{
		if (search === "") { return; }
		navigate(`/company/${search}`);
	}

	/** When enter is pressed */
	function searchForCompanyViaEnter(event: React.KeyboardEvent<HTMLDivElement>)
	{
		if (event.key === "Enter")
		{
			searchForSpartanCompany();
		}
	}

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
		<Box sx={{ display: "flex", backgroundColor: "background.paper", height: "100vh" }}>
			<AHAppBar player={app.arrowheadUser?.player} handleDrawerToggle={handleDrawerToggle} openAuth={changeView} />
			<AHLoading loadingMessage={loadingMessage} />
			<AHDrawer loggedInUser={app.arrowheadUser} currentTab={app.arrowheadUser?.user ? 12 : 1} container={container} mobileOpen={mobileOpen} switchTab={changeView} handleDrawerToggle={handleDrawerToggle} onLogout={logout} />
      		<Box component="main" sx={{ flexGrow: 1, height: "100%" }}>
				<Toolbar />
				<Divider />
				<Box sx={{ p: spartanCompany?.Exists() ? 2 : 0, height: "calc(100% - 64px)" }}>
					{spartanCompany?.Exists() ?
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
					:
						company !== "search" 
							? 
							<Box sx={{ p: 2, pl: 8, pt: 8, backgroundColor: "secondary.main", pb: 8 }}>
								<SpartanCompanySearch search={search} onValueChanged={onSpartanCompanyTextChange} onKeyPress={searchForCompanyViaEnter} onSearch={searchForSpartanCompany} />
								<Typography variant="h3" sx={{ fontWeight: 700, mb: 2, mt: 10 }}><span className="skinny">{company} Company doesn't exist.</span> Do you want to create it?</Typography>
								<List>
									<ListItem>
										<ListItemAvatar>
											<Avatar><CompareArrowsIcon /></Avatar>
										</ListItemAvatar>
										<ListItemText primary="Compare your statistics to other players in your Spartan Company" />
									</ListItem>
									<ListItem>
										<ListItemAvatar>
											<Avatar><SlowMotionVideoIcon /></Avatar>
										</ListItemAvatar>
										<ListItemText primary="Embed a Spartan Company video to feature your team's skills" />
									</ListItem>
									<ListItem>
										<ListItemAvatar>
											<Avatar><DashboardCustomizeIcon /></Avatar>
										</ListItemAvatar>
										<ListItemText primary="Customize the statistics shown on your company page" />
									</ListItem>
								</List>
								<Box sx={{ textAlign: "left", ml: 2, mt: 4 }}>
									<Button variant="contained" startIcon={<AddIcon />}>Create {company} Company</Button>
								</Box>
							</Box>
							: <SpartanCompanySearch search={search} onValueChanged={onSpartanCompanyTextChange} onKeyPress={searchForCompanyViaEnter} onSearch={searchForSpartanCompany} />
						}
				</Box>
			</Box>
		</Box>
	);
}