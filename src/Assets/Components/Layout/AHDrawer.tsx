import { SyntheticEvent } from "react";
import { Box, Button, Divider, Drawer, Tab, Tabs, Toolbar } from "@mui/material";

import MapIcon from '@mui/icons-material/Map';
import ListIcon from '@mui/icons-material/List';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GamesIcon from '@mui/icons-material/Games';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

interface AHDrawerProps
{
	/** The chosen gamertag */
	gamertag: string;
	/** Current tab */
	currentTab: string;
	/** Callback for when a tab button is pressed */
	switchTab: ((url: string, tab?: string, subtab?: string) => void);
	/** Callback for when the drawer is opened or closed */
	handleDrawerToggle?: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void);
	/** The container */
	container?: Element | (() => HTMLElement);
	/** Open on mobile? */
	mobileOpen?: boolean;
}

export function AHDrawer(props: AHDrawerProps)
{
	const { gamertag, currentTab, switchTab, handleDrawerToggle, container, mobileOpen } = props;

	/**
	 * Triggered when a tab is clicked
	 * @param event 
	 * @param newTab 
	 */
	function tabClicked(event: SyntheticEvent<Element, Event>, newTab: string)
	{
		switch (newTab)
		{
			case "Search":
				switchTab("/", newTab);
				break;
			case "Service Record":
				switchTab(`/service_record/${gamertag}`, newTab);
				break;
			case "Maps":
				switchTab(`/maps/${gamertag}`, newTab);
				break;
			case "Playlists":
				switchTab(`/playlists/${gamertag}`, newTab);
				break;
			case "Variants":
				switchTab(`/variants/${gamertag}`, newTab);
				break;
			case "Match Outcome":
				switchTab(`/outcome/${gamertag}`, newTab);
				break;
			case "Medals":
				switchTab(`/medals/${gamertag}`, newTab);
				break;
			case "Matches":
				switchTab(`/matches/${gamertag}`, newTab);
				break;
			case "Company":
				switchTab(`/company/search`, newTab);
				break;
			default: 
				console.log("Something unexpected was pressed in the tabs: " + newTab);
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
				{gamertag ? 
				<Tabs orientation="vertical" value={currentTab} onChange={tabClicked} sx={{ mt: 5 }}>
					<Tab className="ahTab" value="Search" label="Search" icon={<PersonSearchIcon />} iconPosition="start" />
					<Tab className="ahTab" value="Service Record" label="Service Record" icon={<ModeStandbyIcon />} iconPosition="start" />
					<Tab className="ahTab" value="Maps" label="Maps" icon={<MapIcon fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab className="ahTab" value="Playlists" label="Playlists" icon={<ListIcon fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab className="ahTab" value="Variants" label="Variants" icon={<GamesIcon fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab className="ahTab" value="Match Outcome" label="Match Outcome" icon={<EmojiEventsIcon fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab className="ahTab" value="Medals" label="Medals" icon={<MilitaryTechIcon />} iconPosition="start" />
					<Tab className="ahTab" value="Matches" label="Matches" icon={<SportsEsportsIcon />} iconPosition="start" />
					{/* <Tab className="ahTab" value="Company" label={loggedInUser?.spartanCompany?.name ? loggedInUser.spartanCompany.name + " Company" : "Create or Join Spartan Company"} icon={<GroupsIcon />} iconPosition="start" /> */}
				</Tabs>
				:
				<Tabs orientation="vertical" value="Search" onChange={tabClicked} sx={{ mt: 5 }}>
					<Tab className="ahTab" value="Search" label="Search" icon={<PersonSearchIcon />} iconPosition="start" />
				</Tabs>
				}	
			<Box sx={{ flexGrow: 1 }}></Box>
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