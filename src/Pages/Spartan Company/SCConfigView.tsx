import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Toolbar, Typography } from "@mui/material";
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
import { Player } from "../../Objects/Model/Player";
import { Appearance } from "../../Objects/Model/Appearance";
import { SCMembersAdmin, SCRequestedAdmin } from "../../Assets/Components/Members/SCMembersAdmin";
import { ArrowheadTheme } from "../../Assets/Theme/ArrowheadTheme";

export function SCConfigView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage } = props;
    const { company } = useParams();
	const navigate = useNavigate();
	//#endregion

	//#region Refs
	//#endregion
	
	//#region State
    const [spartanCompany, setSpartanCompany] = useState(new SpartanCompany(company ?? ""));
    const [openDialog, setOpenDialog] = useState("");
	//#endregion

    const loadData = useCallback(async () => 
    {
        let sc = spartanCompany;

		if (company === "search") { return; }
		if (company && sc?.name !== company) { sc = new SpartanCompany(company); }
		if (!sc) { return; }
        if (!app.arrowheadUser || !app.arrowheadUser.user) { return; }

		setLoadingMessage("Loading Spartan Company");

		// Populate members and admin
		await app.db.GetSpartanCompany(sc);
        if (sc.adminUID !== app.arrowheadUser.user.uid) { return; }		
		
		// Get appearances for the members of the spartan company
        let members: Player[] = [];
		for (const member of sc.members)
		{
			setLoadingMessage("Loading " + member.gamertag);

            let player = new Player(member.gamertag);
			player.appearance = await app.db.GetAppearance(member.gamertag) ?? new Appearance();
            members.push(player);

            sc.AddPlayer(player);
		}

		setLoadingMessage("");
        setSpartanCompany(sc);
    }, [app, company, setSpartanCompany]);
    
    useEffect(() =>
    {
        loadData();
    }, [company]);

	/**
	 * Goes to the service record
	 */
	const deleteExistingMember = (gamertag: string) =>
    {
        setOpenDialog(gamertag);
    };

    /**
	 * Goes to the service record
	 */
	const declineRequest = (gamertag: string) =>
    {
        
    };

    /**
	 * Goes to the service record
	 */
	const acceptRequest = (gamertag: string) =>
    {
        
    };

    const closeDialog = () =>
    {
        setOpenDialog("");
    }

	return (
		<Box component="main" sx={{ flexGrow: 1, height: "100%" }}>
			<Toolbar />
			<Divider />
			<Box sx={{ p: spartanCompany?.Exists() ? 2 : 0, height: "calc(100% - 64px)" }}>
            <Dialog open={!!openDialog} onClose={closeDialog}>
                <DialogTitle sx={{ color: ArrowheadTheme.text_secondary }}>Remove {openDialog}?</DialogTitle>
                <DialogContent>
                    <DialogContentText variant="body2" sx={{ color: "primary.main" }}>
                        Are you sure you want to remove {openDialog} from {spartanCompany.name} Company?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Cancel</Button>
                    <Button onClick={closeDialog} autoFocus>Remove</Button>
                </DialogActions>
            </Dialog>
                <Grid container spacing={2}>
                    {/* Top */}
                    <Grid item xs={12}>
                        <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                            <CompanyCard company={spartanCompany} />
                            <Box sx={{ flexGrow: 1 }}></Box>
                        </Box>
                    </Grid>
                    <Grid container item spacing={2} xs={12} md={4}>
                        <Grid item xs={12}>
                            <SCMembersAdmin company={spartanCompany} deleteExistingMember={deleteExistingMember} />
                        </Grid>
                    </Grid>
                    <Grid container item spacing={2} xs={12} md={4} sx={{ alignContent: "flex-start" }}>
                        <Grid item xs={12}>
                            <SCRequestedAdmin company={spartanCompany} declineRequest={declineRequest} acceptRequest={acceptRequest} />
                        </Grid>
                    </Grid>
                    <Grid container item spacing={2} xs={12} md={4} sx={{ alignContent: "flex-start" }}>
                        <Grid item xs={12}>
                            <Box sx={{ p: 2, display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                                <Box sx={{ mr: 4, mb: 4 }}>
                                    <Typography variant="caption">Company Name</Typography>
                                    <Typography variant="body1">{spartanCompany.name} Company</Typography>
                                </Box>

                                <Box sx={{ mr: 4, mb: 4 }}>
                                    <Typography variant="caption">Total Members</Typography>
                                    <Typography variant="body1">{spartanCompany.members.length} members</Typography>
                                </Box>

                                <Box sx={{ mr: 4, mb: 4 }}>
                                    <Typography variant="caption">Admin UID</Typography>
                                    <Typography variant="body1">{spartanCompany.adminUID}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ p: 2, display: "flex", flexWrap: "wrap", justifyContent: "flex-start" }}>
                                <Button variant="contained" sx={{ ml: 0, m: 0.5 }}>Change Icon</Button>
                                <Button variant="contained" sx={{ m: 0.5 }}>Add Embedded Video</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
			</Box>
		</Box>
	);
}