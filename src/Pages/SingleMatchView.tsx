import { Box, Card, CardActionArea, CardContent, CardMedia, Divider, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SpartanCompany } from "../Objects/Model/SpartanCompany";

import { AHDrawer } from "../Assets/Components/Layout/AHDrawer";
import { AHAppBar } from "../Assets/Components/Layout/AHAppBar";
import { ArrowheadUser } from "../Objects/Model/ArrowheadUser";
import { AHLoading } from "../Assets/Components/Layout/AHLoading";
import { Arrowhead } from "../Database/Arrowhead";
import { Match } from "../Objects/Model/Match";

export function SingleMatchView(props: { app: Arrowhead, spartanCompany?: SpartanCompany })
{
	//#region Props and Navigate
	const { app, spartanCompany } = props;
	const { id } = useParams();
	const navigate = useNavigate();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
	const [loadingMessage, setLoadingMessage] = useState("");
    const [match, setMatch] = useState<Match | undefined>(new Match());
	const [gamertag, setGamertag] = useState(app.arrowheadUser?.player?.gamertag ?? "");
	const [tab, setTab] = useState(3);
	const [mobileOpen, setMobileOpen] = useState(false);
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

	/**
	 * On tab click, navigates to the right one
	 */
    const changeView = useCallback((url: string) => navigate(url), [navigate]);

	function handleDrawerToggle()
	{
		setMobileOpen(!mobileOpen);
	};

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
			<AHDrawer loggedInUser={app.arrowheadUser} currentTab={3} container={container} mobileOpen={mobileOpen} switchTab={changeView} handleDrawerToggle={handleDrawerToggle} onLogout={logout} />
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
		</Box>
	);
}