import { Box, Checkbox, Divider, FormControlLabel, FormGroup, Grid, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { MedalTypeBreakdown } from "../Assets/Components/Medals/MedalTypeBreakdown";
import { MedalType } from "../Objects/Pieces/Medal";
import { ViewProps } from "./Props/ViewProps";
import { SRTabs } from "../Assets/Components/Layout/AHDrawer";
import { Helmet } from "react-helmet";
import { Cookie } from "../Objects/Helpers/Cookie";
import { Debugger } from "../Objects/Helpers/Debugger";
import { FluidAd } from "../Assets/Components/Ads/FluidAd";

export function MedalsView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, isSubscribedToPatreon, setLoadingMessage, updatePlayer: setGamertag, switchTab } = props;
	const { gamertag } = useParams();
	//#endregion
	
	//#region State
	const [showAll, setShowAll] = useState(Cookie.getShowUnearnedMedals());
	const [serviceRecord, setServiceRecord] = useState(new ServiceRecord());
	//#endregion

	const loadData = useCallback(async () => 
	{		
		Debugger.LoadView("MedalsView");
		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Medals");
		
		// Get service record of gamertag
		if (gamertag)
		{
			// Set page gamertag and show loading message
			setGamertag(gamertag);
			const player = await app.GetMinimumPlayerDataFromFirebase(gamertag);
			setServiceRecord(player.serviceRecord);
		}

		app.logger.LogViewMedals();
		switchTab(undefined, SRTabs.Medals);
		setLoadingMessage("");
	}, [app, gamertag, setServiceRecord, switchTab, setGamertag, setLoadingMessage]);
	
	useEffect(() =>
	{
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gamertag]);

	function onPressShowAll(event: React.ChangeEvent<HTMLInputElement>)
	{
		setShowAll(event.target.checked);
		Cookie.setShowUnearnedMedals(event.target.checked);
	}

	return (
		<Box component="main" sx={{ flexGrow: 1 }}>
			<Helmet>
				<title>{`Spartan Record | Medals | ${gamertag}`}</title>
				<meta name="description" content={`Halo Infinite medals for ${gamertag}`} />
				<meta property="og:title" content="Spartan Record" />
				<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/medals/${gamertag}`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<Box sx={{ p: 2 }}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
							<Typography variant="button" sx={{ color: "primary.main" }}>Total Medals: </Typography>
							<Typography variant="button" sx={{ color: "primary.main", ml: 1 }}>{serviceRecord.summary.medals.toLocaleString()}</Typography>
							<Box sx={{ flexGrow: 1 }}></Box>
							<FormGroup sx={{ textAlign: "right" }}>
								<FormControlLabel control={<Checkbox checked={showAll} onChange={onPressShowAll} size="small" />} label={<Typography variant="subtitle1">Show All</Typography>} />
							</FormGroup>
						</Box>
					</Grid>
					{/* Classics */}
					<Grid item xs={12} sx={{ mt: 4 }}>
						<Typography variant="h2">Classics</Typography>
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.Spree} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.MultiKill} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					{!isSubscribedToPatreon && <Grid item xs={12} md={6} xl={4}>
						<FluidAd adId="4720270834" isAdFree={isSubscribedToPatreon} />
					</Grid>}
					{/* Game Modes */}
					<Grid item xs={12} sx={{ mt: 4 }}>
						<Typography variant="h2">Game Modes</Typography>
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.Assault} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.CTF} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.Infection} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.Elimination} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.Extraction} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.Juggernaut} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.KingOfTheHill} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.Oddball} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.Stockpile} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.Zone} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.VIP} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					{/* Weapons and Equipment */}
					<Grid item xs={12} sx={{ mt: 4 }}>
						<Typography variant="h2">Weapons and Equipment</Typography>
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.Vehicles} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.Sniper} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.Melee} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.Weapons} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.Boom} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.Equipment} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					{/* Other Medals */}
					<Grid item xs={12} sx={{ mt: 4 }}>
						<Typography variant="h2">Other Medals</Typography>
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.Skill} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.Assists} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.GameEnd} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6} xl={4}>
						<MedalTypeBreakdown type={MedalType.Unknown} medals={serviceRecord.medals} showAll={showAll} />
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}