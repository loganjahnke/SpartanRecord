import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { PlayerMatchSummary } from "../Assets/Components/Match/PlayerMatchSummary";
import { ViewProps } from "./Props/ViewProps";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { MatchesBreakdown } from "../Assets/Components/Breakdowns/MatchesBreakdown";
import { KillDeathCard } from "../Assets/Components/Breakdowns/KillDeathCard";
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
	const [loadingMore, setLoadingMore] = useState(false);
	const offset = useRef<number>(0);
	//#endregion

	const loadData = useCallback(async (hideLoading?: boolean) => 
	{		
		// Get player's service record
		if (gamertag)
		{
			if (!hideLoading) { setLoadingMessage("Loading matches for " + gamertag); }

			document.title = "Spartan Record | " + gamertag;

			const additionalMatches = await app.GetPlayerMatches(gamertag, offset.current);
			const newMatches = matches.concat(additionalMatches);
			setMatches(newMatches);

			const serviceRecord = new ServiceRecord();
			for (const match of newMatches) { serviceRecord.AddPlayerMatch(match); }

			setCombinedSR(serviceRecord);
			app.LogViewMatches(gamertag);
		}

		if (!hideLoading) { setLoadingMessage(""); }
	}, [lastUpdate, app, gamertag, setPlayer, matches, setMatches, setCombinedSR, offset]);

	const loadMore = useCallback(async () =>
	{
		offset.current += 25;

		setLoadingMore(true);
		await loadData(true);
		setLoadingMore(false);

	}, [offset, loadData]);
	
	useEffect(() =>
	{
		offset.current = 0;
		setMatches([]);
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
					<Grid item xs={12} lg={4}>
						<KDABreakdown serviceRecord={combinedSR} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<MatchesBreakdown serviceRecord={combinedSR} />
					</Grid>
					<Grid item xs={12} lg={4}>
						<KillDeathCard serviceRecord={combinedSR} />
					</Grid>
				</Grid>
				<Grid container spacing={2} sx={{ mt: 1 }}>
					{matches?.length > 0 ? matches.map(match => <PlayerMatchSummary match={match} goToMatch={goToMatch} />) : undefined}
				</Grid>
				{matches.length > 0 && <Grid item xs={12}>
					<Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 2 }}>
						<LoadingButton loading={loadingMore} variant="outlined" onClick={loadMore}>Load 25 More</LoadingButton>
					</Box>
				</Grid>}
			</Box>
		</Box>
	);
}