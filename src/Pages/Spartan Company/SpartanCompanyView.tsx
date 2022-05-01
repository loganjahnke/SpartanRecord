import { Box, Button, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SpartanCompany } from "../../Objects/Model/SpartanCompany";
import { MemberList } from "../../Assets/Components/Members/MemberList";
import { TopMedals } from "../../Assets/Components/Medals/TopMedals";
import { ServiceRecord } from "../../Objects/Model/ServiceRecord";
import { MatchesBreakdown } from "../../Assets/Components/Breakdowns/MatchesBreakdown";
import { KDARanks } from "../../Assets/Components/Ranks/KDARanks";
import { WinRateRanks } from "../../Assets/Components/Ranks/WinRateRanks";
import { AccuracyRanks } from "../../Assets/Components/Ranks/AccuracyRanks";
import { KillDeathCard } from "../../Assets/Components/Breakdowns/KillDeathCard";
import { ViewProps } from "../Props/ViewProps";
import { CompanyCard } from "../../Assets/Components/Cards/CompanyCard";

import { DamageBreakdown } from "../../Assets/Components/Breakdowns/DamageBreakdown";
import { ShotsBreakdown } from "../../Assets/Components/Breakdowns/ShotsBreakdown";

export function SpartanCompanyView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage } = props;
	const navigate = useNavigate();
	//#endregion
	
	//#region State
	const [spartanCompany, setSpartanCompany] = useState(new SpartanCompany("Arrowhead"));
	const [sharedSR, setSharedSR] = useState(new ServiceRecord());
	const [isMember, setIsMember] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	//#endregion

    const loadData = useCallback(async () => 
    {
		let sc = spartanCompany;
		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Service Records");
		
		// Get service records for all users
		for (const gamertag of ["BoundlessEcho", "Homestarr", "Jahnkers TTV", "G 2da Rant", "SilentHawk07", "CheezyBadger", "CrankyStankyLeg"])
		{
			setLoadingMessage("Loading " + gamertag);
			const player = await app.GetPlayerFromFirebase(gamertag);
			sc.AddPlayer(player);
		}

		const sr = sc.GetServiceRecord();
		app.LogViewSpartanCompany(sc.name);

		setSpartanCompany(sc);
		setSharedSR(sr);
		setLoadingMessage("");
    }, [app, spartanCompany, setSpartanCompany, setSharedSR, setIsMember, setIsOwner]);
    
    useEffect(() =>
    {
        loadData();
    }, []);

	/**
	 * Goes to the service record
	 */
	const goToServiceRecord = useCallback((gamertag: string) =>
	{
		navigate("/service_record/" + gamertag);
	}, [navigate, app]);

	return (
		<Box component="main">
			<Toolbar />
			<Divider />
			<Box sx={{ p: 2 }}>
				<Grid container spacing={2}>
					{/* Top */}
					<Grid item xs={12}>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<CompanyCard company={spartanCompany} />
						</Box>
					</Grid>
					<Grid container item spacing={2} xs={12} md={4} xl={3}>
						<Grid item xs={12}>
							<MemberList company={spartanCompany} goToMember={goToServiceRecord} />
						</Grid>
					</Grid>
					<Grid container item spacing={2} xs={12} md={4} xl={6} sx={{ alignContent: "flex-start" }}>
						<Grid item xs={12}>
							<TopMedals medals={sharedSR.medals} />
						</Grid>
						<Grid item xs={12}>
							<KillDeathCard serviceRecord={sharedSR} />
						</Grid>
						<Grid item xs={12}>
							<MatchesBreakdown serviceRecord={sharedSR} />
						</Grid>
						<Grid item xs={12}>
							<DamageBreakdown serviceRecord={sharedSR} />
						</Grid>
						<Grid item xs={12}>
							<ShotsBreakdown serviceRecord={sharedSR} />
						</Grid>
					</Grid>
					<Grid container item spacing={2} xs={12} md={4} xl={3}>
						<Grid item xs={12}>
							<WinRateRanks company={spartanCompany} sharedSR={sharedSR} goToMember={goToServiceRecord} />
						</Grid>
						<Grid item xs={12}>
							<KDARanks company={spartanCompany} sharedSR={sharedSR} goToMember={goToServiceRecord} />
						</Grid>
						<Grid item xs={12}>
							<AccuracyRanks company={spartanCompany} sharedSR={sharedSR} goToMember={goToServiceRecord} />
						</Grid>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}