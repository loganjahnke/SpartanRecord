import { Backdrop, Box, CircularProgress, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowheadFirebase } from "../Database/ArrowheadFirebase";
import { Company } from "../Objects/Model/Company";

import GroupsIcon from '@mui/icons-material/Groups';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { MemberList } from "../Assets/Components/MemberList";

export function CompanyView(props: { db: ArrowheadFirebase, company: Company })
{
	//#region Props and Navigate
	const { db, company } = props;
	const navigate = useNavigate();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
	const [loadingMessage, setLoadingMessage] = useState("");
	const [spartanCompany, setSpartanCompany] = useState(company);
	const [tab, setTab] = useState(0);
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

		setSpartanCompany(spartanCompany);
		setLoadingMessage("");
    }, [spartanCompany, lastUpdate, db]);
    
    useEffect(() =>
    {
        loadData();
    }, []);

	const onTabClick = useCallback((_event: React.SyntheticEvent, newValue: number) =>
	{
		setTab(newValue);
		if (newValue === 0) { navigate(""); }
		if (newValue === 1) { navigate("service_record/BoundlessEcho"); }
		if (newValue === 2) { navigate("service_record/BoundlessEcho/medals"); }
	}, [navigate, setTab]);

	return (
		<Box sx={{ flexGrow: 1, bgcolor: "background.paper", display: "flex" }}>
			<Backdrop sx={{ color: '#fff', zIndex: 1000 }} open={!!loadingMessage}>
				<CircularProgress color="inherit" />
				<div className="loadingMessage">{loadingMessage}</div>
			</Backdrop>
			<Grid container>
				<Grid item xs={0} sm={2}>
					<Box sx={{ borderRight: 1, borderColor: "divider", height: "100vh" }}>
						<Typography variant="h6" sx={{ padding: 2 }}>{spartanCompany.name} Company</Typography>
						<Tabs orientation="vertical" value={tab} onChange={onTabClick} sx={{ mt: 5 }}>
							<Tab className="ahTab" label="Company" icon={<GroupsIcon />} iconPosition="start" />
							<Tab className="ahTab" label="Service Record" icon={<ModeStandbyIcon />} iconPosition="start" />
							<Tab className="ahTab" label="Medals" icon={<MilitaryTechIcon />} iconPosition="start" />
						</Tabs>
					</Box>
				</Grid>
				<Grid item xs={12} sm={10}>
					<Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "right", alignItems: "center", pr: 2 }}>
						<Typography variant="subtitle1" sx={{ padding: 2 }}>BoundlessEcho</Typography>
						<img src={spartanCompany.GetPlayer("BoundlessEcho")?.appearance.emblemURL} alt="emblem" height="32px" />
 					</Box>
					 <Box sx={{ pl: 2 }}>
						<Typography variant="h4" sx={{ pt: 2, pb: 2, fontWeight: 900 }}>Welcome, BoundlessEcho</Typography>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={3}>
								<MemberList company={spartanCompany} />
							</Grid>
						</Grid>
 					</Box>
				</Grid>
			</Grid>
		</Box>
	);
}