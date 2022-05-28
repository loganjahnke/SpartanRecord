import { SyntheticEvent } from "react";
import { Box, Button, Divider, Drawer, Link, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { ServiceRecordFilter } from "../../../Database/ArrowheadFirebase";
import { Player } from "../../../Objects/Model/Player";

import MapIcon from '@mui/icons-material/Map';
import ListIcon from '@mui/icons-material/List';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GamesIcon from '@mui/icons-material/Games';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import GroupsIcon from '@mui/icons-material/Groups';
import StarIcon from '@mui/icons-material/Star';
import FlagIcon from '@mui/icons-material/Flag';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

interface AHDrawerProps
{
	/** The chosen gamertag */
	player: Player;
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
	/** Does this gamertag have access to filters? */
	isAllowed?: boolean;
}

export function AHDrawer(props: AHDrawerProps)
{
	const { player, currentTab, switchTab, handleDrawerToggle, container, mobileOpen, isAllowed } = props;

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
				switchTab(`/service_record/${player.gamertag}`, newTab);
				break;
			case "Playlists":
				switchTab(`/service_record/${ServiceRecordFilter.Playlist}/${player.gamertag}`, newTab);
				break;
			case "Variants":
				switchTab(`/service_record/${ServiceRecordFilter.Variant}/${player.gamertag}`, newTab);
				break;
			case "Social":
				switchTab(`/service_record/${ServiceRecordFilter.Social}/${player.gamertag}`, newTab);
				break;
			case "Ranked":
				switchTab(`/service_record/${ServiceRecordFilter.Ranked}/${player.gamertag}`, newTab);
				break;
			case "Medals":
				switchTab(`/medals/${player.gamertag}`, newTab);
				break;
			case "Modes":
				switchTab(`/modes/${player.gamertag}`, newTab);
				break;
			case "Matches":
				switchTab(`/matches/${player.gamertag}`, newTab);
				break;
			case "Company":
				switchTab(`/arrowhead`, newTab);
				break;
			// Patreon exclusives
			case "Patreon":
				switchTab(`/patreon/${player.gamertag}`, newTab);
				break;
			case "Maps":
				if (!isAllowed) { switchTab(`/patreon/${player.gamertag}`, newTab); break; }
				switchTab(`/service_record/${ServiceRecordFilter.Maps}/${player.gamertag}`, newTab);
				break;
			case "Match Outcome":
				if (!isAllowed) { switchTab(`/patreon/${player.gamertag}`, newTab); break; }
				switchTab(`/service_record/${ServiceRecordFilter.Outcomes}/${player.gamertag}`, newTab);
				break;
			case "Best":
				if (!isAllowed) { switchTab(`/patreon/${player.gamertag}`, newTab); break; }
				switchTab(`/best/matches/${player.gamertag}`, newTab);
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
			<Toolbar>
				<Button className="ahTab" onClick={goHome}>SpartanRecord.com</Button>
			</Toolbar>
			<Divider flexItem />
			<Box sx={{ pt: 5, pb: 5, overflowY: "auto" }}>
				{player && player.gamertag && isAllowed ? 
				<Tabs orientation="vertical" value={currentTab || "Search"} onChange={tabClicked}>
					<Tab className="ahTab" value="Search" label="Search" icon={<PersonSearchIcon />} iconPosition="start" />
					<Tab className="ahTab" value="Service Record" label="Service Record" icon={<ModeStandbyIcon />} iconPosition="start" />
					<Tab className="ahTab" value="Playlists" label="Playlists" icon={<ListIcon fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab className="ahTab" value="Variants" label="Variants" icon={<GamesIcon fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab className="ahTab" value="Social" label="Social" icon={<GroupsIcon fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab className="ahTab" value="Ranked" label="Ranked" icon={<StarIcon fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab className="ahTab" value="Maps" label="Maps" icon={<MapIcon fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab className="ahTab" value="Match Outcome" label="Match Outcome" icon={<EmojiEventsIcon fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab className="ahTab" value="Medals" label="Medals" icon={<MilitaryTechIcon />} iconPosition="start" />
					<Tab className="ahTab" value="Modes" label="Modes" icon={<FlagIcon />} iconPosition="start" />
					<Tab className="ahTab" value="Matches" label="Matches" icon={<SportsEsportsIcon />} iconPosition="start" />
					<Tab className="ahTab" value="Best" label="Best Matches" icon={<StarIcon fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					{/* <Tab className="ahTab" value="Patreon" label="Patreon" icon={<EmojiEmotionsIcon />} iconPosition="start" />*/}
					{/* <Tab className="ahTab" value="Company" label="Spartan Company" icon={<GroupsIcon />} iconPosition="start" /> */}
				</Tabs>
				: player && player.gamertag ?
				<Tabs orientation="vertical" value={currentTab || "Search"} onChange={tabClicked}>
					<Tab className="ahTab" value="Search" label="Search" icon={<PersonSearchIcon />} iconPosition="start" />
					<Tab className="ahTab" value="Service Record" label="Service Record" icon={<ModeStandbyIcon />} iconPosition="start" />
					<Tab className="ahTab" value="Playlists" label="Playlists" icon={<ListIcon fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab className="ahTab" value="Variants" label="Variants" icon={<GamesIcon fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab className="ahTab" value="Social" label="Social" icon={<GroupsIcon fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab className="ahTab" value="Ranked" label="Ranked" icon={<StarIcon fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab className="ahTab" value="Medals" label="Medals" icon={<MilitaryTechIcon />} iconPosition="start" />
					<Tab className="ahTab" value="Modes" label="Modes" icon={<FlagIcon />} iconPosition="start" />
					<Tab className="ahTab" value="Matches" label="Matches" icon={<SportsEsportsIcon />} iconPosition="start" />
					{/* <Tab className="ahTab" value="Patreon" label="Patreon" icon={<EmojiEmotionsIcon />} iconPosition="start" />
					<Tab className="ahTab" value="Maps" label="Maps" icon={<LockOutlinedIcon fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab className="ahTab" value="Match Outcome" label="Match Outcome" icon={<LockOutlinedIcon fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab className="ahTab" value="Best" label="Best Matches" icon={<LockOutlinedIcon fontSize="small" />} sx={{ fontSize: "0.75rem", ml: 3, minHeight: 0 }} iconPosition="start" /> */}
					{/* <Tab className="ahTab" value="Company" label="Spartan Company" icon={<GroupsIcon />} iconPosition="start" /> */}
				</Tabs>
				:
				<Tabs orientation="vertical" value={currentTab || "Search"} onChange={tabClicked}>
					<Tab className="ahTab" value="Search" label="Search" icon={<PersonSearchIcon />} iconPosition="start" />
					{/* <Tab className="ahTab" value="Company" label="Spartan Company" icon={<GroupsIcon />} iconPosition="start" /> */}
				</Tabs>
				}
			</Box>
			<Divider flexItem sx={{ flexGrow: 1 }} />
			<Box sx={{ display: "flex", flexDirection: "column", p: 1 }}>
				<Typography variant="subtitle2"><Link href="https://www.paypal.com/donate/?hosted_button_id=FTQWP27P5JMPG">Donate with PayPal</Link></Typography>
				<Typography variant="subtitle2">Powered by <Link href="https://twitter.com/halodotapi">HaloDotAPI</Link></Typography>
				<Typography variant="subtitle2">Made by <Link href="https://twitter.com/Logan_Jahnke">Logan Jahnke</Link></Typography>
			</Box>
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