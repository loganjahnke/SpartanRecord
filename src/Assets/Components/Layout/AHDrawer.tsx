import { SyntheticEvent } from "react";
import { Box, Divider, Drawer, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { Company } from "../../../Objects/Model/Company";

import GroupsIcon from '@mui/icons-material/Groups';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

interface AHDrawerProps
{
	/** The spartan company */
	spartanCompany: Company;
	/** Current tab */
	currentTab: number;
	/** Callback for when a tab button is pressed */
	onTabClick: (event: SyntheticEvent<Element, Event>, value: any) => void;
	/** Callback for when the drawer is opened or closed */
	handleDrawerToggle?: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void);
	/** The container */
	container?: Element | (() => HTMLElement);
	/** Open on mobile? */
	mobileOpen?: boolean;
	/** Has user? */
	hasUser: boolean;
}

export function AHDrawer(props: AHDrawerProps)
{
	const { spartanCompany, currentTab, onTabClick, handleDrawerToggle, container, mobileOpen, hasUser } = props;
	
	//#region Drawer
	const drawer = (
		<div>
			<Toolbar><Typography variant="h6" sx={{ padding: 2 }}>{spartanCompany.name} Company</Typography></Toolbar>
			<Divider />
			<Tabs orientation="vertical" value={currentTab} onChange={onTabClick} sx={{ mt: 5 }}>
				<Tab className="ahTab" label="Company" icon={<GroupsIcon />} iconPosition="start" />
				{hasUser ? <Tab className="ahTab" label="Service Record" icon={<ModeStandbyIcon />} iconPosition="start" /> : undefined}
				{hasUser ? <Tab className="ahTab" label="Medals" icon={<MilitaryTechIcon />} iconPosition="start" /> : undefined}
			</Tabs>
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