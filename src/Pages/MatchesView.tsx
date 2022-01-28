import { Box, Divider, Grid, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Player } from "../Objects/Model/Player";
import { MatchSummary } from "../Assets/Components/Match/MatchSummary";
import { ViewProps } from "./Props/ViewProps";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { MatchesBreakdown } from "../Assets/Components/Breakdowns/MatchesBreakdown";
import { KillBreakdown } from "../Assets/Components/Breakdowns/KillBreakdown";
import { PlayerCard } from "../Assets/Components/Cards/PlayerCard";
import { KDABreakdown } from "../Assets/Components/Breakdowns/KDABreakdown";

export function MatchesView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage } = props;
	const { gamertag } = useParams();
	const navigate = useNavigate();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
	const [myPlayer, setMyPlayer] = useState(app.arrowheadUser?.player ?? new Player());
	const [combinedSR, setCombinedSR] = useState(new ServiceRecord());
	//#endregion

	const loadData = useCallback(async () => 
	{		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Matches");
		
		// Get last update instant
		lastUpdate.current = await app.db.GetLastUpdate();

		// Get player's service record
		if (gamertag)
		{
			setLoadingMessage("Loading matches for " + gamertag);
			const player = await app.db.GetPlayer(gamertag, false, 25);
			setCombinedSR(player.GetServiceRecordOfMatches());
			setMyPlayer(player);
			app.LogViewMatches(gamertag);
		}

		setLoadingMessage("");
	}, [lastUpdate, app, gamertag, setMyPlayer, setCombinedSR]);
	
	useEffect(() =>
	{
		loadData();
	}, [gamertag]);

    function goToMatch(id: string)
    {
        navigate(`/match/${id}`);
    }

	return (
		<Box component="main" sx={{ flexGrow: 1 }}>
			<Toolbar />
			<Divider />
			<Box sx={{ p: 2 }}>
				<Grid container spacing={2}>
					{/* Top */}
					<Grid item xs={12}>
						<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
							<PlayerCard player={myPlayer} />
							<Box sx={{ flexGrow: 1 }}></Box>
							<Typography sx={{ mr: 1 }}>Last 25 matches</Typography>
						</Box>
					</Grid>
					<Grid item xs={12} lg={4}>
						<KDABreakdown serviceRecord={combinedSR} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MatchesBreakdown serviceRecord={combinedSR} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<KillBreakdown serviceRecord={combinedSR} />
					</Grid>
				</Grid>
				<Grid container spacing={2} sx={{ mt: 1 }}>
					{myPlayer?.matches?.length > 0 ? myPlayer.matches.map(match => <MatchSummary match={match} goToMatch={goToMatch} />) : undefined}
				</Grid>
			</Box>
		</Box>
	);
}