import { Box, Divider, Grid, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MatchSummary } from "../Assets/Components/Match/MatchSummary";
import { ViewProps } from "./Props/ViewProps";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { MatchesBreakdown } from "../Assets/Components/Breakdowns/MatchesBreakdown";
import { KillBreakdown } from "../Assets/Components/Breakdowns/KillBreakdown";
import { PlayerCard } from "../Assets/Components/Cards/PlayerCard";
import { KDABreakdown } from "../Assets/Components/Breakdowns/KDABreakdown";
import { PlayerMatch } from "../Objects/Model/PlayerMatch";
import { Player } from "../Objects/Model/Player";

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
	const [player, setPlayer] = useState<Player>(new Player());
	const [matches, setMatches] = useState<PlayerMatch[]>([]);
	const [combinedSR, setCombinedSR] = useState(new ServiceRecord());
	//#endregion

	const loadData = useCallback(async () => 
	{		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Matches");

		// Get player's service record
		if (gamertag)
		{
			setLoadingMessage("Loading matches for " + gamertag);

			const player = await app.GetPlayerAppearanceOnly(gamertag);
			setPlayer(player);

			const matches = await app.GetLast25PlayerMatches(gamertag);
			setMatches(matches);

			const serviceRecord = new ServiceRecord();
			for (const match of matches) { serviceRecord.AddPlayerMatch(match); }

			setCombinedSR(serviceRecord);
			app.LogViewMatches(gamertag);
		}

		setLoadingMessage("");
	}, [lastUpdate, app, gamertag, setPlayer, setMatches, setCombinedSR]);
	
	useEffect(() =>
	{
		loadData();
	}, [gamertag]);

    function goToMatch(id: string): void
    {
		if (gamertag)
		{
			navigate(`/match/${id}/${gamertag}`);
		}
		else 
		{
			navigate(`/match/${id}`);
		}
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
							<PlayerCard player={player} />
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
						<KillBreakdown serviceRecord={combinedSR} hideBreakdown />
					</Grid>
				</Grid>
				<Grid container spacing={2} sx={{ mt: 1 }}>
					{matches?.length > 0 ? matches.map(match => <MatchSummary match={match} goToMatch={goToMatch} />) : undefined}
				</Grid>
			</Box>
		</Box>
	);
}