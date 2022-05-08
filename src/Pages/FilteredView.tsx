import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ServiceRecordFilter, HaloMap, HaloMode, HaloRanked, HaloOutcome } from "../Database/ArrowheadFirebase";
import { KillDeathCard } from "../Assets/Components/Breakdowns/KillDeathCard";
import { AssistBreakdown } from "../Assets/Components/Breakdowns/AssistBreakdown";
import { MatchesBreakdown } from "../Assets/Components/Breakdowns/MatchesBreakdown";
import { ShotsBreakdown } from "../Assets/Components/Breakdowns/ShotsBreakdown";
import { DamageBreakdown } from "../Assets/Components/Breakdowns/DamageBreakdown";
import { Player } from "../Objects/Model/Player";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { ImageCard } from "../Assets/Components/Cards/ImageCard";
import { KDABreakdown } from "../Assets/Components/Breakdowns/KDABreakdown";
import { LevelBreakdown } from "../Assets/Components/Breakdowns/LevelBreakdown";
import { PlayerCard } from "../Assets/Components/Cards/PlayerCard";
import { ServiceRecordFilters } from "./Subpage/ServiceRecordFilters";
import { ViewProps } from "./Props/ViewProps";
import { PercentageBreakdown } from "../Assets/Components/Breakdowns/PercentageBreakdown";
import { FilterCount } from "../Objects/Pieces/FilterCounts";
import { ChipFilters } from "./Subpage/ChipFilters";
import { KillBreakdownCard } from "../Assets/Components/Breakdowns/KillBreakdownCard";
import { TopMedals } from "../Assets/Components/Medals/TopMedals";
import { AllPlaylists } from "../Objects/Helpers/AllPlaylists";
import { AllMaps } from "../Objects/Helpers/AllMaps";

interface FilterViewProps
{
	node: string;
}

export function FilteredView(props: FilterViewProps & ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, node, setGamertag } = props;
	const { filter, gamertag } = useParams();
	//#endregion
	
	//#region State
	const [showPerMatch, setShowPerMatch] = useState(false);
	const [myPlayer, setMyPlayer] = useState(new Player());
    const [sr, setSR] = useState<ServiceRecord | undefined>();
    const [image, setImage] = useState("");
	const [availableFilters, setAvailableFilters] = useState<FilterCount[]>([]);
	const [selectedFilter, setSelectedFilter] = useState(filter);
	//#endregion

	const loadData = useCallback(async () => 
	{		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Filters");
		
		// Get player's service record
		if (gamertag && node)
		{
			setLoadingMessage("Loading " + gamertag);

			const player = await app.GetPlayerAppearanceOnly(gamertag);
			setAvailableFilters(await app.GetAvailableFilters(gamertag, node as ServiceRecordFilter));
			setMyPlayer(player);
			setGamertag(gamertag);
            
			app.LogViewServiceRecord(gamertag, node as ServiceRecordFilter, filter as HaloMap | HaloMode | HaloRanked | HaloOutcome);
		}

		setLoadingMessage("");
	}, [app, gamertag, setMyPlayer, node, filter]);

	const loadFilteredSR = useCallback(async () => 
	{		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading " + selectedFilter + " Service Record");
		
		// Get player's service record
		if (gamertag && node && selectedFilter)
		{
			setSR(await app.GetFilteredServiceRecord(gamertag, node as ServiceRecordFilter, selectedFilter));			
			app.LogViewServiceRecord(gamertag, node as ServiceRecordFilter, filter as HaloMap | HaloMode | HaloRanked | HaloOutcome);

			if (node === ServiceRecordFilter.Map)
			{
				const mapMetadata = (AllMaps as any)[selectedFilter];
				if (mapMetadata && mapMetadata.thumbnail_url)
				{
					setImage(mapMetadata.thumbnail_url);
				}
				else { setImage(""); }
			}
			else if (node === ServiceRecordFilter.Variant)
			{
				const f = selectedFilter.toLowerCase();
				const imageName = f.includes("slayer") ? "slayer"
					: f.includes("attrition") ? "attrition"
					: f.includes("fiesta") ? "fiesta"
					: f.includes("strongholds") ? "strongholds"
					: f.includes("total control") ? "total-control"
					: f.includes("ctf") ? "ctf"
					: f.includes("oddball") ? "oddball"
					: f.includes("stockpile") ? "stockpile" 
					: f.includes("koth") ? "koth" 
					: f.includes("king of the hill") ? "koth" 
					: f.includes("land grab") ? "land-grab" 
					: "unknown";
				setImage(`https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/ugcgamevariants/${imageName}.jpg`)
			}
			else if (node === ServiceRecordFilter.Playlist)
			{
				const playlistMetadata = (AllPlaylists as any)[selectedFilter];
				if (playlistMetadata && playlistMetadata.asset && playlistMetadata.asset.thumbnail_url)
				{
					setImage(playlistMetadata.asset.thumbnail_url);
				}
				else { setImage(""); }
			}
		}


		setLoadingMessage("");
	}, [app, gamertag, node, selectedFilter]);

	const onFilterSelected = useCallback((filter: string) =>
	{
		setSelectedFilter(filter);
	}, []);

    useEffect(() =>
    {
        loadData();
		setSelectedFilter("");
		setSR(undefined);
    }, [node, gamertag]);

	useEffect(() =>
	{
		if (selectedFilter)
		{
			loadFilteredSR();
		}
	}, [selectedFilter]);

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
					{/* Still top but less so*/}
					<Grid item xs={12}>
						<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
							<ChipFilters activeFilter={selectedFilter ?? ""} filters={availableFilters} onFilterClick={onFilterSelected} areVariants={node === ServiceRecordFilter.Variant} />
						</Box>
					</Grid>
					{!sr ? undefined :
					<>
						{/* Far left */}
						<Grid container item spacing={2} md={12} lg={4} xl={4} sx={{ alignContent: "flex-start" }}>
							{!image ? undefined :
								<Grid item xs={12}>
									<ImageCard image={image} title={selectedFilter} />
								</Grid>
							}
							<Grid item xs={12}>
								<MatchesBreakdown serviceRecord={sr} />
							</Grid>
							<Grid item xs={12}>
								<LevelBreakdown serviceRecord={sr} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<PercentageBreakdown totalMatches={availableFilters.map(avail => avail.count).reduce((a, b) => a + b)} filteredMatches={sr.matchesPlayed} />
							</Grid>
						</Grid>
						{/* Middle 5 */}
						<Grid container item spacing={2} md={12} lg={4} xl={3} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<KillDeathCard serviceRecord={sr} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<KDABreakdown serviceRecord={sr} />
							</Grid>
							<Grid item xs={12}>
								<ShotsBreakdown serviceRecord={sr} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<AssistBreakdown serviceRecord={sr} showPerMatch={showPerMatch} />
							</Grid>
						</Grid>
						{/* Far right */}
						<Grid container item spacing={2} md={12} lg={4} xl={5} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<TopMedals medals={sr.medals} matchesPlayed={sr.matchesPlayed} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<DamageBreakdown serviceRecord={sr} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<KillBreakdownCard serviceRecord={sr} showPerMatch={showPerMatch} />
							</Grid>
						</Grid>
					</>}
				</Grid>
			</Box>
		</Box>
	);
}