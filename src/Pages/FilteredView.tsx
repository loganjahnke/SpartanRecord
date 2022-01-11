import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowheadFirebase, ServiceRecordFilter, HaloMap, HaloMode, HaloRanked, HaloOutcome } from "../Database/ArrowheadFirebase";
import { Company } from "../Objects/Model/Company";

import ArrowheadImg from "../Assets/Images/arrowhead.png";

import { KillBreakdown } from "../Assets/Components/Breakdowns/KillBreakdown";
import { AssistBreakdown } from "../Assets/Components/Breakdowns/AssistBreakdown";
import { MatchesBreakdown } from "../Assets/Components/Breakdowns/MatchesBreakdown";
import { ShotsBreakdown } from "../Assets/Components/Breakdowns/ShotsBreakdown";
import { DamageBreakdown } from "../Assets/Components/Breakdowns/DamageBreakdown";
import { Player } from "../Objects/Model/Player";
import { HighLevelBreakdown } from "../Assets/Components/Breakdowns/HighLevelBreakdown";
import { AHDrawer } from "../Assets/Components/Layout/AHDrawer";
import { AHAppBar } from "../Assets/Components/Layout/AHAppBar";
import { User } from "../Objects/Model/User";
import { AHLoading } from "../Assets/Components/Layout/AHLoading";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { ImageCard } from "../Assets/Components/Match/ImageCard";
import { MatchFilter } from "../Objects/Model/Match";
import { KDABreakdown } from "../Assets/Components/Breakdowns/KDABreakdown";
import { LevelBreakdown } from "../Assets/Components/Breakdowns/LevelBreakdown";

export function FilteredView(props: { db: ArrowheadFirebase, company: Company, user: User })
{
	//#region Props and Navigate
	const { db, company, user } = props;
	const { tree, filter, gamertag } = useParams();
	const navigate = useNavigate();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
	const [loadingMessage, setLoadingMessage] = useState("");
	const [spartanCompany, setSpartanCompany] = useState(company);
	const [myPlayer, setMyPlayer] = useState(user.player ?? new Player());
    const [sr, setSR] = useState(user.player?.serviceRecord ?? new ServiceRecord());
    const [mobileOpen, setMobileOpen] = useState(false);
    const [tab, setTab] = useState(MatchFilter.IsMapFilter(filter) ? 2 : MatchFilter.IsModeFilter(filter) ? 4 : MatchFilter.IsOutcomeFilter(filter) ? 6 : MatchFilter.IsRankedFilter(filter) ? 8 : -1);
    const [subtab, setSubtab] = useState(MatchFilter.GetFilterSubTab(filter));
    const [image, setImage] = useState("");
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
		if (gamertag && tree)
		{
			setLoadingMessage("Loading " + gamertag);

            const player = spartanCompany.GetPlayer(gamertag) ?? new Player(gamertag);
            let sr = player.GetFilteredServiceRecord(gamertag, tree as ServiceRecordFilter, filter as HaloMap | HaloMode | HaloRanked | HaloOutcome);
            if (!sr)
            {
                sr = await db.GetServiceRecordForFilter(gamertag, tree as ServiceRecordFilter, filter as HaloMap | HaloMode | HaloRanked | HaloOutcome) ?? new ServiceRecord();
                player.SetFilteredServiceRecord(gamertag, tree as ServiceRecordFilter, filter as HaloMap | HaloMode | HaloRanked | HaloOutcome, sr);
                spartanCompany.AddPlayer(player);
            }
            
            setSR(sr);
		}

		setLoadingMessage("");
        setTab(MatchFilter.IsMapFilter(filter) ? 2 : MatchFilter.IsModeFilter(filter) ? 4 : MatchFilter.IsOutcomeFilter(filter) ? 6 : MatchFilter.IsRankedFilter(filter) ? 8 : -1);
        setSubtab(MatchFilter.GetFilterSubTab(filter));
        setImage(MatchFilter.IsMapFilter(filter) 
            ? `https://assets.halo.autocode.gg/static/infinite/images/multiplayer/maps/${filter?.toLowerCase().replace(/\s/g , "-")}.jpg`
        : MatchFilter.IsModeFilter(filter)
            ? `https://assets.halo.autocode.gg/static/infinite/images/multiplayer/${filter === HaloMode.FFASlayer || filter === HaloMode.TacticalSlayer ? "playlists" : "ugcgamevariants"}/${filter?.toLowerCase().replace(/\s/g , "-")}.jpg`
        : "");
	}, [spartanCompany, lastUpdate, db, gamertag, setSpartanCompany, setMyPlayer, tree, filter, setTab, setSubtab, setImage]);

    useEffect(() =>
    {
        loadData();
    }, [filter, tree, gamertag]);

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
			<AHDrawer spartanCompany={spartanCompany} currentTab={tab} subtab={subtab} container={container} mobileOpen={mobileOpen} switchTab={onTabClick} handleDrawerToggle={handleDrawerToggle} gamertag={user?.player?.gamertag ?? gamertag} />
	  		<Box component="main" sx={{ flexGrow: 1 }}>
				<Toolbar />
				<Divider />
				<Box sx={{ p: 2 }}>
					<Grid container spacing={2}>
						{/** Far left */}
						<Grid container item spacing={2} xs={12} md={4} xl={4} sx={{ alignContent: "flex-start" }}>
                            <Grid item xs={12}>
                                <ImageCard image={image} title={MatchFilter.GetFilterTitle(filter)} />
                            </Grid>
                            <Grid item xs={12}>
								<MatchesBreakdown serviceRecord={sr} />
							</Grid>
						</Grid>
						{/** Middle 5 */}
						<Grid container item spacing={2} xs={12} md={4} xl={5} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<KillBreakdown serviceRecord={sr} />
							</Grid>
							<Grid item xs={12}>
								<ShotsBreakdown serviceRecord={sr} />
							</Grid>
						</Grid>
						{/** Far right */}
						<Grid container item spacing={2} xs={12} md={4} xl={3} sx={{ alignContent: "flex-start" }}>
                            <Grid item xs={12}>
								<KDABreakdown serviceRecord={myPlayer.serviceRecord} />
							</Grid>
							<Grid item xs={12}>
								<LevelBreakdown serviceRecord={myPlayer.serviceRecord} />
							</Grid>
							<Grid item xs={12}>
								<AssistBreakdown serviceRecord={sr} />
							</Grid>
							<Grid item xs={12}>
								<DamageBreakdown serviceRecord={myPlayer.serviceRecord} />
							</Grid>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Box>
	);
}