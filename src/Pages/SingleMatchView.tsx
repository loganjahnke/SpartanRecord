import { Box, Divider, Grid, Toolbar } from "@mui/material";
import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FFAResultBreakdown, TeamResultBreakdown } from "../Assets/Components/Breakdowns/TeamResultBreakdown";
import { ImageCard } from "../Assets/Components/Cards/ImageCard";
import { AccuracyMatchRanks } from "../Assets/Components/Ranks/AccuracyRanks";
import { DamageMatchRanks } from "../Assets/Components/Ranks/DamageRanks";
import { KDAMatchRanks } from "../Assets/Components/Ranks/KDARanks";
import { HaloMode } from "../Database/ArrowheadFirebase";

import { Match } from "../Objects/Model/Match";
import { MatchPlayer } from "../Objects/Pieces/MatchPlayer";
import { Team } from "../Objects/Pieces/Team";
import { ViewProps } from "./Props/ViewProps";
import { TeamTable } from "./Subpage/TeamTable";

export function SingleMatchView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage } = props;
	const { id } = useParams();
	const navigate = useNavigate();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
    const [match, setMatch] = useState<Match | undefined>(new Match());
	const [players, setPlayers] = useState<MatchPlayer[]>([]);
	//#endregion

	const loadData = useCallback(async () => 
	{		
		// Get last update instant
		lastUpdate.current = await app.db.GetLastUpdate();

		// Get player's service record
		if (id)
		{
            setLoadingMessage("Loading match");
			const match = await app.db.GetMatch(id);
            setMatch(match);

			if (match)
			{
				setPlayers(match.players && match.players.length > 0 ? match.players : match.teams.reduce((prev, curr) => 
				{
					if (prev)
					{
						prev.players.concat(curr.players);
						return prev;
					}
					else
					{
						return curr;
					}
				}).players);
			}
		}

		setLoadingMessage("");
	}, [lastUpdate, app, setMatch, setPlayers]);
	
	useEffect(() =>
	{
		loadData();
	}, [id]);

	/**
	 * Navigates the service record for the gamertag
	 * @param gamertag the gamertag
	 */
	function onGamertagClick(gamertag: string): void
	{
		if (gamertag && gamertag.indexOf("343 Bot") !== 0)
		{
			navigate("/service_record/" + gamertag);
		}
	}

	return (
		<Box component="main" sx={{ flexGrow: 1, width: "100%" }}>
			<Toolbar />
			<Divider />
			<Box sx={{ p: 2 }}>
				{/* Description of the game (map, mode, playlist) */}
				<Grid container spacing={2} sx={{ alignItems: "flex-start", justifyContent: "flex-start" }}>
					<Grid container item spacing={2} xs={12} lg={4}>
						<Grid item xs={12}>
							<ImageCard image={match?.map?.asset.thumbnail} 
								titles={[match?.map?.name ?? "", match?.mode?.name ?? "", match?.playlist?.name ?? ""]} 
								headers={["Map", "Mode", "Playlist"]} />
						</Grid>
						{match?.teams && match.teams.length > 0 
							? match?.teams?.map(team => <Grid item xs={12}><TeamResultBreakdown team={team} /></Grid>) 
							: match?.players && match.players.length > 0 
								? <Grid item xs={12}><FFAResultBreakdown winner={match.players[0]} /></Grid>
								: undefined}
					</Grid>
					<Grid container item spacing={2} xs={12} lg={8}>
						{match?.teams && match.teams.length > 0 ? (
							match.teams.map(team => <Grid item xs={12}><TeamTable mode={match.mode.name as HaloMode} team={team} best={match.best} onGamertagClick={onGamertagClick} ranked={match.playlist.ranked} /></Grid>)
						) : match?.players && match.players.length > 0 ? (
							<Grid item xs={12}>
								<TeamTable mode={match.mode.name as HaloMode} team={new Team(null, null, match.players)} best={match.best} onGamertagClick={onGamertagClick} ranked={match.playlist.ranked} />
							</Grid>
						) : undefined}
						<Grid item xs={12} lg={6} xl={4}>
							<KDAMatchRanks players={players} goToMember={onGamertagClick} />
						</Grid>
						<Grid item xs={12} lg={6} xl={4}>
							<AccuracyMatchRanks players={players} goToMember={onGamertagClick} />
						</Grid>
						<Grid item xs={12} lg={6} xl={4}>
							<DamageMatchRanks players={players} goToMember={onGamertagClick} />
						</Grid>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}