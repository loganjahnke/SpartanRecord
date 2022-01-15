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

interface AHDrawerProps
{
	/** The app containing the user and their spartan company */
	loggedInUser?: ArrowheadUser;
	/** Current tab */
	currentTab: string;
	/** Subtab */
	subtab?: string;
	/** Callback for when a tab button is pressed */
	switchTab: ((url: string, tab?: string, subtab?: string) => void);
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

	const [expandMaps, setExpandMaps] = useState(currentTab === "Maps");
	const [expandModes, setExpandModes] = useState(currentTab === "Modes");
	const [expandOutcome, setExpandOutcome] = useState(currentTab === "Match Outcome");
	const [expandRanked, setExpandRanked] = useState(currentTab === "Ranked/Social");

	/**
	 * Triggered when a tab is clicked
	 * @param event 
	 * @param newTab 
	 */
	function tabClicked(event: SyntheticEvent<Element, Event>, newTab: string)
	{
		const gamertag = loggedInUser?.user?.displayName;
		switch (newTab)
		{
			case "Service Record":
				if (gamertag) { switchTab(`/service_record/${gamertag}`, newTab); }
				else { switchTab("/service_record/search", newTab); }
				break;
			case "Maps":
				setExpandMaps(!expandMaps);
				setExpandModes(false);
				setExpandOutcome(false);
				setExpandRanked(false);
				break;
			case "Modes":
				setExpandMaps(false);
				setExpandModes(!expandModes);
				setExpandOutcome(false);
				setExpandRanked(false);
				break;
			case "Match Outcome":
				setExpandMaps(false);
				setExpandModes(false);
				setExpandOutcome(!expandOutcome);
				setExpandRanked(false);
				break;
			case "Ranked/Social":
				setExpandMaps(false);
				setExpandModes(false);
				setExpandOutcome(false);
				setExpandRanked(!expandRanked);
				break;
			case "Medals":
				if (gamertag) { switchTab(`/medals/${gamertag}`, newTab); }
				else { switchTab("/something_went_wrong"); }
				break;
			case "Matches":
				if (gamertag) { switchTab(`/matches/${gamertag}`, newTab); }
				else { switchTab("/something_went_wrong"); }
				break;
			case "Company":
				switchTab(`/company/${loggedInUser?.spartanCompany?.name ?? "search"}`, newTab);
				break;
			default: 
				console.log("Something unexpected was pressed in the tabs: " + newTab);
				break;
		}
	}

	/**
	 * Triggered when a tab is clicked
	 * @param event 
	 * @param newTab 
	 */
	function mapClicked(event: SyntheticEvent<Element, Event>, newTab: string)
	{
		const gamertag = loggedInUser?.user?.displayName;
		if (gamertag) { switchTab(`/service_record/map/${newTab}/${gamertag}`, "Maps", newTab); }
		else { switchTab("/something_went_wrong"); }
	}

	/**
	 * Triggered when a tab is clicked
	 * @param event 
	 * @param newTab 
	 */
	function modeClicked(event: SyntheticEvent<Element, Event>, newTab: string)
	{
		const gamertag = loggedInUser?.user?.displayName;
		if (gamertag) { switchTab(`/service_record/mode/${newTab}/${gamertag}`, "Modes", newTab); }
		else { switchTab("/something_went_wrong"); }
	}

	 /**
	 * Triggered when a tab is clicked
	 * @param event 
	 * @param newTab 
	 */
	function outcomeClicked(event: SyntheticEvent<Element, Event>, newTab: string)
	{
		const gamertag = loggedInUser?.user?.displayName;
		if (!gamertag) 
		{ 
			switchTab("/something_went_wrong"); 
			return;
		}

		switch (newTab)
		{
			case "Win":
				switchTab(`/service_record/outcome/win/${gamertag}`, "Match Outcome", newTab);
				break;
			case "Loss":
				switchTab(`/service_record/outcome/loss/${gamertag}`, "Match Outcome", newTab);
				break;
			case "Draw":
				switchTab(`/service_record/outcome/draw/${gamertag}`, "Match Outcome", newTab);
				break;
			case "Left Early":
				switchTab(`/service_record/outcome/left/${gamertag}`, "Match Outcome", newTab);
				break;
			default:
				break;
		}
	}

	/**
	 * Triggered when a tab is clicked
	 * @param event 
	 * @param newTab 
	 */
	function rankedClicked(event: SyntheticEvent<Element, Event>, newTab: string)
	{
		const gamertag = loggedInUser?.user?.displayName;
		if (!gamertag) 
		{ 
			switchTab("/something_went_wrong"); 
			return;
		}

		switch (newTab)
		{
			case "Ranked":
				switchTab(`/service_record/isRanked/true/${gamertag}`, "Ranked/Social", newTab);
				break;
			case "Social":
				switchTab(`/service_record/isRanked/false/${gamertag}`, "Ranked/Social", newTab);
				break;
		}
	}

	/** Goes home */
	function goHome()
	{
		switchTab("/");
	}
	
	//#region Drawer
	const drawer = (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<Toolbar><Button className="ahTab" onClick={goHome}>SpartanRecord.com</Button></Toolbar>
			<Divider flexItem />
				{loggedInUser?.user ? 
				<Tabs orientation="vertical" value={currentTab === "Maps" || currentTab === "Modes" || currentTab === "Match Outcome" || currentTab === "Ranked/Social" ? undefined : currentTab} onChange={tabClicked} sx={{ mt: 5 }}>
					<Tab className="ahTab" value="Service Record" label="Service Record" icon={<ModeStandbyIcon />} iconPosition="start" />
					<Tab className="ahTab" value="Maps" label="Maps" icon={expandMaps ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Collapse in={expandMaps} timeout="auto" unmountOnExit>
						<Tabs orientation="vertical" value={currentTab === "Maps" ? subtab : undefined} onChange={mapClicked} sx={{ borderBottom: "0.5px solid", borderColor: "divider" }}>
							<Tab className="ahTab" value="Aquarius" label="Aquarius" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Bazaar" label="Bazaar" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Behemoth" label="Behemoth" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Deadlock" label="Deadlock" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Fragmentation" label="Fragmentation" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Highpower" label="Highpower" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Launch Site" label="Launch Site" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Live Fire" label="Live Fire" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Recharge" label="Recharge" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Streets" label="Streets" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
						</Tabs>
					</Collapse>
					<Tab className="ahTab" value="Modes" label="Modes" icon={expandModes ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Collapse in={expandModes} timeout="auto" unmountOnExit>
						<Tabs orientation="vertical" value={currentTab === "Modes" ? subtab : undefined} onChange={modeClicked} sx={{ borderBottom: "0.5px solid", borderColor: "divider" }}>
							<Tab className="ahTab" value="CTF" label="CTF" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="FFA Slayer" label="FFA Slayer" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Fiesta" label="Fiesta" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Oddball" label="Oddball" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Slayer" label="Slayer" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Stockpile" label="Stockpile" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Strongholds" label="Strongholds" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Tactical Slayer" label="Tactical Slayer" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Total Control" label="Total Control" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
						</Tabs>
					</Collapse>
					<Tab className="ahTab" value="Match Outcome" label="Match Outcome" icon={expandOutcome ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Collapse in={expandOutcome} timeout="auto" unmountOnExit>
						<Tabs orientation="vertical" value={currentTab === "Match Outcome" ? subtab : undefined} onChange={outcomeClicked} sx={{ borderBottom: "0.5px solid", borderColor: "divider" }}>
							<Tab className="ahTab" value="Win" label="Win" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Loss" label="Loss" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Draw" label="Draw" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Left Early" label="Left Early" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
						</Tabs>
					</Collapse>
					<Tab className="ahTab" value="Ranked/Social" label="Ranked/Social" icon={expandRanked ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Collapse in={expandRanked} timeout="auto" unmountOnExit>
						<Tabs orientation="vertical" value={currentTab === "Ranked/Social" ? subtab : undefined} onChange={rankedClicked} sx={{ borderBottom: "0.5px solid", borderColor: "divider" }}>
							<Tab className="ahTab" value="Ranked" label="Ranked" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
							<Tab className="ahTab" value="Social" label="Social" sx={{ fontSize: "0.75rem", minHeight: 0, ml: 9 }} iconPosition="start" />
						</Tabs>
					</Collapse>
					<Tab className="ahTab" value="Medals" label="Medals" icon={<MilitaryTechIcon />} iconPosition="start" />
					<Tab className="ahTab" value="Matches" label="Matches" icon={<SportsEsportsIcon />} iconPosition="start" />
					<Tab className="ahTab" value="Company" label={loggedInUser?.spartanCompany?.name ? loggedInUser.spartanCompany.name + " Company" : "Create or Join Spartan Company"} icon={<GroupsIcon />} iconPosition="start" />
				</Tabs> 
				: <Tabs orientation="vertical" value={currentTab} onChange={tabClicked} sx={{ mt: 5 }}>
					<Tab className="ahTab" value="Service Record" label="Service Record" icon={<ModeStandbyIcon />} iconPosition="start" />
					<Tab className="ahTab" value="Company" label="Spartan Company" icon={<GroupsIcon />} iconPosition="start" />
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