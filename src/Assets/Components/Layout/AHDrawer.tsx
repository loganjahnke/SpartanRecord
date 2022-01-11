import { SyntheticEvent, useState } from "react";
import { Box, Collapse, Divider, Drawer, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { Company } from "../../../Objects/Model/Company";

import GroupsIcon from '@mui/icons-material/Groups';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

interface AHDrawerProps
{
	/** The spartan company */
	spartanCompany: Company;
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
	/** The currently selected gamertag */
	gamertag?: string;
}

export function AHDrawer(props: AHDrawerProps)
{
	const { spartanCompany, currentTab, subtab, switchTab, handleDrawerToggle, container, mobileOpen, gamertag } = props;

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
		switch (newValue)
		{
			case 0:
				switchTab(`/`);
				break;
			case 1:
				switchTab(`/sr/${gamertag}`);
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
				switchTab(`/medals/${gamertag}`);
				break;
			case 11:
				switchTab(`/matches/${gamertag}`);
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
		switchTab(`/sr/map/${map}/${gamertag}`);
	}

	/**
	 * Triggered when a tab is clicked
	 * @param event 
	 * @param newValue 
	 */
	function modeClicked(event: SyntheticEvent<Element, Event>, newValue: number)
	{
		const mode = event.currentTarget.textContent;
		switchTab(`/sr/mode/${mode}/${gamertag}`);
	}

	 /**
	 * Triggered when a tab is clicked
	 * @param event 
	 * @param newValue 
	 */
	function outcomeClicked(event: SyntheticEvent<Element, Event>, newValue: number)
	{
		switch (newValue)
		{
			case 0:
				switchTab(`/sr/outcome/win/${gamertag}`);
				break;
			case 1:
				switchTab(`/sr/outcome/loss/${gamertag}`);
				break;
			case 2:
				switchTab(`/sr/outcome/draw/${gamertag}`);
				break;
			case 3:
				switchTab(`/sr/outcome/left/${gamertag}`);
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
		switch (newValue)
		{
			case 0:
				switchTab(`/sr/isRanked/true/${gamertag}`);
				break;
			case 1:
				switchTab(`/sr/isRanked/false/${gamertag}`);
				break;
		}
	}
	
	//#region Drawer
	const drawer = (
		<div>
			<Toolbar><Typography variant="h6" sx={{ padding: 2 }}>{spartanCompany.name} Company</Typography></Toolbar>
			<Divider />
				{gamertag ? 
				<Tabs orientation="vertical" value={currentTab === 2 || currentTab === 4 || currentTab === 6 || currentTab === 8 ? -1 : currentTab} onChange={tabClicked} sx={{ mt: 5 }}>
					<Tab className="ahTab" label="Company" icon={<GroupsIcon />} iconPosition="start" />
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
					{/* <Tab className="ahTab" label="Matches" icon={<SportsEsportsIcon />} iconPosition="start" /> */}
				</Tabs> 
				: <Tabs orientation="vertical" value={currentTab} onChange={tabClicked} sx={{ mt: 5 }}>
					<Tab className="ahTab" label="Company" icon={<GroupsIcon />} iconPosition="start" />
				</Tabs>}
		</div>
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