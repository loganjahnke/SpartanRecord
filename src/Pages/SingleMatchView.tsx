import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TeamResultBreakdown } from "../Assets/Components/Breakdowns/TeamResultBreakdown";
import { ImageCard } from "../Assets/Components/Cards/ImageCard";
import { SRTabs } from "../Assets/Components/Layout/AHDrawer";
import { AccuracyMatchRanks } from "../Assets/Components/Ranks/AccuracyRanks";
import { DamageMatchRanks } from "../Assets/Components/Ranks/DamageRanks";
import { KDAMatchRanks } from "../Assets/Components/Ranks/KDARanks";

import { Match } from "../Objects/Model/Match";
import { MatchPlayer } from "../Objects/Pieces/MatchPlayer";
import { Team } from "../Objects/Pieces/Team";
import { ViewProps } from "./Props/ViewProps";
import { TeamTable } from "./Subpage/TeamTable";

export function SingleMatchView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, updatePlayer: setGamertag, switchTab } = props;
	const { id, gamertag } = useParams();
	//#endregion
	
	//#region State
    const [match, setMatch] = useState<Match | undefined>(new Match());
	const [players, setPlayers] = useState<MatchPlayer[]>([]);
	//#endregion

	const loadData = useCallback(async () => 
	{
		// Get player's service record
		if (id)
		{
            setLoadingMessage("Loading match");
			if (gamertag) { setGamertag(gamertag); }
			const match = await app.GetMatch(id);
            setMatch(match);

			document.title = "Spartan Record | Match Summary";

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

		switchTab(undefined, SRTabs.Matches)
		setLoadingMessage("");
	}, [app, setMatch, setPlayers, setGamertag, gamertag, switchTab]);
	
	useEffect(() =>
	{
		loadData();
	}, [id]);

	/**
	 * Navigates the service record for the gamertag
	 * @param gamertag the gamertag
	 */
	function onGamertagClick(tag: string): void
	{
		if (tag)
		{
			switchTab("/service_record/" + tag, SRTabs.ServiceRecord);
		}
	}

	return (
		<Box component="main" sx={{ flexGrow: 1, width: "100%" }}>
			<Toolbar />
			<Divider />
			<Box sx={{ p: 2 }}>
				{/* Description of the game (map, mode, playlist) */}
				<Grid container spacing={2} sx={{ alignItems: "flex-start", justifyContent: "flex-start" }}>
					<Grid container item spacing={2} xs={12} xl={4}>
						<Grid item xs={12}>
							<ImageCard image={match?.map?.asset.thumbnail} 
								titles={[match?.map?.name || "", match?.mode?.name || "", match?.playlist?.name || match?.type || ""]} 
								headers={["Map", "Variant", "Playlist"]} />
						</Grid>
						<Grid item xs={12}>
							<KDAMatchRanks players={players} myGamertag={gamertag} goToMember={onGamertagClick} />
						</Grid>
						<Grid item xs={12}>
							<AccuracyMatchRanks players={players} myGamertag={gamertag} goToMember={onGamertagClick} />
						</Grid>
						<Grid item xs={12}>
							<DamageMatchRanks players={players} myGamertag={gamertag} goToMember={onGamertagClick} />
						</Grid>
					</Grid>
					<Grid container item spacing={2} xs={12} xl={8}>
						{match?.teams && match.teams.length > 0 
								? match?.teams?.map(team => (
									<>
										<Grid item xs={12}>
											<TeamResultBreakdown team={team} />
										</Grid>
										<Grid item xs={12}>
											<TeamTable team={team} best={match.best} variant={match.mode.name} onGamertagClick={onGamertagClick} ranked={match.playlist.ranked} selectedGamertag={gamertag} />
										</Grid>
									</>
								))
								: match?.players && match.players.length > 0 && (
									<Grid item xs={12}>
										<TeamTable team={new Team(undefined, undefined, match.players)} variant={match.mode.name} best={match.best} onGamertagClick={onGamertagClick} ranked={match.playlist.ranked} selectedGamertag={gamertag} ffa />
									</Grid>
							)}
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}