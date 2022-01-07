import { AppBar, Backdrop, Box, CircularProgress, Divider, Drawer, Grid, IconButton, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowheadFirebase } from "../Database/ArrowheadFirebase";
import { Company } from "../Objects/Model/Company";

import GroupsIcon from '@mui/icons-material/Groups';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

import ArrowheadImg from "../Assets/Images/arrowhead.png";
import MenuIcon from '@mui/icons-material/Menu';
import { TopMedals } from "../Assets/Components/Medals/TopMedals";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { KillBreakdown } from "../Assets/Components/Breakdowns/KillBreakdown";
import { AssistBreakdown } from "../Assets/Components/Breakdowns/AssistBreakdown";
import { MatchesBreakdown } from "../Assets/Components/Breakdowns/MatchesBreakdown";
import { ShotsBreakdown } from "../Assets/Components/Breakdowns/ShotsBreakdown";
import { DamageBreakdown } from "../Assets/Components/Breakdowns/DamageBreakdown";

export function MedalsView(props: { db: ArrowheadFirebase, company: Company })
{
	//#region Props and Navigate
	const { db, company } = props;
	const { gamertag } = useParams();
	const navigate = useNavigate();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
	const [loadingMessage, setLoadingMessage] = useState("");
	const [spartanCompany, setSpartanCompany] = useState(company);
	const [mySR, setMySR] = useState(new ServiceRecord());
	const [tab, setTab] = useState(2);
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

		// Get player's service record
		if (gamertag)
		{
			const sr = spartanCompany.GetPlayer(gamertag)?.serviceRecord ?? new ServiceRecord();
			setMySR(sr);
		}

		setSpartanCompany(spartanCompany);
		setLoadingMessage("");
	}, [spartanCompany, lastUpdate, db, gamertag, setSpartanCompany, setMySR]);
	
	useEffect(() =>
	{
		loadData();
	}, []);

	const onTabClick = useCallback((_event: React.SyntheticEvent, newValue: number) =>
	{
		setTab(newValue);
		if (newValue === 0) { navigate("/"); }
		if (newValue === 1) { navigate("/service_record/BoundlessEcho"); }
		if (newValue === 2) { navigate("/service_record/BoundlessEcho/medals"); }
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
					<Typography variant="body1" sx={{ flexGrow: 1, textAlign: "right", padding: 2 }}>{gamertag}</Typography>
					<img src={spartanCompany.GetPlayer(gamertag)?.appearance.emblemURL} alt="emblem" height="32px" />
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
						<Grid item xs={12} md={6} lg={4} xl={3}>
							<KillBreakdown serviceRecord={mySR} icon={ArrowheadImg} />
						</Grid>
						<Grid item xs={12} md={6} lg={4} xl={3}>
							<MatchesBreakdown serviceRecord={mySR} icon={ArrowheadImg} />
						</Grid>
						<Grid item xs={12} md={6} lg={4} xl={3}>
							<AssistBreakdown serviceRecord={mySR} icon={ArrowheadImg} />
						</Grid>
						<Grid item xs={12} md={6} lg={4} xl={3}>
							<ShotsBreakdown serviceRecord={mySR} icon={ArrowheadImg} />
						</Grid>
						<Grid item xs={12} md={6} lg={4} xl={3}>
							<DamageBreakdown serviceRecord={mySR} icon={ArrowheadImg} />
						</Grid>
						<Grid item xs={12} lg={6}>
							<TopMedals medals={mySR.medals} />
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Box>
	);
}