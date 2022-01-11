import { Box, Card, CardActionArea, CardContent, CardMedia, Divider, Grid, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowheadFirebase } from "../Database/ArrowheadFirebase";
import { Company } from "../Objects/Model/Company";

import ArrowheadImg from "../Assets/Images/arrowhead.png";

import { TopMedals } from "../Assets/Components/Medals/TopMedals";
import { KillBreakdown } from "../Assets/Components/Breakdowns/KillBreakdown";
import { AssistBreakdown } from "../Assets/Components/Breakdowns/AssistBreakdown";
import { MatchesBreakdown } from "../Assets/Components/Breakdowns/MatchesBreakdown";
import { ShotsBreakdown } from "../Assets/Components/Breakdowns/ShotsBreakdown";
import { DamageBreakdown } from "../Assets/Components/Breakdowns/DamageBreakdown";
import { Player } from "../Objects/Model/Player";
import { ServiceRecordChart } from "../Assets/Components/Charts/ServiceRecordChart";
import { HighLevelBreakdown } from "../Assets/Components/Breakdowns/HighLevelBreakdown";
import { AHDrawer } from "../Assets/Components/Layout/AHDrawer";
import { AHAppBar } from "../Assets/Components/Layout/AHAppBar";
import { User } from "../Objects/Model/User";
import { AHLoading } from "../Assets/Components/Layout/AHLoading";
import { MatchSummary } from "../Assets/Components/Match/MatchSummary";
import { Match } from "../Objects/Model/Match";

export function SingleMatchView(props: { db: ArrowheadFirebase, company: Company, user: User })
{
	//#region Props and Navigate
	const { db, company, user } = props;
	const { id } = useParams();
	const navigate = useNavigate();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
	const [loadingMessage, setLoadingMessage] = useState("");
    const [match, setMatch] = useState<Match | undefined>(new Match());
	const [gamertag, setGamertag] = useState(user.player?.gamertag ?? "");
	const [tab, setTab] = useState(3);
	const [mobileOpen, setMobileOpen] = useState(false);
	//#endregion

	const loadData = useCallback(async () => 
	{
		if (!await db.PopulateMembers()) { return; }
		
		// Get last update instant
		await db.GetLastUpdate();
		lastUpdate.current = db.lastUpdate;

		// Get player's service record
		if (id)
		{
            setLoadingMessage("Loading match");
			const match = await db.GetMatch(id);
            setMatch(match);
		}

		setLoadingMessage("");
	}, [lastUpdate, db, gamertag, setMatch]);
	
	useEffect(() =>
	{
		loadData();
	}, []);

	/**
	 * On tab click, navigates to the right one
	 */
    const onTabClick = useCallback((url: string) => navigate(url), [navigate]);

	function handleDrawerToggle()
	{
		setMobileOpen(!mobileOpen);
	};

	const container = window !== undefined ? () => window.document.body : undefined;

	return (
		<Box sx={{ display: "flex", backgroundColor: "background.paper" }}>
			<AHAppBar player={user.player} handleDrawerToggle={handleDrawerToggle} />
			<AHLoading loadingMessage={loadingMessage} />
			<AHDrawer spartanCompany={company} currentTab={3} container={container} mobileOpen={mobileOpen} switchTab={onTabClick} handleDrawerToggle={handleDrawerToggle} gamertag={user?.player?.gamertag} />
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