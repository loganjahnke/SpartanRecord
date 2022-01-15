import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Player } from "../Objects/Model/Player";
import { MatchSummary } from "../Assets/Components/Match/MatchSummary";
import { ViewProps } from "./Props/ViewProps";

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
			setMyPlayer(player);
			app.LogViewMatches(gamertag);
		}

		setLoadingMessage("");
	}, [lastUpdate, app, gamertag, setMyPlayer]);
	
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
					{myPlayer?.matches?.length > 0 ? myPlayer.matches.map(match => <MatchSummary match={match} goToMatch={goToMatch} />) : undefined}
				</Grid>
			</Box>
		</Box>
	);
}