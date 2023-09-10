import { Box, Divider, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, Toolbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import { ViewProps } from "../Props/ViewProps";
import { SRTabs } from "../../Assets/Components/Layout/AHDrawer";
import { HaloDotAPIPlaylist } from "../../Database/Schemas/AutocodeMetadata";
import { ArrowheadTheme } from "../../Assets/Theme/ArrowheadTheme";
import { PlaylistWeights } from "../../Objects/Pieces/PlaylistWeights";
import { PlaylistCard } from "./Components/PlaylistCard";

import "../../Assets/Styles/Views/Playlist.css";
import { Debugger } from "../../Objects/Helpers/Debugger";

export function PlaylistsView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, setBackgroundLoadingProgress, switchTab } = props;
	//#endregion
	
	//#region State
	const [allPlaylists, setAllPlaylists] = useState<HaloDotAPIPlaylist[]>([]);
	const [weights, setWeights] = useState<Map<string, PlaylistWeights>>(new Map());
	const [chosenPlaylist, setChosenPlaylist] = useState("");
	//#endregion

	/**
	 * Clears the loading messages
	 */
	const clearLoadingMessages = useCallback(() =>
	{
		setLoadingMessage("");
		setBackgroundLoadingProgress("");
	}, [setLoadingMessage, setBackgroundLoadingProgress]);

	/**
	 * Loads the playlists from HaloDotAPI
	 */
	const loadPlaylists = useCallback(async () =>
	{
		if (allPlaylists.length > 0) { return; }

		// Get the playlists
		const playlists = await app.GetPlaylists();
		const playlistWeights = await app.GetPlaylistWeights();
		
		setAllPlaylists(playlists);
		setWeights(playlistWeights);

		// Set the chosen playlist to the first in the list
		if (playlists.length > 0) { setChosenPlaylist(playlists[0].id); }

	}, [app, allPlaylists, setAllPlaylists, setWeights, setChosenPlaylist]);

	/**
	 * Loads the data for the view
	 */
	const loadData = useCallback(async () => 
	{
		Debugger.LoadView("PlaylistsView");
		
		// Update tab
		switchTab(undefined, SRTabs.ActivePlaylists);
		
		// Load and render playlists
		setLoadingMessage("Loading playlists");
		await loadPlaylists();

		// Clear loading messages
		clearLoadingMessages();

	}, [switchTab, loadPlaylists, setLoadingMessage, clearLoadingMessages]);
	
	useEffect(() =>
	{
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Box component="main" sx={{ flexGrow: 1 }}>
			<Helmet>
				<title>Spartan Record | Playlists</title>
				<meta name="description" content={"Active playlists and game mode odds"} />
				<meta property="og:title" content="Spartan Record" />
            	<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/playlists`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<Box sx={{ p: 2, height: "calc(100% - 64px)" }}>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={0} sx={{ display: { sm: "none" }}}>
						<FormControl size="small">
							<InputLabel>Playlists</InputLabel>
							<Select value={(chosenPlaylist as any) as HTMLElement} label="Season" onChange={(event) => setChosenPlaylist(event.target.value as string)}>
								{allPlaylists.filter(playlist => playlist.attributes.active).map(playlist => <MenuItem value={playlist.id}>{playlist.name}</MenuItem>)}
							</Select>
						</FormControl>
						{allPlaylists.filter(playlist => chosenPlaylist === playlist.id).map(playlist => <PlaylistCard playlist={playlist} chosen overrideBackgroundColor={ArrowheadTheme.box} />)}
					</Grid>
					<Grid item xs={0} sm={6} xl={4} sx={{ display: { xs: "none", sm: "initial" }}}>
						{allPlaylists.filter(playlist => playlist.attributes.active).map(playlist => <PlaylistCard playlist={playlist} chosen={playlist.id === chosenPlaylist} onPlaylistClicked={setChosenPlaylist} />)}
					</Grid>
					<Grid item xs={12} sm={6} xl={8}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Map</TableCell>
									<TableCell>Mode</TableCell>
									<TableCell>Probability</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{Array.from(weights.get(chosenPlaylist)?.odds.keys() ?? []).map(name =>
									{
										const isFiesta = name.indexOf("Fiesta") !== -1;
										const shortName = name.indexOf(":") !== -1 ? name.substring(name.indexOf(":") + 1) : name;
										const midIndex = shortName.indexOf(" on ");
										const mode = isFiesta ? name.substring(0, name.indexOf(":")) : (midIndex !== -1 ? shortName.substring(0, midIndex) : shortName);
										const map = midIndex !== -1 ? shortName.substring(midIndex + 4) : shortName;
										return (
											<TableRow>
												<TableCell>{map}</TableCell>
												<TableCell>{mode}</TableCell>
												<TableCell>{weights.get(chosenPlaylist)?.odds.get(name) ?? "N/A"}%</TableCell>
											</TableRow>
										);
									}
								)}
							</TableBody>
						</Table>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}