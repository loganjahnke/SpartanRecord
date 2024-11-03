import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ServiceRecordFilter } from "../Database/ArrowheadFirebase";
import { KillDeathCard } from "../Assets/Components/Breakdowns/KillDeathCard";
import { AssistBreakdown } from "../Assets/Components/Breakdowns/AssistBreakdown";
import { MatchesBreakdown } from "../Assets/Components/Breakdowns/MatchesBreakdown";
import { ShotsBreakdown } from "../Assets/Components/Breakdowns/ShotsBreakdown";
import { DamageBreakdown } from "../Assets/Components/Breakdowns/DamageBreakdown";
import { ServiceRecord } from "../Objects/Model/ServiceRecord";
import { ImageCard } from "../Assets/Components/Cards/ImageCard";
import { KDABreakdown } from "../Assets/Components/Breakdowns/KDABreakdown";
import { ServiceRecordFilters } from "../Assets/Components/ServiceRecord/ServiceRecordFilters";
import { ViewProps } from "./Props/ViewProps";
import { ChipFilters } from "../Assets/Components/ServiceRecord/ChipFilters";
import { KillBreakdownCard } from "../Assets/Components/Breakdowns/KillBreakdownCard";
import { TopMedals } from "../Assets/Components/Medals/TopMedals";
import { HaloDotAPIPlaylist, HaloDotAPICategory, HaloDotAPISeason } from "../Database/Schemas/AutocodeMetadata";
import { TitleCard } from "../Assets/Components/Cards/TitleCard";
import { SeasonChooser } from "../Assets/Components/ServiceRecord/SeasonChooser";
import { SRFilter } from "../Objects/Pieces/SRFilter";
import { AllMaps } from "../Objects/Helpers/AllMaps";
import { SRTabs } from "../Assets/Components/Layout/AHDrawer";
import { VehicleBreakdown } from "../Assets/Components/Breakdowns/VehicleBreakdown";
import { TimePlayed } from "../Assets/Components/Breakdowns/TimePlayed";
import { Helmet } from "react-helmet";
import { ServiceRecordType } from "../Database/SCData";
import { Debugger } from "../Objects/Helpers/Debugger";
import { PlaylistChooser } from "../Assets/Components/Playlists/PlaylistChooser";
import { FluidAd } from "../Assets/Components/Ads/FluidAd";
import { ModeBreakdown } from "../Assets/Components/Breakdowns/Modes/ModeBreakdown";

export function FilteredView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, isSubscribedToPatreon, setLoadingMessage, updatePlayer, switchTab, setApiError } = props;
	const { node, filter, gamertag } = useParams();
	//#endregion
	
	//#region State
	const [showPerMatch, setShowPerMatch] = useState(false);
    const [sr, setSR] = useState<ServiceRecord | undefined>();

    const [selectedPlaylist, setSelectedPlaylist] = useState<HaloDotAPIPlaylist | undefined>();
	const [playlists, setPlaylists] = useState<HaloDotAPIPlaylist[] | undefined>([]);
	
	const [selectedVariant, setSelectedVariant] = useState<HaloDotAPICategory | undefined>();
	const [variants, setVariants] = useState<HaloDotAPICategory[] | undefined>([]);

	const [ranks, setRanks] = useState<string[] | undefined>([]);

	const [selectedFBFilter, setSelectedFBFilter] = useState<SRFilter | undefined>();
	const [fbFilters, setFBFilters] = useState<SRFilter[] | undefined>([]);
	
	const [season, setSeason] = useState("");
	const [seasons, setSeasons] = useState<HaloDotAPISeason[]>([]);
	//#endregion

	const loadData = useCallback(async () => 
	{		
		Debugger.LoadView("FilteredView");
		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Filters");

		// Get seasons
		if (!seasons || seasons.length === 0)
		{
			setSeasons(await app.GetSeasons());
			const curr = await app.GetCurrentSeason();
			if (curr) { setSeason(curr.properties.identifier); }
		}
		
		// Get player's service record
		if (gamertag && node)
		{
			setLoadingMessage("Loading filters");

			if (node === ServiceRecordFilter.Playlist)
			{
				setPlaylists(await app.GetPlaylists());
				setVariants(undefined);
				setFBFilters(undefined);
				switchTab(undefined, SRTabs.Playlists);
			}
			else if (node === ServiceRecordFilter.Variant)
			{
				const notAllowed = ["unknown", "campaign", "extraction", "juggernaut", "vip", "escalation", "grifball", "assault"];
				const variants = await app.GetVariants();
				setVariants(variants.filter(variant => !notAllowed.includes(variant.name.toLowerCase())));
				setPlaylists(undefined);
				setFBFilters(undefined);
				switchTab(undefined, SRTabs.Variants);
			}
			else if (node === ServiceRecordFilter.Ranked)
			{
				setSR(await app.GetServiceRecordFromAutocode(gamertag, "", undefined, undefined, ServiceRecordType.ranked));
				//setRanks(["Solo-Duo MnK", "Solo-Duo Controller", "Open Crossplay"]);
				setRanks(undefined);
				setVariants(undefined);
				setPlaylists(undefined);
				setSelectedVariant(undefined);
				setSelectedPlaylist(undefined);
				setSelectedFBFilter(undefined);
				setFBFilters(undefined);
				switchTab(undefined, SRTabs.Ranked);
			}
			else if (node === ServiceRecordFilter.Social)
			{
				setSR(await app.GetServiceRecordFromAutocode(gamertag, "", undefined, undefined, ServiceRecordType.social));
				setRanks(undefined);
				setVariants(undefined);
				setPlaylists(undefined);
				setSelectedVariant(undefined);
				setSelectedPlaylist(undefined);
				setSelectedFBFilter(undefined);
				setFBFilters(undefined);
				switchTab(undefined, SRTabs.Social);
			}
			else if (node === ServiceRecordFilter.Customs)
			{
				setSR(await app.GetServiceRecordFromAutocode(gamertag, "", undefined, undefined, ServiceRecordType.custom));
				setRanks(undefined);
				setVariants(undefined);
				setPlaylists(undefined);
				setSelectedVariant(undefined);
				setSelectedPlaylist(undefined);
				setSelectedFBFilter(undefined);
				setFBFilters(undefined);
				switchTab(undefined, SRTabs.SRCustoms);
			}
			else if (node === ServiceRecordFilter.Local)
			{
				setSR(await app.GetServiceRecordFromAutocode(gamertag, "", undefined, undefined, ServiceRecordType.local));
				setRanks(undefined);
				setVariants(undefined);
				setPlaylists(undefined);
				setSelectedVariant(undefined);
				setSelectedPlaylist(undefined);
				setSelectedFBFilter(undefined);
				setFBFilters(undefined);
				switchTab(undefined, SRTabs.SRLocal);
			}
			else if (node === ServiceRecordFilter.Maps || node === ServiceRecordFilter.Outcomes)
			{
				setFBFilters(await app.GetAvailableFilters(gamertag, node));
				setRanks(undefined);
				setVariants(undefined);
				setPlaylists(undefined);
				setSelectedVariant(undefined);
				setSelectedPlaylist(undefined);
				switchTab(undefined, node === ServiceRecordFilter.Maps ? SRTabs.Maps : SRTabs.MatchOutcome);
			}

			const myPlayer = await app.GetPlayerAppearanceAndCROnly(gamertag);
			updatePlayer(gamertag, myPlayer.appearance);
            
			app.logger.LogViewServiceRecord(true);
		}

		setLoadingMessage("");
	}, [app, gamertag, node, seasons, setSeasons, setSeason, switchTab, setLoadingMessage, updatePlayer]);

	const loadFilteredSR = useCallback(async () => 
	{		
		// Ensure we can update from HaloDotAPI
		if (!await app.CanUpdate()) 
		{ 
			setApiError(true); 
			return;
		}

		// Get player's service record
		if (gamertag && node && filter)
		{
			setLoadingMessage("Loading Filtered Service Record");

			if (node === ServiceRecordFilter.Playlist)
			{
				setSR(await app.GetServiceRecordFromAutocode(gamertag, season, filter));
				setSelectedPlaylist(playlists?.filter(playlist => playlist.id === filter)[0]);
				setSelectedVariant(undefined);
				setSelectedFBFilter(undefined);
			}
			else if (node === ServiceRecordFilter.Variant)
			{
				setSR(await app.GetServiceRecordFromAutocode(gamertag, season, undefined, filter));
				setSelectedVariant(variants?.filter(variant => variant.id === +filter)[0]);
				setSelectedPlaylist(undefined);
				setSelectedFBFilter(undefined);
			}
			else if (node === ServiceRecordFilter.Maps || node === ServiceRecordFilter.Outcomes)
			{
				setSR(await app.GetFilteredServiceRecord(gamertag, node, filter));
				setSelectedFBFilter(fbFilters?.filter(map => map.name === filter)[0]);
				setSelectedVariant(undefined);
				setSelectedPlaylist(undefined);
			}

			setLoadingMessage("");
		}
	}, [app, gamertag, node, filter, season, fbFilters, playlists, variants, setSR, setSelectedPlaylist, setSelectedVariant, setLoadingMessage, setApiError]);

	const onFilterSelected = useCallback((filter: string) =>
	{
		switchTab(`/service_record/${node}/${gamertag}/${filter}`, 
			node === ServiceRecordFilter.Playlist ? SRTabs.Playlists : 
			node === ServiceRecordFilter.Ranked ? SRTabs.Ranked : 
			node === ServiceRecordFilter.Social ? SRTabs.Social : 
			node === ServiceRecordFilter.Variant ? SRTabs.Variants : 
			node === ServiceRecordFilter.Maps ? SRTabs.Maps : 
			node === ServiceRecordFilter.Outcomes ? SRTabs.MatchOutcome : undefined);
	}, [switchTab, gamertag, node]);

    useEffect(() =>
    {
        loadData();
		setSR(undefined);
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [node, gamertag]);

	useEffect(() =>
	{
		if (filter)
		{
			loadFilteredSR();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filter]);
	
	useEffect(() =>
	{
		if (node === ServiceRecordFilter.Playlist || node === ServiceRecordFilter.Variant || node === ServiceRecordFilter.Maps)
		{
			loadFilteredSR();
		}
		else { loadData(); }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [season]);

	return (
		<Box component="main" sx={{ flexGrow: 1 }}>
			<Helmet>
				<title>{`Spartan Record | Filtered | ${gamertag}`}</title>
				<meta name="description" content={`${gamertag} - Halo Infinite statistics - ${node} - ${filter ?? "Filtered"}`} />
				<meta property="og:title" content="Spartan Record" />
				<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/service_record/${node}/${gamertag}/${filter}`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<Box sx={{ p: 2 }}>
				<Grid container spacing={2}>
					{/* Top */}
					<Grid item xs={12}>
						<Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", ml: 1 }}>
							{(node === ServiceRecordFilter.Playlist || node === ServiceRecordFilter.Variant) && <SeasonChooser season={season} seasons={seasons} setSeason={setSeason} hideAll={node === ServiceRecordFilter.Playlist} />}
							{node === ServiceRecordFilter.Playlist && <Box sx={{ ml: 2 }}><PlaylistChooser playlist={filter ?? ""} playlists={playlists ?? []} setPlaylist={onFilterSelected} hideAll useId /></Box>}
							<Box sx={{ flexGrow: 1 }}></Box>
							<ServiceRecordFilters setPerMatch={setShowPerMatch} />
						</Box>
					</Grid>
					{/* Still top but less so*/}
					{node !== ServiceRecordFilter.Playlist && 
						<Grid item xs={12}>
							<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
								<ChipFilters activeFilter={filter ?? ""} filters={playlists ?? variants ?? ranks ?? fbFilters ?? []} onFilterClick={onFilterSelected} />
							</Box>
						</Grid>
					}
					{sr &&
					<>
						{/* Far left */}
						<Grid container item spacing={2} md={12} lg={6} xl={4} sx={{ alignContent: "flex-start" }}>
							{node !== ServiceRecordFilter.Social && node !== ServiceRecordFilter.Ranked && node !== ServiceRecordFilter.Outcomes && <Grid item xs={12}>
								<ImageCard image={selectedPlaylist?.image_urls?.hero ?? selectedVariant?.image_urls?.thumbnail ?? (node === ServiceRecordFilter.Maps && selectedFBFilter ? (AllMaps as any)[selectedFBFilter.name]?.thumbnail_url : "")} title={selectedPlaylist?.name ?? selectedVariant?.name ?? selectedFBFilter?.name} />
							</Grid>}
							{node === ServiceRecordFilter.Ranked && <Grid item xs={12}><TitleCard title="Ranked"></TitleCard></Grid>}
							{node === ServiceRecordFilter.Social && <Grid item xs={12}><TitleCard title="Social"></TitleCard></Grid>}
							<Grid item xs={12}>
								<MatchesBreakdown serviceRecord={sr} />
							</Grid>
							{!isSubscribedToPatreon && <Grid item xs={12}>
								<FluidAd adId="8600101244" isAdFree={isSubscribedToPatreon} />
							</Grid>}
							<Grid item xs={12}>
								<KDABreakdown serviceRecord={sr} />
							</Grid>
							<Grid item xs={12}>
								<TimePlayed serviceRecord={sr} showPerMatch={showPerMatch} />
							</Grid>
						</Grid>
						{/* Middle 5 */}
						<Grid container item spacing={2} sm={12} md={6} lg={6} xl={3} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<KillDeathCard serviceRecord={sr} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<KillBreakdownCard serviceRecord={sr} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<VehicleBreakdown serviceRecord={sr} showPerMatch={showPerMatch} />
							</Grid>
						</Grid>
						{/* Far right */}
						<Grid container item spacing={2} sm={12} md={6} lg={12} xl={5} sx={{ alignContent: "flex-start" }}>
							<Grid item xs={12}>
								<TopMedals medals={sr.medals} matchesPlayed={sr.matchesPlayed} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<AssistBreakdown serviceRecord={sr} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<ShotsBreakdown serviceRecord={sr} showPerMatch={showPerMatch} />
							</Grid>
							{!isSubscribedToPatreon && <Grid item xs={12}>
								<FluidAd adId="8600101244" isAdFree={isSubscribedToPatreon} />
							</Grid>}
							<Grid item xs={12}>
								<ModeBreakdown serviceRecord={sr} showPerMatch={showPerMatch} />
							</Grid>
							<Grid item xs={12}>
								<DamageBreakdown serviceRecord={sr} showPerMatch={showPerMatch} />
							</Grid>
						</Grid>
					</>}
				</Grid>
			</Box>
		</Box>
	);
}