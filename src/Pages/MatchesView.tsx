import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowheadFirebase } from "../Database/ArrowheadFirebase";
import { Company } from "../Objects/Model/Company";

import { Player } from "../Objects/Model/Player";
import { AHDrawer } from "../Assets/Components/Layout/AHDrawer";
import { AHAppBar } from "../Assets/Components/Layout/AHAppBar";
import { User } from "../Objects/Model/User";
import { AHLoading } from "../Assets/Components/Layout/AHLoading";
import { MatchSummary } from "../Assets/Components/Match/MatchSummary";

export function MatchesView(props: { db: ArrowheadFirebase, company: Company, user: User })
{
	//#region Props and Navigate
	const { db, company, user } = props;
	const { gamertag } = useParams();
	const navigate = useNavigate();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
	const [loadingMessage, setLoadingMessage] = useState("");
	const [spartanCompany, setSpartanCompany] = useState(company);
	const [myPlayer, setMyPlayer] = useState(user.player ?? new Player());
	const [tab, setTab] = useState(1);
	const [mobileOpen, setMobileOpen] = useState(false);
	//#endregion

	const loadData = useCallback(async () => 
	{
		if (!await db.PopulateMembers()) { return; }
		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Service Records");
		
		// Get last update instant
		await db.GetLastUpdate();
		lastUpdate.current = db.lastUpdate;

		// Get player's service record
		if (gamertag)
		{
            setLoadingMessage("Loading matches for " + gamertag);

			const player = await db.GetPlayer(gamertag, true, 25);
			spartanCompany.AddPlayer(player);
			setMyPlayer(player);
		}

		setSpartanCompany(spartanCompany);
		setLoadingMessage("");
	}, [spartanCompany, lastUpdate, db, gamertag, setSpartanCompany, setMyPlayer]);
	
	useEffect(() =>
	{
		loadData();
	}, []);

	const onTabClick = useCallback((_event: React.SyntheticEvent, newValue: number) =>
	{
		setTab(newValue);
		if (newValue === 0) { navigate("/"); }
		if (newValue === 1) { navigate(`/sr/${user.player?.gamertag ?? gamertag}`); }
		if (newValue === 2) { navigate(`/medals/${user.player?.gamertag ?? gamertag}`); }
        if (newValue === 3) { navigate(`/matches/${user.player?.gamertag ?? gamertag}`); }
	}, [navigate, setTab]);

	function handleDrawerToggle()
	{
		setMobileOpen(!mobileOpen);
	};

    function goToMatch(id: string)
    {
        navigate(`/match/${id}`);
    }

	const container = window !== undefined ? () => window.document.body : undefined;

	return (
		<Box sx={{ display: "flex", backgroundColor: "background.paper" }}>
			<AHAppBar player={user.player} handleDrawerToggle={handleDrawerToggle} />
			<AHLoading loadingMessage={loadingMessage} />
			<AHDrawer spartanCompany={spartanCompany} currentTab={3} container={container} mobileOpen={mobileOpen} onTabClick={onTabClick} handleDrawerToggle={handleDrawerToggle} hasUser={!!user.player} />
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