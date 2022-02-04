import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { ServiceRecordFilter, HaloMap, HaloMode, HaloRanked, HaloOutcome } from "../Database/ArrowheadFirebase";
import { KillBreakdown } from "../Assets/Components/Breakdowns/KillBreakdown";
import { AssistBreakdown } from "../Assets/Components/Breakdowns/AssistBreakdown";
import { MatchesBreakdown } from "../Assets/Components/Breakdowns/MatchesBreakdown";
import { ShotsBreakdown } from "../Assets/Components/Breakdowns/ShotsBreakdown";
import { DamageBreakdown } from "../Assets/Components/Breakdowns/DamageBreakdown";
import { Player } from "../Objects/Model/Player";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { ImageCard } from "../Assets/Components/Cards/ImageCard";
import { Match, MatchFilter } from "../Objects/Model/Match";
import { KDABreakdown } from "../Assets/Components/Breakdowns/KDABreakdown";
import { LevelBreakdown } from "../Assets/Components/Breakdowns/LevelBreakdown";
import { PlayerCard } from "../Assets/Components/Cards/PlayerCard";
import { ServiceRecordFilters } from "./Subpage/ServiceRecordFilters";
import { ViewProps } from "./Props/ViewProps";
import { PercentageBreakdown } from "../Assets/Components/Breakdowns/PercentageBreakdown";

export function FilteredView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage } = props;
	const { tree, filter, gamertag } = useParams();
	//#endregion

	//#region Refs
	const lastUpdate = useRef<Date | null>(null);
	//#endregion
	
	//#region State
	const [showPerMatch, setShowPerMatch] = useState(false);
	const [myPlayer, setMyPlayer] = useState(app.arrowheadUser?.player ?? new Player());
    const [sr, setSR] = useState(myPlayer.serviceRecord ?? new ServiceRecord());
    const [image, setImage] = useState("");
	//#endregion

	const loadData = useCallback(async () => 
	{		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Service Records");
		
		// Get last update instant
		lastUpdate.current = await app.db.GetLastUpdate();
		
		// Get player's service record
		if (gamertag && tree)
		{
			setLoadingMessage("Loading " + gamertag);

			let player: Player = await app.db.GetPlayerFilter(gamertag, tree as ServiceRecordFilter, filter as HaloMap | HaloMode | HaloRanked | HaloOutcome);
			const sr = player.GetFilteredServiceRecord(tree as ServiceRecordFilter, filter as HaloMap | HaloMode | HaloRanked | HaloOutcome) ?? new ServiceRecord();
            
			app.LogViewServiceRecord(gamertag, tree as ServiceRecordFilter, filter as HaloMap | HaloMode | HaloRanked | HaloOutcome);
			setMyPlayer(player);
            setSR(sr);
		}

		let image = "";
		if (MatchFilter.IsMapFilter(filter))
		{
			image = `https://assets.halo.autocode.gg/static/infinite/images/multiplayer/maps/${filter?.toLowerCase().replace(/\s/g , "-")}.jpg`;
		}
		else if (MatchFilter.IsModeFilter(filter))
		{
			if (filter === HaloMode.FFASlayer || filter === HaloMode.TacticalSlayer)
			{
				image = `https://assets.halo.autocode.gg/static/infinite/images/multiplayer/playlists/${filter?.toLowerCase().replace(/\s/g , "-")}.jpg`;
			}
			else
			{
				image = `https://assets.halo.autocode.gg/static/infinite/images/multiplayer/ugcgamevariants/${filter?.toLowerCase().replace(/\s/g , "-")}.jpg`;
			}
		}

		setLoadingMessage("");
        setImage(image);
	}, [lastUpdate, app, gamertag, setMyPlayer, tree, filter, setImage]);

    useEffect(() =>
    {
        loadData();
    }, [filter, tree, gamertag]);

	return (
		<Box component="main" sx={{ flexGrow: 1 }}>
			<Toolbar />
			<Divider />
			<Box sx={{ p: 2 }}>
				<Grid container spacing={2}>
					{/* Top */}
					<Grid item xs={12}>
						<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
							<PlayerCard player={myPlayer} />
							<Box sx={{ flexGrow: 1 }}></Box>
							<ServiceRecordFilters setPerMatch={setShowPerMatch} />
						</Box>
					</Grid>
					{/* Far left */}
					<Grid container item spacing={2} xs={12} md={4} xl={4} sx={{ alignContent: "flex-start" }}>
						<Grid item xs={12}>
							<ImageCard image={image} title={MatchFilter.GetFilterTitle(filter)} />
						</Grid>
						<Grid item xs={12}>
							<MatchesBreakdown serviceRecord={sr} />
						</Grid>
						<Grid item xs={12}>
							<PercentageBreakdown totalMatches={myPlayer.serviceRecord.matchesPlayed} filteredMatches={sr.matchesPlayed} />
						</Grid>
					</Grid>
					{/* Middle 5 */}
					<Grid container item spacing={2} xs={12} md={4} xl={5} sx={{ alignContent: "flex-start" }}>
						<Grid item xs={12}>
							<KillBreakdown serviceRecord={sr} showPerMatch={showPerMatch} />
						</Grid>
						<Grid item xs={12}>
							<ShotsBreakdown serviceRecord={sr} showPerMatch={showPerMatch} />
						</Grid>
					</Grid>
					{/* Far right */}
					<Grid container item spacing={2} xs={12} md={4} xl={3} sx={{ alignContent: "flex-start" }}>
						<Grid item xs={12}>
							<KDABreakdown serviceRecord={sr} />
						</Grid>
						<Grid item xs={12}>
							<LevelBreakdown serviceRecord={sr} showPerMatch={showPerMatch} />
						</Grid>
						<Grid item xs={12}>
							<AssistBreakdown serviceRecord={sr} showPerMatch={showPerMatch} />
						</Grid>
						<Grid item xs={12}>
							<DamageBreakdown serviceRecord={sr} showPerMatch={showPerMatch} />
						</Grid>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}