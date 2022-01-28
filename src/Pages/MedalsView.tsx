import { Box, Checkbox, Divider, FormControlLabel, FormGroup, Grid, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { MedalTypeBreakdown } from "../Assets/Components/Medals/MedalTypeBreakdown";
import { MedalType } from "../Objects/Pieces/Medal";
import { ViewProps } from "./Props/ViewProps";

export function MedalsView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage } = props;
	const { gamertag } = useParams();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
	const [showAll, setShowAll] = useState(false);
	const [mySR, setMySR] = useState(app.arrowheadUser?.player?.serviceRecord ?? new ServiceRecord());
	//#endregion

	const loadData = useCallback(async () => 
	{		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Service Records");
		
		// Get last update instant
		lastUpdate.current = await app.db.GetLastUpdate();
		
		// Get player's service record
		if (gamertag && gamertag === app.arrowheadUser?.player?.gamertag)
		{
			setLoadingMessage("Loading " + gamertag);
			app.LogViewServiceRecord(gamertag);
			if (app.arrowheadUser.player.serviceRecord)
			{
				setMySR(app.arrowheadUser.player.serviceRecord);	
			}
			else
			{
				app.arrowheadUser.player = await app.db.GetPlayer(gamertag);
				setMySR(app.arrowheadUser.player.serviceRecord);
			}			
		}
		else if (gamertag)
		{
			setLoadingMessage("Loading " + gamertag);
			const player = await app.db.GetPlayer(gamertag);
			setMySR(player.serviceRecord);
			app.LogViewMedals(gamertag);
		}

		setLoadingMessage("");
	}, [lastUpdate, app, gamertag, setMySR]);
	
	useEffect(() =>
	{
		loadData();
	}, [gamertag]);

	function onPressShowAll(event: React.ChangeEvent<HTMLInputElement>)
	{
		setShowAll(event.target.checked);
	}

	return (
		<Box component="main" sx={{ flexGrow: 1 }}>
			<Toolbar />
			<Divider />
			<Box sx={{ p: 2 }}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
							<Typography variant="button" sx={{ color: "primary.main" }}>Total Medals: </Typography>
							<Typography variant="button" sx={{ color: "primary.main", ml: 1 }}>{mySR.summary.medals.toLocaleString()}</Typography>
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
					<Grid item xs={12} md={6}>
						<MedalTypeBreakdown type={MedalType.Spree} medals={mySR.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} md={6}>
						<MedalTypeBreakdown type={MedalType.MultiKill} medals={mySR.medals} showAll={showAll} />
					</Grid>
					{/* Game Modes */}
					<Grid item xs={12} sx={{ mt: 4 }}>
						<Typography variant="h2">Game Modes</Typography>
					</Grid>
					<Grid item xs={12} lg={4}>
						<MedalTypeBreakdown type={MedalType.Assault} medals={mySR.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MedalTypeBreakdown type={MedalType.CTF} medals={mySR.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MedalTypeBreakdown type={MedalType.Infection} medals={mySR.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MedalTypeBreakdown type={MedalType.Elimination} medals={mySR.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MedalTypeBreakdown type={MedalType.Extraction} medals={mySR.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MedalTypeBreakdown type={MedalType.Juggernaut} medals={mySR.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MedalTypeBreakdown type={MedalType.KingOfTheHill} medals={mySR.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MedalTypeBreakdown type={MedalType.Oddball} medals={mySR.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MedalTypeBreakdown type={MedalType.Stockpile} medals={mySR.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MedalTypeBreakdown type={MedalType.Strongholds} medals={mySR.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MedalTypeBreakdown type={MedalType.VIP} medals={mySR.medals} showAll={showAll} />
					</Grid>
					{/* Weapons and Equipment */}
					<Grid item xs={12} sx={{ mt: 4 }}>
						<Typography variant="h2">Weapons and Equipment</Typography>
					</Grid>
					<Grid item xs={12}>
						<MedalTypeBreakdown type={MedalType.Vehicles} medals={mySR.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} lg={6}>
						<MedalTypeBreakdown type={MedalType.Sniper} medals={mySR.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} lg={6}>
						<MedalTypeBreakdown type={MedalType.Melee} medals={mySR.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12}>
						<MedalTypeBreakdown type={MedalType.Weapons} medals={mySR.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} xl={6}>
						<MedalTypeBreakdown type={MedalType.Boom} medals={mySR.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} xl={6}>
						<MedalTypeBreakdown type={MedalType.Equipment} medals={mySR.medals} showAll={showAll} />
					</Grid>
					{/* Other Medals */}
					<Grid item xs={12} sx={{ mt: 4 }}>
						<Typography variant="h2">Other Medals</Typography>
					</Grid>
					<Grid item xs={12} xl={8}>
						<MedalTypeBreakdown type={MedalType.Skill} medals={mySR.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MedalTypeBreakdown type={MedalType.GameEnd} medals={mySR.medals} showAll={showAll} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MedalTypeBreakdown type={MedalType.Unknown} medals={mySR.medals} showAll={showAll} />
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}