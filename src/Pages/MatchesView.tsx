import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Player } from "../Objects/Model/Player";
import { AHDrawer } from "../Assets/Components/Layout/AHDrawer";
import { AHAppBar } from "../Assets/Components/Layout/AHAppBar";
import { AHLoading } from "../Assets/Components/Layout/AHLoading";
import { MatchSummary } from "../Assets/Components/Match/MatchSummary";
import { Arrowhead } from "../Database/Arrowhead";

export function MatchesView(props: { app: Arrowhead })
{
	//#region Props and Navigate
	const { app } = props;
	const { gamertag } = useParams();
	const navigate = useNavigate();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
	const [loadingMessage, setLoadingMessage] = useState("");
	const [myPlayer, setMyPlayer] = useState(app.arrowheadUser?.player ?? new Player());
	const [mobileOpen, setMobileOpen] = useState(false);
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

	/**
	 * On tab click, navigates to the right one
	 */
    const changeView = useCallback((url: string) => navigate(url), [navigate]);

	function handleDrawerToggle()
	{
		setMobileOpen(!mobileOpen);
	};

    function goToMatch(id: string)
    {
        navigate(`/match/${id}`);
    }

	const container = window !== undefined ? () => window.document.body : undefined;

	/** Logs out the current user */
	async function logout()
	{
		setLoadingMessage("Logging out");
		await app.Logout();
		setLoadingMessage("");
	}

	return (
		<Box sx={{ display: "flex", backgroundColor: "background.paper" }}>
			<AHAppBar player={app.arrowheadUser?.player} handleDrawerToggle={handleDrawerToggle} openAuth={changeView} />
			<AHLoading loadingMessage={loadingMessage} />
			<AHDrawer loggedInUser={app.arrowheadUser} currentTab={10} container={container} mobileOpen={mobileOpen} switchTab={changeView} handleDrawerToggle={handleDrawerToggle} onLogout={logout} />
	  		<Box component="main" sx={{ flexGrow: 1 }}>
				<Toolbar />
				<Divider />
				<Box sx={{ p: 2 }}>
					<Grid container spacing={2}>
						{myPlayer?.matches?.length > 0 ? myPlayer.matches.map(match => <MatchSummary match={match} goToMatch={goToMatch} />) : undefined}
					</Grid>
				</Box>
			</Box>
		</Box>
	);
}