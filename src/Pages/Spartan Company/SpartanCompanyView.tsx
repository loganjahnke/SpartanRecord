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
	//#endregion

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
    }, [app, setSpartanCompany, setSharedSR]);
    
    useEffect(() =>
    {
        loadData();
    }, []);

	/**
	 * Goes to the service record
	 */
	const goToServiceRecord = useCallback((gamertag: string) =>
	{
		switchTab("/service_record/" + gamertag, "Service Record");
	}, [switchTab, app]);

	//#region Add Gamertag Dialog
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
	function cancelAddGamertagDialog()
	{
		setErrorMessage("");
		setAddGamertagDialog(false);
	}
	
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
		
	}, [gamertagToAdd, cancelAddGamertagDialog, loadData, setErrorMessage, setLoadingProfile, spartanCompany, setGamertagToAdd]);

	/** Adds a recent gamertag to the spartan company */
	const addRecent = useCallback((gamertag: string) =>
	{
		closeAddGamertagDialog(gamertag);
	}, [closeAddGamertagDialog]);
	//#endregion

	//#region Remove Gamertag Dialog
	/** Cancels the close */
	function cancelRemoveGamertagDialog()
	{
		setRemoveGamertagDialog("");
	}
	
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
	function cancelEditCompanyDialog()
	{
		setOpenEditCompanyDialog(false);
	}
	
	/** Removes the gamertag from the company */
	const saveEditCompanyDialog = useCallback((name: string, medal: number) =>
	{
		Cookie.setSpartanCompanyNameAndMedal(name, medal);
		
		const newSC = new SpartanCompany(name, medal);
		newSC.players = [...spartanCompany.players];

		setSpartanCompany(newSC);
		setSharedSR(newSC.GetServiceRecord());
		cancelEditCompanyDialog();

	}, [removeGamertagDialog, cancelRemoveGamertagDialog, loadData, spartanCompany, setSpartanCompany, setSharedSR]);
	//#endregion

	return (
		<Box component="main" sx={{ flexGrow: 1, height: "calc(100% - 64px)" }}>
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
				error={errorMessage} />
			<RemoveGamertagDialog open={removeGamertagDialog} accept={closeRemoveGamertagDialog} cancel={cancelRemoveGamertagDialog} />
			<EditCompanyDialog open={openEditCompanyDialog} accept={saveEditCompanyDialog} cancel={cancelEditCompanyDialog} spartanCompany={spartanCompany} sharedSR={sharedSR} loading={false} />
			{ spartanCompany.players && spartanCompany.players.length > 0 ?
			<Box sx={{ p: 2 }}>
				<Grid container spacing={2}>
					{/* Top */}
					<Grid container item spacing={2} xs={12} sx={{ alignItems: "center" }}>
						<Grid item xs={12} sm={6}>
							<CompanyCard company={spartanCompany} />
						</Grid>
						<Grid item xs={12} sm={6} sx={{ textAlign: "right", width: "100%" }}>
							<Button variant="contained" sx={{ mr: 1 }} title={spartanCompany.players.length >= 10 ? "Cannot have more than 10 members in your spartan company" : "Add a gamertag to your spartan company"} disabled={spartanCompany.players.length >= 10} onClick={() => setAddGamertagDialog(true)}>Add Gamertag</Button>
							<Button variant="contained" sx={{ mr: 1 }} onClick={() => setOpenEditCompanyDialog(true)}>Edit Company</Button>
						</Grid>
					</Grid>
					<Grid container item spacing={2} sm={12} md={6} lg={4} xl={3} sx={{ alignContent: "flex-start" }}>
						<Grid item xs={12}>
							<MemberList company={spartanCompany} goToMember={goToServiceRecord} deleteMember={onPressDeleteForMember} />
						</Grid>
					</Grid>
					<Grid container item spacing={2} sm={12} md={6} lg={4} xl={6} sx={{ alignContent: "flex-start" }}>
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
					<Grid container item spacing={2} md={12} lg={4} xl={3} sx={{ alignContent: "flex-start" }}>
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
				</Grid>
			</Box>
			: 
			<AddGamertag search={gamertagToAdd} onKeyPress={searchForGamertagViaEnter} onSearch={searchForGamertag} onValueChanged={onGamertagTextChange} />
			}
		</Box>
	);
}