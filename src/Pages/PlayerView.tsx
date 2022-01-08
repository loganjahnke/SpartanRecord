import { Box, Divider, Grid, Toolbar } from "@mui/material";
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

export function PlayerView(props: { db: ArrowheadFirebase, company: Company, user: User })
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
		
		// Get service records for all users
		for (const gamertag of db.members)
		{
			setLoadingMessage("Loading " + gamertag);

			const player = await db.GetPlayer(gamertag, true);
			if (!player) { continue; }
			
			spartanCompany.AddPlayer(player);
		}

		// Get player's service record
		if (gamertag)
		{
			const player = spartanCompany.GetPlayer(gamertag) ?? new Player(gamertag);
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
		if (newValue === 1) { navigate(`/service_record/${user.player?.gamertag ?? gamertag}`); }
		if (newValue === 2) { navigate(`/service_record/${user.player?.gamertag ?? gamertag}/medals`); }
	}, [navigate, setTab]);

	function handleDrawerToggle()
	{
		setMobileOpen(!mobileOpen);
	};

	const container = window !== undefined ? () => window.document.body : undefined;

	return (
		<Box sx={{ display: "flex", backgroundColor: "background.paper" }}>
			<AHAppBar player={user.player} handleDrawerToggle={handleDrawerToggle} />
			<AHLoading loadingMessage={loadingMessage} />
			<AHDrawer spartanCompany={spartanCompany} currentTab={1} container={container} mobileOpen={mobileOpen} onTabClick={onTabClick} handleDrawerToggle={handleDrawerToggle} hasUser={!!user.player} />
	  		<Box component="main" sx={{ flexGrow: 1 }}>
				<Toolbar />
				<Divider />
				<Box sx={{ p: 2 }}>
					<Grid container spacing={2}>
						{/** Far left */}
						<Grid container item spacing={2} xs={12} md={4} xl={3} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<MatchesBreakdown serviceRecord={myPlayer.serviceRecord} icon={ArrowheadImg} />
							</Grid>
							<Grid item xs={12}>
								<KillBreakdown serviceRecord={myPlayer.serviceRecord} icon={ArrowheadImg} />
							</Grid>
						</Grid>
						{/** Middle 6 */}
						<Grid container item spacing={2} xs={12} md={4} xl={6} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<TopMedals medals={myPlayer.serviceRecord.medals} />
							</Grid>
							<Grid item xs={12}>
								<ServiceRecordChart historicServiceRecords={myPlayer.historicStats ?? []} />
							</Grid>
							<Grid item xs={12}>
								<HighLevelBreakdown serviceRecord={myPlayer.serviceRecord} icon={ArrowheadImg} />
							</Grid>
						</Grid>
						{/** Far right */}
						<Grid container item spacing={2} xs={12} md={4} xl={3} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<AssistBreakdown serviceRecord={myPlayer.serviceRecord} icon={ArrowheadImg} />
							</Grid>
							<Grid item xs={12}>
								<DamageBreakdown serviceRecord={myPlayer.serviceRecord} icon={ArrowheadImg} />
							</Grid>
							<Grid item xs={12}>
								<ShotsBreakdown serviceRecord={myPlayer.serviceRecord} icon={ArrowheadImg} />
							</Grid>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Box>
	);
}