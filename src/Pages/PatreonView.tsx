import { Box, Button, Card, CardContent, CardMedia, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import { ServiceRecordIcon, SpartanCompanyIcon, RankedIcon, SocialIcon } from "../Assets/Icons/CustomIcons";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import { ViewProps } from "./Props/ViewProps";

import tier1 from "../Assets/Images/Patreon/banner-tier-1.png";
import tier2 from "../Assets/Images/Patreon/banner-tier-2.png";
import tier3 from "../Assets/Images/Patreon/banner-tier-3.png";
import { Debugger } from "../Objects/Helpers/Debugger";
import { VIP } from "../Objects/Model/VIP";
import { PlayerChip } from "../Assets/Components/PlayerAppearance/PlayerChip";
import { SRTabs } from "../Assets/Components/Layout/AHDrawer";
import { ArrowheadTheme } from "../Assets/Theme/ArrowheadTheme";

export function PatreonView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, isSubscribedToPatreon, updatePlayer, switchTab } = props;
	const { gamertag } = useParams();
	//#endregion

	//#region State
	const [isAdFree, setIsAdFree] = useState(isSubscribedToPatreon);
	const [VIPs, setVIPs] = useState<VIP[]>([]);
	//#endregion

	/** When a VIP is pressed */
	function openVIP(gamertag: string)
	{
		updatePlayer(gamertag);
		switchTab(`service_record/${gamertag}`, SRTabs.ServiceRecord);
	}

	/**
	 * Loads the data for the view
	 */
	const loadData = useCallback(async () => 
	{		
		Debugger.LoadView("PatreonView");

		// Update tab
		switchTab(undefined, SRTabs.Subscribe);

		// If no gamertag, isAdFree is false
		setIsAdFree(gamertag ? await app.GetIsSubscribedToPatreon(gamertag) : false);

		// Get all VIP gamertags
		setVIPs(await app.GetAllVIPs());

		// Log event
		app.logger.LogSubscribe();

	}, [app, gamertag, switchTab]);
	
	useEffect(() =>
	{
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gamertag]);

	const tier1items = <>
		<ListItem>
			<ListItemIcon>
				<ServiceRecordIcon />
			</ListItemIcon>
			<ListItemText sx={{ span: { fontSize: "0.85rem" }}} primary="Become a supporter of SpartanRecord.com" />
		</ListItem>
	</>;

	const tier2items = <ListItem>
		<ListItemIcon>
			<SpartanCompanyIcon />
		</ListItemIcon>
		<ListItemText sx={{ span: { fontSize: "0.85rem" }}} primary="Go ad-free! Never see an ad again on SpartanRecord.com" />
	</ListItem>;

	const tier3items = <>
		<ListItem>
			<ListItemIcon>
				<RankedIcon />
			</ListItemIcon>
			<ListItemText sx={{ span: { fontSize: "0.85rem" }}} primary="Receive a callout on the SpartanRecord.com website" />
		</ListItem>
		{/* <ListItem>
			<ListItemIcon>
				<VariantsIcon />
			</ListItemIcon>
			<ListItemText sx={{ span: { fontSize: "0.85rem" }}} primary="Receive early access to features while they are under development and testing" />
		</ListItem> */}
	</>;

	return (
		<Box component="main" className="pageContainer">
			<Toolbar />
			<Divider />
			<Box className="underToolbarContainer" sx={{ backgroundColor: "secondary.main", display: "flex", flexDirection: "column", textAlign: "left", alignItems: "flex-start" }}>
				<Box sx={{ textAlign: "center", width: "100%", mt: 6 }}>
					{isAdFree && gamertag && 
					<>
						<Typography variant="h3">Thank you for supporting Spartan Record!</Typography>
						<Typography variant="h6">{gamertag} has access to an ad-free experience.</Typography>
					</>}
					{!isAdFree && <>
						<Typography variant="h3">Support Spartan Record</Typography>
						<Typography variant="h6">Subscribe to our Patreon to gain access to additional benefits!</Typography>
						<Button sx={{ mt: 2 }} variant="outlined" startIcon={<RankedIcon />} href="https://patreon.com/spartanrecord?utm_medium=clipboard_copy&utm_source=copyLink&utm_campaign=creatorshare_creator&utm_content=join_link">Subscribe</Button>
						<Button sx={{ mt: 2, ml: 2 }} variant="outlined" startIcon={<SocialIcon />} href="https://www.paypal.com/donate/?hosted_button_id=FTQWP27P5JMPG">One-Time Donation</Button>
					</>}
				</Box>
				<Grid container spacing={8} sx={{ mt: 6, pl: 4, pr: 4 }}>
					<Grid item xs={12} sm={4}>
						<Card>
							<CardMedia component="img" image={tier1} />
							<CardContent>
								<List>
									{tier1items}
								</List>
								<Typography sx={{ textAlign: "right" }} variant="h6">
									$3/month
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Card>
							<CardMedia component="img" image={tier2} />
							<CardContent>
								<List>
									{tier1items}
									{tier2items}
								</List>
								<Typography sx={{ textAlign: "right" }} variant="h6">
									$5/month
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Card>
							<CardMedia component="img" image={tier3} />
							<CardContent>
								<List>
									{tier1items}
									{tier2items}
									{tier3items}
								</List>
								<Typography sx={{ textAlign: "right" }} variant="h6">
									$12/month
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
				<Box sx={{ mt: 6, mb: 6, width: "100%" }}>
					<Box sx={{ p: 2, display: "flex", textAlign: "center", alignItems: "center", flexDirection: "column", backgroundColor: ArrowheadTheme.background, borderRadius: 4 }}>
						<Typography variant="h3">VIP Subscribers</Typography>
						<Box sx={{ maxWidth: "400px", mt: 2 }}>
							{VIPs.map(vip => <PlayerChip player={vip} onClick={openVIP} />)}
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}