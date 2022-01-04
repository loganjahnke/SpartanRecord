import { AppBar, Backdrop, Box, CircularProgress, Divider, Drawer, Grid, IconButton, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowheadFirebase } from "../Database/ArrowheadFirebase";
import { Company } from "../Objects/Model/Company";

import GroupsIcon from '@mui/icons-material/Groups';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { MemberList } from "../Assets/Components/MemberList";
import { Statistic } from "../Assets/Components/Statistic";

import ArrowheadImg from "../Assets/Images/arrowhead.png";
import MenuIcon from '@mui/icons-material/Menu';
import { TopMedals } from "../Assets/Components/TopMedals";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";

export function CompanyView(props: { db: ArrowheadFirebase, company: Company })
{
	//#region Props and Navigate
	const { db, company } = props;
	const navigate = useNavigate();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
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

	const onTabClick = useCallback((_event: React.SyntheticEvent, newValue: number) =>
	{
		setTab(newValue);
		if (newValue === 0) { navigate(""); }
		if (newValue === 1) { navigate("service_record/BoundlessEcho"); }
		if (newValue === 2) { navigate("service_record/BoundlessEcho/medals"); }
	}, [navigate, setTab]);

	function handleDrawerToggle()
	{
		setMobileOpen(!mobileOpen);
	};

	const container = window !== undefined ? () => window.document.body : undefined;

	//#region Drawer
	const drawer = (
		<div>
			<Toolbar><Typography variant="h6" sx={{ padding: 2 }}>{spartanCompany.name} Company</Typography></Toolbar>
			<Divider />
			<Tabs orientation="vertical" value={tab} onChange={onTabClick} sx={{ mt: 5 }}>
				<Tab className="ahTab" label="Company" icon={<GroupsIcon />} iconPosition="start" />
				<Tab className="ahTab" label="Service Record" icon={<ModeStandbyIcon />} iconPosition="start" />
				<Tab className="ahTab" label="Medals" icon={<MilitaryTechIcon />} iconPosition="start" />
			</Tabs>
		</div>
	);
	//#endregion

	return (
		<Box sx={{ display: "flex", backgroundColor: "background.paper" }}>
			<AppBar position="fixed" sx={{ width: { sm: `calc(100% - 240px)` }, ml: { sm: `240px` }}}>
				<Toolbar sx={{ display: "flex", alignItems: "center" }}>
					<IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
						<MenuIcon />
					</IconButton>
					<Divider orientation="vertical" flexItem sx={{ display: { sm: "none" }}} />
					<Typography variant="body1" sx={{ flexGrow: 1, textAlign: "right", padding: 2 }}>BoundlessEcho</Typography>
					<img src={spartanCompany.GetPlayer("BoundlessEcho")?.appearance.emblemURL} alt="emblem" height="32px" />
				</Toolbar>
			</AppBar>
			<Backdrop sx={{ color: '#fff', zIndex: 1000 }} open={!!loadingMessage}>
				<CircularProgress color="inherit" />
				<div className="loadingMessage">{loadingMessage}</div>
			</Backdrop>
			<Box component="nav" sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
				<Drawer container={container} variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }}}>
					{drawer}
				</Drawer>
				<Drawer variant="permanent" open sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }}}>
					{drawer}
				</Drawer>
      		</Box>
      		<Box component="main" sx={{ flexGrow: 1 }}>
				<Toolbar />
				<Divider />
				<Box sx={{ p: 2 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={5} lg={3}>
							<MemberList company={spartanCompany} />
						</Grid>
						<Grid container item xs={12} sm={7} lg={9} spacing={2}>
							<Grid item xs={4} sm={4}>
								<Statistic title="Kills" icon={ArrowheadImg} value={sharedSR.summary.kills} />
							</Grid>
							<Grid item xs={4} sm={4}>
								<Statistic title="Deaths" icon={ArrowheadImg} value={sharedSR.summary.deaths} />
							</Grid>
							<Grid item xs={4} sm={4}>
								<Statistic title="Assists" icon={ArrowheadImg} value={sharedSR.summary.assists} />
							</Grid>
							<Grid item xs={12}>
								<TopMedals medals={sharedSR.medals} />
							</Grid>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Box>
	);
}