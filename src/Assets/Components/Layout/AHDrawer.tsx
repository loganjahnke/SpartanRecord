import { SyntheticEvent } from "react";
import { Box, Button, Divider, Drawer, Link, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { Leaderboard, ServiceRecordFilter } from "../../../Database/ArrowheadFirebase";
import { Player } from "../../../Objects/Model/Player";

import PrimaryLogo from "../../Images/Primary/Spartan-Record-Logo-Primary-White.png";

import { MatchesIcon, MedalsIcon, ModesIcon, PlaylistsIcon, RankedIcon, SearchIcon, ServiceRecordIcon, SocialIcon, VariantsIcon, CreditsIcon, SpartanCompanyIcon } from "../../Icons/CustomIcons";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { UsbRounded, GamepadRounded, LeaderboardRounded, LockOutlined, CompareArrows, PlayArrow } from "@mui/icons-material";

export enum SRTabs
{
	Search = "Search",

	ServiceRecord = "Service Record",
	CareerRank = "Career Rank",
	Compare = "Compare",
	Playlists = "Playlists",
	Variants = "Variants",
	Social = "Social",
	Ranked = "Ranked",
	SRCustoms = "Customs Stats",
	SRLocal = "LAN Stats",
	
	Medals = "Medals",
	Modes = "Modes",

	Matches = "Matches",
	MatchesCustoms = "Customs",
	MatchesLocal = "LAN",
	MatchesBeta = "MatchesBeta",
	BestMatches = "Best Matches",
	SpartanCompany = "Spartan Company",
	VariantsExtended = "Variants Extended",
	
	Leaderboard = "Leaderboards",
	Clips = "Clips",
	ActivePlaylists = "Active Playlists",
	Store = "Store",
	
	Maps = "Maps",
	MatchOutcome = "Match Outcome",
	Patreon = "Patreon",
	Yesterday = "Yesterday",

	None = "",
}

interface AHDrawerProps
{
	/** The chosen gamertag */
	player: Player;
	/** Current tab */
	currentTab: string;
	/** Callback for when a tab button is pressed */
	switchTab: ((url: string, tab?: SRTabs, subtab?: string) => void);
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
	 * @param _event unused
	 * @param newTab the new tab
	 */
	function tabClicked(_event: SyntheticEvent<Element, Event>, newTab: string)
	{
		switch (newTab)
		{
			case SRTabs.Search:
				switchTab("/", newTab);
				break;
			case SRTabs.ServiceRecord:
				switchTab(`/service_record/${player.gamertag}`, newTab);
				break;
			case SRTabs.CareerRank:
				switchTab(`/career_rank/${player.gamertag}`, newTab);
				break;
			case SRTabs.Playlists:
				switchTab(`/service_record/${ServiceRecordFilter.Playlist}/${player.gamertag}`, newTab);
				break;
			case SRTabs.Variants:
				switchTab(`/service_record/${ServiceRecordFilter.Variant}/${player.gamertag}`, newTab);
				break;
			case SRTabs.Social:
				switchTab(`/service_record/${ServiceRecordFilter.Social}/${player.gamertag}`, newTab);
				break;
			case SRTabs.Ranked:
				switchTab(`/service_record/${ServiceRecordFilter.Ranked}/${player.gamertag}`, newTab);
				break;
			case SRTabs.Medals:
				switchTab(`/medals/${player.gamertag}`, newTab);
				break;
			case SRTabs.Modes:
				switchTab(`/modes/${player.gamertag}`, newTab);
				break;
			case SRTabs.SRCustoms:
				switchTab(`/service_record/${ServiceRecordFilter.Customs}/${player.gamertag}`, newTab);
				break;
			case SRTabs.SRLocal:
				switchTab(`/service_record/${ServiceRecordFilter.Local}/${player.gamertag}`, newTab);
				break;
			case SRTabs.Matches:
				switchTab(`/matches/${player.gamertag}`, newTab);
				break;
			case SRTabs.MatchesCustoms:
				switchTab(`/customs/${player.gamertag}`, newTab);
				break;
			case SRTabs.MatchesLocal:
				switchTab(`/LAN/${player.gamertag}`, newTab);
				break;
			case SRTabs.MatchesBeta:
				switchTab(`/beta/matches/${player.gamertag}`, newTab);
				break;
			case SRTabs.SpartanCompany:
				switchTab(`/spartan_company`, newTab);
				break;
			case SRTabs.Leaderboard:
				switchTab(`/leaderboard/${player.gamertag}/${Leaderboard.Accuracy}`, newTab);
				break;
			// Patreon exclusives
			case SRTabs.Patreon:
				switchTab(`/patreon/${player.gamertag}`, newTab);
				break;
			case SRTabs.Maps:
				if (!isAllowed) { switchTab(`/patreon/${player.gamertag}`, newTab); break; }
				switchTab(`/service_record/${ServiceRecordFilter.Maps}/${player.gamertag}`, newTab);
				break;
			case SRTabs.MatchOutcome:
				if (!isAllowed) { switchTab(`/patreon/${player.gamertag}`, newTab); break; }
				switchTab(`/service_record/${ServiceRecordFilter.Outcomes}/${player.gamertag}`, newTab);
				break;
			case SRTabs.BestMatches:
				if (!isAllowed) { switchTab(`/patreon/${player.gamertag}`, newTab); break; }
				switchTab(`/best/matches/${player.gamertag}`, newTab);
				break;
			case SRTabs.Yesterday:
				switchTab(`/yesterday/${player.gamertag}`, newTab);
				break;
			case SRTabs.Compare:
				switchTab(`/compare/${player.gamertag}`, newTab);
				break;
			case SRTabs.ActivePlaylists:
				switchTab(`/playlists`, newTab);
				break;
			case SRTabs.Store:
				switchTab(`/store`, newTab);
				break;
			case SRTabs.Clips:
				switchTab(`/clips/${player.gamertag}`, newTab);
				break;
			case SRTabs.None:
				break;
			default: 
				console.log("Something unexpected was pressed in the tabs: " + newTab);
				break;
		}
	}

	/** Goes home */
	function goHome()
	{
		switchTab("/", SRTabs.Search);
	}
	
	//#region Drawer
	const drawer = (
		<Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<Toolbar>
				<Button onClick={goHome}><img src={PrimaryLogo} alt="Spartan Record" height="32px" /></Button>
			</Toolbar>
			<Divider flexItem />
			<Box sx={
				{ 
					pt: 5, 
					pb: 5, 
					overflowY: "auto", 
					"button": 
					{ 
						textTransform: "none", 
						textAlign: "left", 
						justifyContent: "left", 
						color: ArrowheadTheme.text_secondary 
					}, 
					".Mui-selected": { color: ArrowheadTheme.selected + " !important" }, 
					".MuiTabs-indicator": { backgroundColor: ArrowheadTheme.selected + " !important" } 
				}}>
				{player && player.gamertag && isAllowed ? 
				<Tabs orientation="vertical" value={currentTab} onChange={tabClicked}>
					<Tab value={SRTabs.Search} label={SRTabs.Search} icon={<SearchIcon />} iconPosition="start" />
					<Tab value={SRTabs.ServiceRecord} label={SRTabs.ServiceRecord} icon={<ServiceRecordIcon />} iconPosition="start" />
					<Tab value={SRTabs.CareerRank} label={SRTabs.CareerRank} icon={<SpartanCompanyIcon fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab value={SRTabs.Compare} label={SRTabs.Compare} icon={<CompareArrows fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					{/* <Tab value={SRTabs.Yesterday} label={SRTabs.Yesterday} icon={<EventRepeat fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" /> */}
					<Tab value={SRTabs.Playlists} label={SRTabs.Playlists} icon={<PlaylistsIcon fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab value={SRTabs.Variants} label={SRTabs.Variants} icon={<VariantsIcon fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab value={SRTabs.Social} label={SRTabs.Social} icon={<SocialIcon fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab value={SRTabs.Ranked} label={SRTabs.Ranked} icon={<RankedIcon fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab value={SRTabs.SRCustoms} label="Customs" icon={<GamepadRounded fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab value={SRTabs.SRLocal} label="LAN" icon={<UsbRounded fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					{/* <Tab value={SRTabs.Maps} label={SRTabs.Maps} icon={<MapIcon fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" /> */}
					{/* <Tab value={SRTabs.MatchOutcome} label={SRTabs.MatchOutcome} icon={<MatchOutcomeIcon fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" /> */}
					<Tab value={SRTabs.Medals} label={SRTabs.Medals} icon={<MedalsIcon />} iconPosition="start" />
					<Tab value={SRTabs.Modes} label={SRTabs.Modes} icon={<ModesIcon />} iconPosition="start" />
					<Tab value={SRTabs.Matches} label={SRTabs.Matches} icon={<MatchesIcon />} iconPosition="start" />
					<Tab value={SRTabs.MatchesCustoms} label={SRTabs.MatchesCustoms} icon={<GamepadRounded fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab value={SRTabs.MatchesLocal} label={SRTabs.MatchesLocal} icon={<UsbRounded fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					{/* <Tab value={SRTabs.BestMatches} label={SRTabs.BestMatches} icon={<BestMatchIcon fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" /> */}
					{/* <Tab value={SRTabs.Patreon} label={SRTabs.Patreon} icon={<EmojiEmotionsIcon />} iconPosition="start" />*/}
					<Tab value={SRTabs.Leaderboard} label={SRTabs.Leaderboard} icon={<LeaderboardRounded />} iconPosition="start" />
					<Tab value={SRTabs.Clips} label={SRTabs.Clips} icon={<PlayArrow />} iconPosition="start" />
					<Tab value={SRTabs.ActivePlaylists} label={SRTabs.ActivePlaylists} icon={<PlaylistsIcon />} iconPosition="start" />
					<Tab value={SRTabs.Store} label={SRTabs.Store} icon={<CreditsIcon />} iconPosition="start" />
					{/* <Tab value={SRTabs.SpartanCompany} label={<div>{SRTabs.SpartanCompany}<br/><Box sx={{ fontSize: "0.6rem", textTransform: "uppercase" }}>Beta</Box></div>} icon={<SpartanCompanyIcon />} iconPosition="start" /> */}
				</Tabs>
				: player && player.isPrivate ?
				<Tabs orientation="vertical" value={currentTab} onChange={tabClicked}>
					<Tab value={SRTabs.Search} label={SRTabs.Search} icon={<SearchIcon />} iconPosition="start" />
					<Tab value={SRTabs.ServiceRecord} label={SRTabs.ServiceRecord} icon={<LockOutlined />} iconPosition="start" />
					<Tab value={SRTabs.ActivePlaylists} label={SRTabs.ActivePlaylists} icon={<PlaylistsIcon />} iconPosition="start" />
					<Tab value={SRTabs.Store} label={SRTabs.Store} icon={<CreditsIcon />} iconPosition="start" />
					{/* <Tab value={SRTabs.SpartanCompany} label={<div>{SRTabs.SpartanCompany}<br/><Box sx={{ fontSize: "0.6rem", textTransform: "uppercase" }}>Beta</Box></div>} icon={<SpartanCompanyIcon />} iconPosition="start" /> */}
				</Tabs>
				: player && player.gamertag ?
				<Tabs orientation="vertical" value={currentTab} onChange={tabClicked}>
					<Tab value="Search" label="Search" icon={<SearchIcon />} iconPosition="start" />
					<Tab value={SRTabs.ServiceRecord} label={SRTabs.ServiceRecord} icon={<ServiceRecordIcon />} iconPosition="start" />
					<Tab value={SRTabs.CareerRank} label={SRTabs.CareerRank} icon={<SpartanCompanyIcon fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab value={SRTabs.Compare} label={SRTabs.Compare} icon={<CompareArrows fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					{/* <Tab value={SRTabs.Yesterday} label={SRTabs.Yesterday} icon={<EventRepeat fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" /> */}
					<Tab value={SRTabs.Playlists} label={SRTabs.Playlists} icon={<PlaylistsIcon fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab value={SRTabs.Variants} label={SRTabs.Variants} icon={<VariantsIcon fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab value={SRTabs.Social} label={SRTabs.Social} icon={<SocialIcon fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab value={SRTabs.Ranked} label={SRTabs.Ranked} icon={<RankedIcon fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab value={SRTabs.SRCustoms} label="Customs" icon={<GamepadRounded fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab value={SRTabs.SRLocal} label="LAN" icon={<UsbRounded fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab value={SRTabs.Medals} label={SRTabs.Medals} icon={<MedalsIcon />} iconPosition="start" />
					<Tab value={SRTabs.Modes} label={SRTabs.Modes} icon={<ModesIcon />} iconPosition="start" />
					<Tab value={SRTabs.Matches} label={SRTabs.Matches} icon={<MatchesIcon />} iconPosition="start" />
					<Tab value={SRTabs.MatchesCustoms} label={SRTabs.MatchesCustoms} icon={<GamepadRounded fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab value={SRTabs.MatchesLocal} label={SRTabs.MatchesLocal} icon={<UsbRounded fontSize="inherit" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					{/* <Tab value={SRTabs.Patreon} label={SRTabs.Patreon} icon={<EmojiEmotionsIcon />} iconPosition="start" />
					<Tab value={SRTabs.Maps} label={SRTabs.Maps} icon={<LockOutlinedIcon fontSize="small" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab value={SRTabs.MatchOutcome} label={SRTabs.MatchOutcome} icon={<LockOutlinedIcon fontSize="small" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" />
					<Tab value={SRTabs.BestMatches} label={SRTabs.BestMatches} icon={<LockOutlinedIcon fontSize="small" />} sx={{ fontSize: "0.8rem", ml: 3, minHeight: 0 }} iconPosition="start" /> */}
					<Tab value={SRTabs.Leaderboard} label={SRTabs.Leaderboard} icon={<LeaderboardRounded />} iconPosition="start" />
					<Tab value={SRTabs.Clips} label={SRTabs.Clips} icon={<PlayArrow />} iconPosition="start" />
					<Tab value={SRTabs.ActivePlaylists} label={SRTabs.ActivePlaylists} icon={<PlaylistsIcon />} iconPosition="start" />
					<Tab value={SRTabs.Store} label={SRTabs.Store} icon={<CreditsIcon />} iconPosition="start" />
					{/* <Tab value={SRTabs.SpartanCompany} label={<div>{SRTabs.SpartanCompany}<br/><Box sx={{ fontSize: "0.6rem", textTransform: "uppercase" }}>Beta</Box></div>} icon={<SpartanCompanyIcon />} iconPosition="start" /> */}
				</Tabs>
				:
				<Tabs orientation="vertical" value={currentTab} onChange={tabClicked}>
					<Tab value={SRTabs.Search} label={SRTabs.Search} icon={<SearchIcon />} iconPosition="start" />
					<Tab value={SRTabs.ActivePlaylists} label={SRTabs.ActivePlaylists} icon={<PlaylistsIcon />} iconPosition="start" />
					<Tab value={SRTabs.Store} label={SRTabs.Store} icon={<CreditsIcon />} iconPosition="start" />
					{/* <Tab value={SRTabs.SpartanCompany} label={<div>{SRTabs.SpartanCompany}<br/><Box sx={{ fontSize: "0.6rem", textTransform: "uppercase" }}>Beta</Box></div>} icon={<SpartanCompanyIcon />} iconPosition="start" /> */}
				</Tabs>
				}
			</Box>
			<Divider flexItem sx={{ flexGrow: 1 }} />
			<Box sx={{ display: "flex", flexDirection: "column", p: 1, textAlign: "center" }}>
				<Typography sx={{ m: 0.5 }} variant="body2"><Link sx={{ cursor: "pointer" }} onClick={() => switchTab("/donate")}>Donate</Link></Typography>
				<Typography sx={{ m: 0.5 }} variant="body2">Powered by <Link href="https://twitter.com/halodotip">{process.env.REACT_APP_API_NAME}</Link></Typography>
				<Typography sx={{ m: 0.5 }} variant="body2">Made by <Link href="https://twitter.com/Logan_Jahnke">Logan Jahnke</Link></Typography>
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