import { Avatar, Box, Button, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SpartanCompany } from "../../Objects/Model/SpartanCompany";
import { MemberList } from "../../Assets/Components/Members/MemberList";
import { TopMedals } from "../../Assets/Components/Medals/TopMedals";
import { ServiceRecord } from "../../Objects/Model/ServiceRecord";
import { MatchesBreakdown } from "../../Assets/Components/Breakdowns/MatchesBreakdown";
import { KDARanks } from "../../Assets/Components/Ranks/KDARanks";
import { WinRateRanks } from "../../Assets/Components/Ranks/WinRateRanks";
import { AccuracyRanks } from "../../Assets/Components/Ranks/AccuracyRanks";
import { KillBreakdown } from "../../Assets/Components/Breakdowns/KillBreakdown";
import { SpartanCompanySearch } from "../Subpage/SpartanCompanySearch";
import { ViewProps } from "../Props/ViewProps";
import { CompanyCard } from "../../Assets/Components/Cards/CompanyCard";

import AddIcon from '@mui/icons-material/Add';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SlowMotionVideoIcon from '@mui/icons-material/SlowMotionVideo';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import { DamageBreakdown } from "../../Assets/Components/Breakdowns/DamageBreakdown";
import { ShotsBreakdown } from "../../Assets/Components/Breakdowns/ShotsBreakdown";

export function SpartanCompanyView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage } = props;
	const { company } = useParams();
	const navigate = useNavigate();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
	const [spartanCompany, setSpartanCompany] = useState((company && company !== "search" ? new SpartanCompany(company) : undefined));
	const [sharedSR, setSharedSR] = useState(new ServiceRecord());
	const [search, setSearch] = useState("");
	const [isMember, setIsMember] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	//#endregion

    const loadData = useCallback(async () => 
    {
		let sc = spartanCompany;

		if (company === "search") { return; }
		if (company && sc?.name !== company) { sc = new SpartanCompany(company); }
		if (!sc) { return; }
		
		// Populate members and admin
		await app.db.GetSpartanCompany(sc);
		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Service Records");
		
        // Get last update instant
        lastUpdate.current = await app.db.GetLastUpdate();
		
		// Get service records for all users
		for (const member of sc.members)
		{
			setLoadingMessage("Loading " + member.gamertag);

			const player = await app.db.GetPlayer(member.gamertag);
			if (!player) { continue; }
			
			sc.AddPlayer(player);
		}

		// See if the logged in user is a member of this spartan company
		if (app.arrowheadUser && app.arrowheadUser.spartanCompany)
		{
			const isMember = app.arrowheadUser.spartanCompany.name === sc.name;
			setIsMember(isMember);
			setIsOwner(isMember && app.arrowheadUser.user?.uid === sc.adminUID);
		}

		const sr = sc.GetServiceRecord();
		app.LogViewSpartanCompany(sc.name);

		setSpartanCompany(sc);
		setSharedSR(sr);
		setLoadingMessage("");
    }, [lastUpdate, app, spartanCompany, setSpartanCompany, setSharedSR, company, setIsMember, setIsOwner]);
    
    useEffect(() =>
    {
        loadData();
    }, [company]);

	/**
	 * Goes to the service record
	 */
	const goToServiceRecord = useCallback((gamertag: string) =>
	{
		navigate("/service_record/" + gamertag);
	}, [navigate, app]);

	/** Controlled search component */
	function onSpartanCompanyTextChange(event: React.ChangeEvent<HTMLInputElement>)
	{
		setSearch(event.target.value);
	};

	/** When the search button is pressed */
	function searchForSpartanCompany()
	{
		if (search === "") { return; }
		navigate(`/company/${search}`);
	}

	/** When enter is pressed */
	function searchForCompanyViaEnter(event: React.KeyboardEvent<HTMLDivElement>)
	{
		if (event.key === "Enter")
		{
			searchForSpartanCompany();
		}
	}

	return (
		<Box component="main" sx={{ flexGrow: 1, height: "100%" }}>
			<Toolbar />
			<Divider />
			<Box sx={{ p: spartanCompany?.Exists() ? 2 : 0, height: "calc(100% - 64px)" }}>
				{spartanCompany?.Exists() ?
					<Grid container spacing={2}>
						{/* Top */}
						<Grid item xs={12}>
							<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
								<CompanyCard company={spartanCompany} />
								<Box sx={{ flexGrow: 1 }}></Box>
								{isOwner ? <Button variant="contained" onClick={() => navigate("configure")}>Configure</Button> : undefined}
								<Button variant="contained" sx={{ ml: 1, mr: 1 }}>{isMember ? "Leave" : "Join"}</Button>
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
								<KillBreakdown serviceRecord={sharedSR} />
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
				:
					company !== "search" 
						? 
						<Box sx={{ p: 2, pl: 8, pt: 8, backgroundColor: "secondary.main", pb: 8 }}>
							<SpartanCompanySearch search={search} onValueChanged={onSpartanCompanyTextChange} onKeyPress={searchForCompanyViaEnter} onSearch={searchForSpartanCompany} />
							<Typography variant="h3" sx={{ fontWeight: 700, mb: 2, mt: 10 }}><span className="skinny">{company} Company doesn't exist.</span> Do you want to create it?</Typography>
							<List>
								<ListItem>
									<ListItemAvatar>
										<Avatar><CompareArrowsIcon /></Avatar>
									</ListItemAvatar>
									<ListItemText primary="Compare your statistics to other players in your Spartan Company" />
								</ListItem>
								<ListItem>
									<ListItemAvatar>
										<Avatar><SlowMotionVideoIcon /></Avatar>
									</ListItemAvatar>
									<ListItemText primary="Embed a Spartan Company video to feature your team's skills" />
								</ListItem>
								<ListItem>
									<ListItemAvatar>
										<Avatar><DashboardCustomizeIcon /></Avatar>
									</ListItemAvatar>
									<ListItemText primary="Customize the statistics shown on your company page" />
								</ListItem>
							</List>
							<Box sx={{ textAlign: "left", ml: 2, mt: 4 }}>
								<Button variant="contained" startIcon={<AddIcon />}>Create {company} Company</Button>
							</Box>
						</Box>
						: <SpartanCompanySearch search={search} onValueChanged={onSpartanCompanyTextChange} onKeyPress={searchForCompanyViaEnter} onSearch={searchForSpartanCompany} />
					}
			</Box>
		</Box>
	);
}