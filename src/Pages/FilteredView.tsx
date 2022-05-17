import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
import { SRFilter } from "../Objects/Pieces/SRFilter";
import { ChipFilters } from "./Subpage/ChipFilters";
import { KillBreakdownCard } from "../Assets/Components/Breakdowns/KillBreakdownCard";
import { TopMedals } from "../Assets/Components/Medals/TopMedals";
import { AllPlaylists } from "../Objects/Helpers/AllPlaylists";
import { AllMaps } from "../Objects/Helpers/AllMaps";
import { AutocodePlaylist, AutocodeVariant } from "../Database/Schemas/AutocodeMetadata";

export function FilteredView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, setGamertag } = props;
	const { node, filter, gamertag } = useParams();
	const navigate = useNavigate();
	//#endregion
	
	//#region State
	const [showPerMatch, setShowPerMatch] = useState(false);
	const [myPlayer, setMyPlayer] = useState(new Player());
    const [sr, setSR] = useState<ServiceRecord | undefined>();
    const [selectedPlaylist, setSelectedPlaylist] = useState<AutocodePlaylist | undefined>();
	const [playlists, setPlaylists] = useState<AutocodePlaylist[] | undefined>([]);
	const [selectedVariant, setSelectedVariant] = useState<AutocodeVariant | undefined>();
	const [variants, setVariants] = useState<AutocodeVariant[] | undefined>([]);
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
			setMyPlayer(player);

			if (node === ServiceRecordFilter.Playlist)
			{
				setPlaylists(await app.GetPlaylists());
				setVariants(undefined);
			}
			else if (node === ServiceRecordFilter.Variant)
			{
				const notAllowed = ["unknown", "campaign", "extraction", "juggernaut", "vip", "escalation", "grifball", "assault"];
				const variants = await app.GetVariants();
				setVariants(variants.filter(variant => !notAllowed.includes(variant.name.toLowerCase())));
				setPlaylists(undefined);
			}

			setGamertag(gamertag);
            
			app.LogViewServiceRecord(gamertag, node as ServiceRecordFilter, node);
		}

		setLoadingMessage("");
	}, [app, gamertag, setMyPlayer, node, filter]);

	const loadFilteredSR = useCallback(async () => 
	{		
		// Get player's service record
		if (gamertag && node && filter)
		{
			setLoadingMessage("Loading Filtered Service Record");

			if (node === ServiceRecordFilter.Playlist)
			{
				setSR(await app.GetServiceRecordFromAutocode(gamertag, undefined, filter));
				setSelectedPlaylist(playlists?.filter(playlist => playlist.asset.id === filter)[0]);
				setSelectedVariant(undefined);
			}
			else if (node === ServiceRecordFilter.Variant)
			{
				setSR(await app.GetServiceRecordFromAutocode(gamertag, undefined, undefined, filter));
				setSelectedVariant(variants?.filter(variant => variant.category_id === +filter)[0]);
				setSelectedPlaylist(undefined);
			}

			setLoadingMessage("");
		}
	}, [app, gamertag, node, filter, setSR, setSelectedPlaylist, setSelectedVariant, setLoadingMessage]);

	const onFilterSelected = useCallback((filter: string) =>
	{
		navigate(`/service_record/${node}/${gamertag}/${filter}`)
	}, [navigate]);

    useEffect(() =>
    {
        loadData();
		setSR(undefined);
    }, [node, gamertag]);

	useEffect(() =>
	{
		if (filter)
		{
			loadFilteredSR();
		}
	}, [filter]);

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
							<ChipFilters activeFilter={filter ?? ""} filters={playlists ?? variants ?? []} onFilterClick={onFilterSelected} />
						</Box>
					</Grid>
					{!sr ? undefined :
					<>
						{/* Far left */}
						<Grid container item spacing={2} md={12} lg={4} xl={4} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<ImageCard image={selectedPlaylist?.asset?.thumbnail_url ?? selectedVariant?.thumbnail_url} title={selectedPlaylist?.name ?? selectedVariant?.name} />
							</Grid>
							<Grid item xs={12}>
								<MatchesBreakdown serviceRecord={sr} />
							</Grid>
							<Grid item xs={12}>
								<LevelBreakdown serviceRecord={sr} showPerMatch={showPerMatch} />
							</Grid>
							{/* <Grid item xs={12}>
								<PercentageBreakdown totalMatches={availableFilters.map(avail => avail.count).reduce((a, b) => a + b)} filteredMatches={sr.matchesPlayed} />
							</Grid> */}
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