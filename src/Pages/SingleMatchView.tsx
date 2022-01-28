import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TeamResultBreakdown } from "../Assets/Components/Breakdowns/TeamResultBreakdown";
import { ImageCard } from "../Assets/Components/Cards/ImageCard";
import { HaloMode } from "../Database/ArrowheadFirebase";

import { Match } from "../Objects/Model/Match";
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
		}

		setLoadingMessage("");
	}, [lastUpdate, app, setMatch]);
	
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
						{match?.teams?.map(team => <Grid item xs={12}><TeamResultBreakdown team={team} /></Grid>)}
					</Grid>
					<Grid container item spacing={2} xs={12} lg={8}>
						{match?.teams?.map(team => <Grid item xs={12}><TeamTable mode={match.mode.name as HaloMode} team={team} best={match.best} onGamertagClick={onGamertagClick} ranked={match.playlist.ranked} /></Grid>)}
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}