import { Box, Divider, Grid, Toolbar } from "@mui/material";
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

	return (
		<Box component="main" sx={{ flexGrow: 1 }}>
			<Toolbar />
			<Divider />
			<Box sx={{ p: 2 }}>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<MedalTypeBreakdown type={MedalType.Spree} medals={mySR.medals} />
					</Grid>
					<Grid item xs={12} md={6}>
						<MedalTypeBreakdown type={MedalType.MultiKill} medals={mySR.medals} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MedalTypeBreakdown type={MedalType.CTF} medals={mySR.medals} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MedalTypeBreakdown type={MedalType.Oddball} medals={mySR.medals} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MedalTypeBreakdown type={MedalType.Strongholds} medals={mySR.medals} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MedalTypeBreakdown type={MedalType.Stockpile} medals={mySR.medals} />
					</Grid>
					<Grid item xs={12} lg={8}>
						<MedalTypeBreakdown type={MedalType.Sniper} medals={mySR.medals} />
					</Grid>
					<Grid item xs={12}>
						<MedalTypeBreakdown type={MedalType.Weapons} medals={mySR.medals} />
					</Grid>
					<Grid item xs={12}>
						<MedalTypeBreakdown type={MedalType.Boom} medals={mySR.medals} />
					</Grid>
					<Grid item xs={12}>
						<MedalTypeBreakdown type={MedalType.Skill} medals={mySR.medals} />
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}