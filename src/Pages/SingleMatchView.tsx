import { Box, Card, CardActionArea, CardContent, CardMedia, Divider, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Match } from "../Objects/Model/Match";
import { ViewProps } from "./Props/ViewProps";

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
	const [gamertag, setGamertag] = useState(app.arrowheadUser?.player?.gamertag ?? "");
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
	}, [lastUpdate, app, gamertag, setMatch]);
	
	useEffect(() =>
	{
		loadData();
	}, [id]);

	return (
		<Box component="main" sx={{ flexGrow: 1 }}>
			<Toolbar />
			<Divider />
			<Box sx={{ p: 2 }}>
				{match ?
					<Card>
						<CardActionArea>
							<CardMedia component="img" height="200" image={match.map.asset.thumbnail} alt={match.map.name} />
							<CardContent>
								<Typography gutterBottom variant="h5" component="div" sx={{ textAlign: "center" }}>{match.mode.name}</Typography>
								<Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
									<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
										<Typography variant="caption">Result</Typography>
										<Typography variant="body1">{match.player.outcome}</Typography>
									</Box>
									<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
										<Typography variant="caption">Kills</Typography>
										<Typography variant="body1">{match.player.stats.summary.kills}</Typography>
									</Box>
									<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
										<Typography variant="caption">Deaths</Typography>
										<Typography variant="body1">{match.player.stats.summary.deaths}</Typography>
									</Box>
									<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
										<Typography variant="caption">Played</Typography>
										<Typography variant="body1">{match.date.toLocaleString()}</Typography>
									</Box>
								</Box>
							</CardContent>
						</CardActionArea>
					</Card>
					: undefined
				}
			</Box>
		</Box>
	);
}