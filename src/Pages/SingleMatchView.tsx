import { Box, Card, CardActionArea, CardContent, CardMedia, Divider, Grid, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { KillBreakdown } from "../Assets/Components/Breakdowns/KillBreakdown";
import { TeamResultBreakdown } from "../Assets/Components/Breakdowns/TeamResultBreakdown";
import { ImageCard } from "../Assets/Components/Cards/ImageCard";
import { ArrowheadTheme } from "../Assets/Theme/ArrowheadTheme";

import { Match } from "../Objects/Model/Match";
import { ViewProps } from "./Props/ViewProps";
import { TeamTable } from "./Subpage/TeamTable";

export function SingleMatchView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage } = props;
	const { id } = useParams();
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

	return (
		<Box component="main" sx={{ flexGrow: 1, width: "100%" }}>
			<Toolbar />
			<Divider />
			<Box sx={{ p: 2 }}>
				{/* Description of the game (map, mode, playlist) */}
				<Grid container spacing={2} sx={{ justifyContent: "start" }}>
					<Grid item xs={12} lg={4}>
						<ImageCard image={match?.map?.asset.thumbnail} 
							titles={[match?.map?.name ?? "", match?.mode?.name ?? "", match?.playlist?.name ?? ""]} 
							headers={["Map", "Mode", "Playlist"]} />
					</Grid>
					{match?.teams?.map(team => <Grid item xs={12} lg={4}><TeamResultBreakdown team={team} /></Grid>)}
				</Grid>
			</Box>
			<Box sx={{ p: 2, pt: 0 }}>
				{match?.teams?.map(team => <TeamTable team={team} best={match.best} />)}
			</Box>
		</Box>
	);
}