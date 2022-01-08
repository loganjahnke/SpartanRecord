import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowheadFirebase } from "../Database/ArrowheadFirebase";
import { Company } from "../Objects/Model/Company";

import ArrowheadImg from "../Assets/Images/arrowhead.png";

import { TopMedals } from "../Assets/Components/Medals/TopMedals";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { AssistBreakdown } from "../Assets/Components/Breakdowns/AssistBreakdown";
import { MatchesBreakdown } from "../Assets/Components/Breakdowns/MatchesBreakdown";
import { ShotsBreakdown } from "../Assets/Components/Breakdowns/ShotsBreakdown";
import { DamageBreakdown } from "../Assets/Components/Breakdowns/DamageBreakdown";
import { User } from "../Objects/Model/User";
import { AHAppBar } from "../Assets/Components/Layout/AHAppBar";
import { AHDrawer } from "../Assets/Components/Layout/AHDrawer";
import { AHLoading } from "../Assets/Components/Layout/AHLoading";
import { MedalTypeBreakdown } from "../Assets/Components/Medals/MedalTypeBreakdown";
import { MedalType } from "../Objects/Pieces/Medal";

export function MedalsView(props: { db: ArrowheadFirebase, company: Company, user: User })
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
	const [mySR, setMySR] = useState(user.player?.serviceRecord ?? new ServiceRecord());
	const [tab, setTab] = useState(2);
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

			const player = await db.GetPlayer(gamertag);
			if (!player) { continue; }
			
			spartanCompany.AddPlayer(player);
		}

		// Get player's service record
		if (gamertag)
		{
			const sr = spartanCompany.GetPlayer(gamertag)?.serviceRecord ?? new ServiceRecord();
			setMySR(sr);
		}

		setSpartanCompany(spartanCompany);
		setLoadingMessage("");
	}, [spartanCompany, lastUpdate, db, gamertag, setSpartanCompany, setMySR]);
	
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
			<AHDrawer spartanCompany={spartanCompany} currentTab={2} container={container} mobileOpen={mobileOpen} onTabClick={onTabClick} handleDrawerToggle={handleDrawerToggle} hasUser={!!user.player} />
	  		<Box component="main" sx={{ flexGrow: 1 }}>
				<Toolbar />
				<Divider />
				<Box sx={{ p: 2 }}>
					<Grid container spacing={2}>
						{/** Far left 2 */}
						<Grid container item spacing={2} xs={12} md={4} xl={2} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<MedalTypeBreakdown type={MedalType.Spree} medals={mySR.medals} />
							</Grid>
							<Grid item xs={12}>
								<MedalTypeBreakdown type={MedalType.MultiKill} medals={mySR.medals} />
							</Grid>
						</Grid>
						{/** Middle 6 */}
						<Grid container item spacing={2} xs={12} md={4} xl={6} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12} lg={4}>
								<MedalTypeBreakdown type={MedalType.CTF} medals={mySR.medals} />
							</Grid>
							<Grid item xs={12} lg={4}>
								<MedalTypeBreakdown type={MedalType.Oddball} medals={mySR.medals} />
							</Grid>
							<Grid item xs={12} lg={4}>
								<MedalTypeBreakdown type={MedalType.Strongholds} medals={mySR.medals} />
							</Grid>
							<Grid item xs={12} lg={4}>
								<MedalTypeBreakdown type={MedalType.Stockpile} medals={mySR.medals} />
							</Grid>
							<Grid item xs={12} lg={8}>
								<MedalTypeBreakdown type={MedalType.Sniper} medals={mySR.medals} wrap />
							</Grid>
						</Grid>
						{/** Far right 4 */}
						<Grid container item spacing={2} xs={12} md={4} xl={4} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<MedalTypeBreakdown type={MedalType.Weapons} medals={mySR.medals} wrap />
							</Grid>
							<Grid item xs={12}>
								<MedalTypeBreakdown type={MedalType.Boom} medals={mySR.medals} wrap />
							</Grid>
							<Grid item xs={12}>
								<MedalTypeBreakdown type={MedalType.Skill} medals={mySR.medals} wrap />
							</Grid>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Box>
	);
}