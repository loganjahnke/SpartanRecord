import { SyntheticEvent, useEffect, useState } from "react";
import { Box, Button, Collapse, Divider, Drawer, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { ArrowheadUser } from "../../../Objects/Model/ArrowheadUser";

import GroupsIcon from '@mui/icons-material/Groups';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

interface AHDrawerProps
{
	/** The app containing the user and their spartan company */
	loggedInUser?: ArrowheadUser;
	/** Current tab */
	currentTab: number;
	/** Subtab */
	subtab?: number;
	/** Callback for when a tab button is pressed */
	switchTab: ((url: string) => void);
	/** Callback for when the drawer is opened or closed */
	handleDrawerToggle?: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void);
	/** The container */
	container?: Element | (() => HTMLElement);
	/** Open on mobile? */
	mobileOpen?: boolean;
	/** What happens when logout is pressed? */
	onLogout: Function;
}

export function AHDrawer(props: AHDrawerProps)
{
	const { currentTab, subtab, switchTab, handleDrawerToggle, container, mobileOpen, loggedInUser, onLogout } = props;

	const [expandMaps, setExpandMaps] = useState(currentTab === 2);
	const [expandModes, setExpandModes] = useState(currentTab === 4);
	const [expandOutcome, setExpandOutcome] = useState(currentTab === 6);
	const [expandRanked, setExpandRanked] = useState(currentTab === 8);

	/**
	 * Triggered when a tab is clicked
	 * @param event 
	 * @param newValue 
	 */
	function tabClicked(event: SyntheticEvent<Element, Event>, newValue: number)
	{
		const gamertag = loggedInUser?.user?.displayName;
		switch (newValue)
		{
			case 12:
				switchTab(`/company/${loggedInUser?.spartanCompany?.name ?? "join"}`);
				break;
			case 0:
				switchTab(`/`);
				break;
			case 1:
				if (gamertag) { switchTab(`/service_record/${gamertag}`); }
				else { switchTab("/something_went_wrong"); }
				break;
			case 2:
				setExpandMaps(!expandMaps);
				setExpandModes(false);
				setExpandOutcome(false);
				setExpandRanked(false);
				break;
			case 4:
				setExpandMaps(false);
				setExpandModes(!expandModes);
				setExpandOutcome(false);
				setExpandRanked(false);
				break;
			case 6:
				setExpandMaps(false);
				setExpandModes(false);
				setExpandOutcome(!expandOutcome);
				setExpandRanked(false);
				break;
			case 8:
				setExpandMaps(false);
				setExpandModes(false);
				setExpandOutcome(false);
				setExpandRanked(!expandRanked);
				break;
			case 10:
				if (gamertag) { switchTab(`/medals/${gamertag}`); }
				else { switchTab("/something_went_wrong"); }
				break;
			case 11:
				if (gamertag) { switchTab(`/matches/${gamertag}`); }
				else { switchTab("/something_went_wrong"); }
				break;
			default: 
				console.log("Something unexpected was pressed in the tabs: " + newValue);
				break;
		}
	}

	/**
	 * Triggered when a tab is clicked
	 * @param event 
	 * @param newValue 
	 */
	function mapClicked(event: SyntheticEvent<Element, Event>, newValue: number)
	{
		const map = event.currentTarget.textContent;
		const gamertag = loggedInUser?.user?.displayName;
		if (gamertag) { switchTab(`/service_record/map/${map}/${gamertag}`); }
		else { switchTab("/something_went_wrong"); }
	}

	/**
	 * Triggered when a tab is clicked
	 * @param event 
	 * @param newValue 
	 */
	function modeClicked(event: SyntheticEvent<Element, Event>, newValue: number)
	{
		const mode = event.currentTarget.textContent;
		const gamertag = loggedInUser?.user?.displayName;
		if (gamertag) { switchTab(`/service_record/mode/${mode}/${gamertag}`); }
		else { switchTab("/something_went_wrong"); }
	}

	 /**
	 * Triggered when a tab is clicked
	 * @param event 
	 * @param newValue 
	 */
	function outcomeClicked(event: SyntheticEvent<Element, Event>, newValue: number)
	{
		const gamertag = loggedInUser?.user?.displayName;
		if (!gamertag) 
		{ 
			switchTab("/something_went_wrong"); 
			return;
		}

		switch (newValue)
		{
			case 0:
				switchTab(`/service_record/outcome/win/${gamertag}`);
				break;
			case 1:
				switchTab(`/service_record/outcome/loss/${gamertag}`);
				break;
			case 2:
				switchTab(`/service_record/outcome/draw/${gamertag}`);
				break;
			case 3:
				switchTab(`/service_record/outcome/left/${gamertag}`);
				break;
		}
	}

	/**
	 * Triggered when a tab is clicked
	 * @param event 
	 * @param newValue 
	 */
	function rankedClicked(event: SyntheticEvent<Element, Event>, newValue: number)
	{
		const gamertag = loggedInUser?.user?.displayName;
		if (!gamertag) 
		{ 
			switchTab("/something_went_wrong"); 
			return;
		}

		switch (newValue)
		{
			case 0:
				switchTab(`/service_record/isRanked/true/${gamertag}`);
				break;
			case 1:
				switchTab(`/service_record/isRanked/false/${gamertag}`);
				break;
		}
	}

	useEffect(() =>
	{
		
	}, [loggedInUser]);
	
	//#region Drawer
	const drawer = (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<Toolbar><Typography variant="h6" sx={{ padding: 2 }}>Halo Team Stats</Typography></Toolbar>
			<Divider flexItem />
				{loggedInUser?.user ? 
				<Tabs orientation="vertical" value={currentTab === 2 || currentTab === 4 || currentTab === 6 || currentTab === 8 ? -1 : currentTab} onChange={tabClicked} sx={{ mt: 5 }}>
					<Tab className="ahTab" label="Home" icon={<HomeIcon />} iconPosition="start" />
					<Tab className="ahTab" label="Service Record" icon={<ModeStandbyIcon />} iconPosition="start" />
					<Tab className="ahTab" label="Maps" icon={expandMaps ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Collapse in={expandMaps} timeout="auto" unmountOnExit>
						<Tabs orientation="vertical" value={currentTab === 2 ? subtab : -1} onChange={mapClicked} sx={{ borderBottom: "0.5px solid", borderColor: "divider" }}>
							<Tab className="ahTab" label="Aquarius" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Bazaar" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Behemoth" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Deadlock" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Fragmentation" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Highpower" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Launch Site" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Live Fire" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Recharge" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Streets" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
						</Tabs>
					</Collapse>
					<Tab className="ahTab" label="Modes" icon={expandModes ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Collapse in={expandModes} timeout="auto" unmountOnExit>
						<Tabs orientation="vertical" value={currentTab === 4 ? subtab : -1} onChange={modeClicked} sx={{ borderBottom: "0.5px solid", borderColor: "divider" }}>
							<Tab className="ahTab" label="CTF" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="FFA Slayer" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Fiesta" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Oddball" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Slayer" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Stockpile" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Strongholds" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Tactical Slayer" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Total Control" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
						</Tabs>
					</Collapse>
					<Tab className="ahTab" label="Match Outcome" icon={expandOutcome ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Collapse in={expandOutcome} timeout="auto" unmountOnExit>
						<Tabs orientation="vertical" value={currentTab === 6 ? subtab : -1} onChange={outcomeClicked} sx={{ borderBottom: "0.5px solid", borderColor: "divider" }}>
							<Tab className="ahTab" label="Win" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Loss" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Draw" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Left Early" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
						</Tabs>
					</Collapse>
					<Tab className="ahTab" label="Ranked/Social" icon={expandRanked ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Collapse in={expandRanked} timeout="auto" unmountOnExit>
						<Tabs orientation="vertical" value={currentTab === 8 ? subtab : -1} onChange={rankedClicked} sx={{ borderBottom: "0.5px solid", borderColor: "divider" }}>
							<Tab className="ahTab" label="Ranked" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" label="Social" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
						</Tabs>
					</Collapse>
					<Tab className="ahTab" label="Medals" icon={<MilitaryTechIcon />} iconPosition="start" />
					<Tab className="ahTab" label="Matches" icon={<SportsEsportsIcon />} iconPosition="start" />
					<Tab className="ahTab" label={loggedInUser?.spartanCompany?.name ? loggedInUser.spartanCompany.name + " Company" : "Create or Join Spartan Company"} icon={<GroupsIcon />} iconPosition="start" />
				</Tabs> 
				: <Tabs orientation="vertical" value={currentTab} onChange={tabClicked} sx={{ mt: 5 }}>
					<Tab className="ahTab" label="Home" icon={<HomeIcon />} iconPosition="start" />
				</Tabs>}
			<Box sx={{ flexGrow: 1 }}></Box>
			{loggedInUser?.user ? <Button sx={{ alignSelf: "flex-start", justifySelf: "flex-end", mb: 2, ml: 2 }} startIcon={<LogoutIcon />} onClick={() => onLogout()}>Log Out</Button> : undefined}
		</Box>
	);
	//#endregion

	return (
		<Box component="nav" sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
			<Drawer container={container} variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }}}>
				{drawer}
			</Drawer>
			<Drawer variant="permanent" open sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }}}>
				{drawer}
			</Drawer>
		</Box>
	);
}