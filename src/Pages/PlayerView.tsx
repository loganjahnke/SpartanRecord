import { Box, Button, Divider, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { ViewProps } from "./Props/ViewProps";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { Cookie } from "../Objects/Helpers/Cookie";
import { SRTabs } from "../Assets/Components/Layout/AHDrawer";
import { ServiceRecordGrid } from "../Assets/Components/ServiceRecord/ServiceRecordGrid";

export function PlayerView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, setBackgroundLoadingProgress, player, updatePlayer, switchTab, isAllowed } = props;
	const { gamertag } = useParams();
	//#endregion
	
	//#region State
	const [historicStats, setHistoricStats] = useState<ServiceRecord[]>([]);
	const [showPerMatch, setShowPerMatch] = useState(false);
	const [season, setSeason] = useState(-1);
	//#endregion

	const loadData = useCallback(async () => 
	{		
		if (!gamertag) { switchTab("/", SRTabs.Search); return; }

		// Set page gamertag and show loading message
		setLoadingMessage("Loading " + gamertag);
		
		// Get the player from firebase and show on screen
		const player = await app.GetPlayerFromFirebase(gamertag, season, isAllowed);
		updatePlayer(player.gamertag, player.appearance, player.serviceRecord, player.mmr, player.csrs);
		if (isAllowed) { setHistoricStats(player.historicStats ?? []); }

		if (!player.serviceRecord.IsEmpty() && season === -1)
		{
			// Set loading message to nada, start background load
			setLoadingMessage("");
			setBackgroundLoadingProgress(-1);
		}

		switchTab(undefined, SRTabs.ServiceRecord);

		// If they are, sync with autocode
		if (!app.IsSyncing(gamertag))
		{
			app.AddToSyncing(gamertag);

			// Sync into firebase
			const newPlayer = await app.GetPlayerFromHaloDotAPI(gamertag, season, player.mmr);
			if (newPlayer)
			{
				updatePlayer(newPlayer.gamertag, newPlayer.appearance, newPlayer.serviceRecord, newPlayer.mmr, newPlayer.csrs);
				await app.SetPlayerIntoFirebase(newPlayer, season, player.serviceRecord);

				if (newPlayer.gamertag !== gamertag)
				{
					// Autocode automatically corrected the gamertag, make sure we point Firebase to the right gamertag
					await app.UpdateGamertagReference(newPlayer.gamertag, gamertag);
				}
			}
			
			if (newPlayer.serviceRecordData && !(newPlayer.serviceRecordData as any).error) { Cookie.addRecent(newPlayer.gamertag); }
			setLoadingMessage("");
			app.RemoveFromSyncing(gamertag);
			setBackgroundLoadingProgress(undefined);
		}
		else 
		{ 
			setLoadingMessage("");
			setBackgroundLoadingProgress(undefined); 
		}
	}, [app, gamertag, updatePlayer, setBackgroundLoadingProgress, season, switchTab, isAllowed, setLoadingMessage]);
	
	useEffect(() =>
	{
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gamertag, season]);

	return (
		<Box component="main" sx={{ flexGrow: 1 }}>
			<Helmet>
				<title>{"Spartan Record | " + gamertag}</title>
				<meta name="description" content={`Halo Infinite service record for ${gamertag}`} />
				<meta property="og:title" content="Spartan Record" />
            	<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/service_record/${gamertag}`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<Box sx={{ p: player ? 2 : 0, height: "calc(100% - 64px)" }}>
				{player && player.serviceRecord?.error !== undefined &&
					<Box sx={{ m: 10, color: "primary.main" }}>
						<Typography variant="h3">Couldn't load {player.gamertag}</Typography>
						<Typography variant="h6">{player.serviceRecord.error}</Typography>
						<Button sx={{ mt: 4 }} onClick={() => switchTab("/", SRTabs.Search)} variant="contained">Back to Search</Button>
					</Box>
				}
				{player && <ServiceRecordGrid 
					serviceRecord={player.serviceRecord} 
					isAllowed={isAllowed}
					csrs={player.csrs}
					historicStats={historicStats}
					showPerMatch={showPerMatch}
					setSeason={setSeason}
					setShowPerMatch={setShowPerMatch}
					season={season} />}
			</Box>
		</Box>
	);
}