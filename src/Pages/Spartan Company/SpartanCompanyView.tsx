import { Box, Button, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

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
import { Cookie } from "../../Objects/Helpers/Cookie";
import { AddGamertag, AddGamertagDialog } from "./AddGamertagDialog";
import { DamageRanks } from "../../Assets/Components/Ranks/DamageRanks";
import { KillRanks } from "../../Assets/Components/Ranks/KillRanks";
import { RemoveGamertagDialog } from "./RemoveGamertagDialog";
import { EditCompanyDialog } from "./EditCompanyDialog";

import EditIcon from '@mui/icons-material/Edit';
import { SRTabs } from "../../Assets/Components/Layout/AHDrawer";
import { KDABreakdown } from "../../Assets/Components/Breakdowns/KDABreakdown";
import { TimePlayed } from "../../Assets/Components/Breakdowns/TimePlayed";
import { KillBreakdownCard } from "../../Assets/Components/Breakdowns/KillBreakdownCard";
import { VehicleBreakdown } from "../../Assets/Components/Breakdowns/VehicleBreakdown";
import { AssistBreakdown } from "../../Assets/Components/Breakdowns/AssistBreakdown";
import { Player } from "../../Objects/Model/Player";
import { Helmet } from "react-helmet";

export function SpartanCompanyView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, switchTab, player } = props;
	//#endregion
	
	//#region State
	const [spartanCompany, setSpartanCompany] = useState(new SpartanCompany());
	const [sharedSR, setSharedSR] = useState(new ServiceRecord());
	const [gamertagToAdd, setGamertagToAdd] = useState("");
	const [addGamertagDialog, setAddGamertagDialog] = useState(false);
	const [removeGamertagDialog, setRemoveGamertagDialog] = useState("");
	const [loadingProfile, setLoadingProfile] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [openEditCompanyDialog, setOpenEditCompanyDialog] = useState(false);
	const [recentPlayers, setRecentPlayers] = useState<Player[]>(Cookie.getRecents().map(gamertag => new Player(gamertag)));
	//#endregion

	/** Loads all players for the spartan company */
    const loadData = useCallback(async () => 
    {
		const members = Cookie.getCompanyMembers();
		if (!members || members.length === 0)
		{
			return;
		}

		let sc = new SpartanCompany(Cookie.getCompanyName(), Cookie.getCompanyMedal());
		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Service Records");
		
		// Get service records for all users
		for (const gamertag of members)
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
		switchTab(undefined, SRTabs.SpartanCompany);
    }, [app, setSpartanCompany, setSharedSR, setLoadingMessage, switchTab]);

	/** Syncs all players with autocode */
	const syncPlayers = useCallback(async () =>
	{		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Syncing Service Records");
		
		// Get service records for all users
		for (const player of spartanCompany.players)
		{
			setLoadingMessage("Syncing " + player.gamertag);
			await app.SyncPlayerIntoFirebase(player.gamertag);
		}

		await loadData();
	}, [app, spartanCompany, loadData, setLoadingMessage]);
    
    useEffect(() =>
    {
        loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

	/**
	 * Goes to the service record
	 */
	const goToServiceRecord = useCallback((gamertag: string) =>
	{
		const player = spartanCompany.GetPlayer(gamertag);
		if (!player) { return; }
		switchTab("/service_record/" + gamertag, SRTabs.ServiceRecord);
	}, [switchTab, spartanCompany]);

	//#region Add Gamertag Dialog
	/** Opens the add gamertag dialog */
	const openAddGamertag = useCallback(async () =>
	{
		const recentGamertags = Cookie.getRecents();
		if (!recentGamertags || recentGamertags.length === 0) { return; }

		const players: Player[] = [];
		for (const gamertag of recentGamertags)
		{
			players.push(await app.GetPlayerAppearanceOnly(gamertag));
		}

		setRecentPlayers(players);
		setAddGamertagDialog(true);
	}, [app, setRecentPlayers, setAddGamertagDialog]);

	/** Controlled search component */
	function onGamertagTextChange(event: React.ChangeEvent<HTMLInputElement>)
	{
		setGamertagToAdd(event.target.value);
	};

	/** When the search button is pressed */
	function searchForGamertag()
	{
		if (gamertagToAdd === "") { return; }
		Cookie.addGamertagToCompany(gamertagToAdd);
		loadData();
	}

	/** When enter is pressed */
	function searchForGamertagViaEnter(event: React.KeyboardEvent<HTMLDivElement>)
	{
		if (event.key === "Enter")
		{
			searchForGamertag();
		}
	}

	/** Cancels the close */
	const cancelAddGamertagDialog = useCallback(() =>
	{
		setErrorMessage("");
		setAddGamertagDialog(false);
	}, [setErrorMessage, setAddGamertagDialog]);
	
	/** Adds the gamertag from the company */
	const closeAddGamertagDialog = useCallback(async (gamertag?: string) =>
	{
		setLoadingProfile(true);

		const gt = gamertag ?? gamertagToAdd;

		if (!gt)
		{
			setErrorMessage("Not a valid gamertag!");
			setLoadingProfile(false);
			return;
		}

		if (spartanCompany.HasPlayer(gt))
		{
			setErrorMessage("This gamertag is already in the spartan company.");
			setLoadingProfile(false);
			return;
		}

		const realGamertag = await app.IsValidGamertag(gt);
		if (!realGamertag)
		{
			setErrorMessage("Not a valid gamertag!");
			setLoadingProfile(false);
			return;
		}

		if (spartanCompany.HasPlayer(realGamertag))
		{
			setErrorMessage("This gamertag is already in the spartan company.");
			setLoadingProfile(false);
			return;
		}

		// Okay, so it is valid and real, sync with autocode before displaying
		await app.SyncPlayerIntoFirebase(realGamertag);
		
		// Add to cookies, close popup, and reload company
		Cookie.addGamertagToCompany(realGamertag);
		cancelAddGamertagDialog();
		setLoadingProfile(false);
		setGamertagToAdd("");
		loadData();
		
	}, [app, gamertagToAdd, cancelAddGamertagDialog, loadData, setErrorMessage, setLoadingProfile, spartanCompany, setGamertagToAdd]);

	/** Adds a recent gamertag to the spartan company */
	const addRecent = useCallback((gamertag: string) =>
	{
		closeAddGamertagDialog(gamertag);
	}, [closeAddGamertagDialog]);
	//#endregion

	//#region Remove Gamertag Dialog
	/** Cancels the close */
	const cancelRemoveGamertagDialog = useCallback(() =>
	{
		setRemoveGamertagDialog("");
	}, [setRemoveGamertagDialog]);
	
	/** Removes the gamertag from the company */
	const closeRemoveGamertagDialog = useCallback(() =>
	{
		Cookie.removeGamertagToCompany(removeGamertagDialog);
		cancelRemoveGamertagDialog();
		loadData();
	}, [removeGamertagDialog, cancelRemoveGamertagDialog, loadData]);

	/** 
	 * What happens when the delete member icon button is pressed 
	 * @param gamertag the gamertag
	 */
	function onPressDeleteForMember(gamertag: string): void
	{
		setRemoveGamertagDialog(gamertag);
	}
	//#endregion

	//#region Edit Company Dialog
	/** Cancels the close */
	const cancelEditCompanyDialog = useCallback(() =>
	{
		setOpenEditCompanyDialog(false);
	}, [setOpenEditCompanyDialog]);
	
	/** Removes the gamertag from the company */
	const saveEditCompanyDialog = useCallback((name: string, medal: number) =>
	{
		Cookie.setSpartanCompanyNameAndMedal(name, medal);
		
		const newSC = new SpartanCompany(name, medal);
		newSC.players = [...spartanCompany.players];

		setSpartanCompany(newSC);
		setSharedSR(newSC.GetServiceRecord());
		cancelEditCompanyDialog();

	}, [spartanCompany, setSpartanCompany, setSharedSR, cancelEditCompanyDialog]);
	//#endregion

	return (
		<Box component="main" sx={{ flexGrow: 1, height: "calc(100% - 64px)" }}>
			<Helmet>
				<title>{`Spartan Record | Spartan Company`}</title>
				<meta name="description" content={`Halo Infinite - ${spartanCompany.name} Company`} />
				<meta property="og:title" content="Spartan Record" />
				<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/spartan_company`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<AddGamertagDialog 
				open={addGamertagDialog} 
				gamertag={gamertagToAdd} 
				accept={closeAddGamertagDialog} 
				cancel={cancelAddGamertagDialog} 
				onChange={onGamertagTextChange} 
				search={searchForGamertag} 
				searchViaEnter={searchForGamertagViaEnter} 
				addRecent={addRecent} 
				loading={loadingProfile} 
				recentPlayers={recentPlayers}
				error={errorMessage} />
			<RemoveGamertagDialog open={removeGamertagDialog} accept={closeRemoveGamertagDialog} cancel={cancelRemoveGamertagDialog} />
			<EditCompanyDialog open={openEditCompanyDialog} accept={saveEditCompanyDialog} cancel={cancelEditCompanyDialog} spartanCompany={spartanCompany} sharedSR={sharedSR} loading={false} />
			{ spartanCompany.players && spartanCompany.players.length > 0 ?
			<Box sx={{ p: 2 }}>
				<Grid container spacing={2}>
					{/* Top */}
					<Grid container item spacing={2} xs={12}>
						<Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
							<CompanyCard company={spartanCompany} />
							<Box sx={{ flexGrow: 1 }} />
							<Box>
								<Button startIcon={<EditIcon />} size="small" variant="contained" onClick={() => setOpenEditCompanyDialog(true)}>Edit</Button>
							</Box>
						</Grid>
					</Grid>
					<Grid container item spacing={2} sm={12} md={6} lg={4} xl={3} sx={{ alignContent: "flex-start" }}>
						<Grid item xs={12}>
							<MemberList company={spartanCompany} goToMember={goToServiceRecord} deleteMember={onPressDeleteForMember} onAddGamertag={openAddGamertag} syncPlayers={syncPlayers} />
						</Grid>
						<Grid item xs={12}>
							<KillRanks company={spartanCompany} myGamertag={player?.gamertag} sharedSR={sharedSR} goToMember={goToServiceRecord} />
						</Grid>
						<Grid item xs={12}>
							<WinRateRanks company={spartanCompany} myGamertag={player?.gamertag} sharedSR={sharedSR} goToMember={goToServiceRecord} />
						</Grid>
						<Grid item xs={12}>
							<KDARanks company={spartanCompany} myGamertag={player?.gamertag} sharedSR={sharedSR} goToMember={goToServiceRecord} />
						</Grid>
						<Grid item xs={12}>
							<DamageRanks company={spartanCompany} myGamertag={player?.gamertag} sharedSR={sharedSR} goToMember={goToServiceRecord} />
						</Grid>
						<Grid item xs={12}>
							<AccuracyRanks company={spartanCompany} myGamertag={player?.gamertag} sharedSR={sharedSR} goToMember={goToServiceRecord} />
						</Grid>
					</Grid>
					<Grid container item spacing={2} sm={12} md={6} lg={4} xl={5} sx={{ alignContent: "flex-start" }}>
						<Grid item xs={12}>
							<MatchesBreakdown serviceRecord={sharedSR} />
						</Grid>
						<Grid item xs={12}>
							<KillDeathCard serviceRecord={sharedSR} />
						</Grid>
						<Grid item xs={12}>
							<KDABreakdown serviceRecord={sharedSR} />
						</Grid>
						<Grid item xs={12}>
							<TopMedals medals={sharedSR.medals} matchesPlayed={sharedSR.matchesPlayed} />
						</Grid>
						<Grid item xs={12}>
							<ShotsBreakdown serviceRecord={sharedSR} />
						</Grid>
						<Grid item xs={12}>
							<DamageBreakdown serviceRecord={sharedSR} />
						</Grid>
						<Grid item xs={12}>
							<TimePlayed serviceRecord={sharedSR} />
						</Grid>
					</Grid>
					<Grid container item spacing={2} md={12} lg={4} xl={4} sx={{ alignContent: "flex-start" }}>
						<Grid item xs={12}>
							<KillBreakdownCard serviceRecord={sharedSR} />
						</Grid>
						<Grid item xs={12}>
							<AssistBreakdown serviceRecord={sharedSR} />
						</Grid>
						<Grid item xs={12}>
							<VehicleBreakdown serviceRecord={sharedSR} />
						</Grid>
					</Grid>
				</Grid>
			</Box>
			: 
			<AddGamertag search={gamertagToAdd} onKeyPress={searchForGamertagViaEnter} onSearch={searchForGamertag} onValueChanged={onGamertagTextChange} recentPlayers={recentPlayers} />
			}
		</Box>
	);
}