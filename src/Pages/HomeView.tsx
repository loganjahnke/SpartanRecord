import { Box, Divider, Link, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { ViewProps } from "./Props/ViewProps";
import { SRTabs } from "../Assets/Components/Layout/AHDrawer";
import { Player } from "../Objects/Model/Player";
import { Cookie } from "../Objects/Helpers/Cookie";
import { Helmet } from "react-helmet";
import { GamertagSearch } from "../Assets/Components/ServiceRecord/GamertagSearch";
import { HaloDotAPISeason } from "../Database/Schemas/AutocodeMetadata";
import { Debugger } from "../Objects/Helpers/Debugger";
import { WhatsNew } from "../Assets/Components/WhatsNew/WhatsNew";

export function HomeView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, player, updatePlayer, switchTab } = props;
	//#endregion
	
	//#region State
	const [halodotapiVersion, setVersion] = useState("");
 	const [localGamertag, setLocalGamertag] = useState("");
	const [recentPlayers, setRecentPlayers] = useState<Player[]>(Cookie.getRecents().map(gamertag => new Player(gamertag)));
	const [favoritePlayers, setFavoritePlayers] = useState<Player[]>([]);
	const [currSeason, setCurrSeason] = useState<HaloDotAPISeason>();
	const [showWhatsNew, setShowWhatsNew] = useState(false);
	//#endregion

	/** Controlled search component */
	function onGamertagTextChange(event: React.ChangeEvent<HTMLInputElement>)
	{
		setLocalGamertag(event.target.value);
	};

	/** When the search button is pressed */
	function searchForGamertag()
	{
		if (localGamertag === "") { return; }
		updatePlayer(localGamertag);
		switchTab(`service_record/${localGamertag}`, SRTabs.ServiceRecord);
	}

	/** When the Year in Review button is pressed */
	// function searchForGamertagYearInReview()
	// {
	// 	if (localGamertag === "") { return; }
	// 	updatePlayer(localGamertag);
	// 	switchTab(`year_in_review/2024/${localGamertag}`, SRTabs.YearInReview);
	// }

	/** When the search button is pressed */
	function openRecent(gamertag: string)
	{
		updatePlayer(localGamertag);
		switchTab(`service_record/${gamertag}`, SRTabs.ServiceRecord);
	}

	/** When the secondary recent button is pressed */
	// function openRecentSecondaryAction(gamertag: string)
	// {
	// 	updatePlayer(localGamertag);
	// 	switchTab(`year_in_review/2024/${gamertag}`, SRTabs.YearInReview);
	// }

	/** When enter is pressed */
	function searchForGamertagViaEnter(event: React.KeyboardEvent<HTMLDivElement>)
	{
		if (event.key === "Enter")
		{
			searchForGamertag();
		}
	};

	/** Loads the recent players and their appearance */
	const loadRecentPlayers = useCallback(async () =>
	{
		const recentGamertags = Cookie.getRecents();
		if (!recentGamertags || recentGamertags.length === 0) { return; }

		const players: Player[] = [];
		for (const gamertag of recentGamertags)
		{
			players.push(await app.GetPlayerAppearanceOnly(gamertag));
		}

		setRecentPlayers(players);

	}, [app, setRecentPlayers]);

	/** Loads the favorite players and their appearance */
	const loadFavoritePlayers = useCallback(async () =>
	{		
		const favorites = Cookie.getFavorites();
		if (!favorites || favorites.length === 0) { return false; }

		const players: Player[] = [];
		for (const gamertag of favorites)
		{
			players.push(await app.GetPlayerAppearanceOnly(gamertag));
		}

		setFavoritePlayers(players);

		return players.length > 0;

	}, [app, setFavoritePlayers]);

	const loadData = useCallback(async () => 
	{
		Debugger.LoadView("HomeView");

		setVersion(await app.GetVersion());
		setCurrSeason(await app.GetCurrentSeason());
		setShowWhatsNew(!Cookie.getHideWhatsNew());

		if (!loadFavoritePlayers())
		{
			loadRecentPlayers();
		}

	}, [app, setCurrSeason, setVersion, loadFavoritePlayers, loadRecentPlayers]);

	const onDismissWhatsNew = useCallback(() => 
	{
		Cookie.dismissWhatsNew();
		setShowWhatsNew(false);
	}, [setShowWhatsNew]);

	useEffect(() =>
	{
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	return (
		<Box component="main" className="pageContainer">
			<Helmet>
				<title>{`Spartan Record`}</title>
				<meta name="description" content={`Halo Infinite statistics such as KDA, KDR, and more`} />
				<meta property="og:title" content="Spartan Record" />
				<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<Box className="underToolbarContainerNoPadding" sx={{
				backgroundPosition: "center", 
				overflow: "hidden",
				backgroundSize: "cover", 
				backgroundImage: currSeason 
					? `url(${currSeason.image_urls.battlepass_background})`
					: "url(https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoicHJvZ3Jlc3Npb24vU2NyZWVuQmFja2dyb3VuZHMvc2Vhc29uX3Vwc2VsbF9iYWNrZ3JvdW5kX1MzLnBuZyIsIm9wdGlvbnMiOnt9fQ%3D%3D)" 
			}}>
				<Box sx={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "rgba(1,64,82, 0.8)", textAlign: "center", overflow: "auto", justifyContent: "center" }}>
					<GamertagSearch search={localGamertag} openRecent={openRecent} onValueChanged={onGamertagTextChange} onKeyPress={searchForGamertagViaEnter} onSearch={searchForGamertag} recentPlayers={recentPlayers} favoritePlayers={favoritePlayers} />
					{showWhatsNew && <Box sx={{ textAlign: "center", alignSelf: "center", mt: 6, width: { xs: "90%", sm: "75%", md: "500px" }}}><WhatsNew gamertag={player?.gamertag} onDismiss={onDismissWhatsNew} switchTab={switchTab} /></Box>}
					<Box sx={{ textAlign: "center", flexGrow: 1, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
						<Typography variant="subtitle1" sx={{ textAlign: "center", fontSize: "0.6rem" }}>
							Powered by <Link sx={{ cursor: "pointer" }} href={process.env.REACT_APP_API_MARKETING_URL}>{process.env.REACT_APP_API_NAME}</Link>{halodotapiVersion ? ` v${halodotapiVersion} ` : " "}| Spartan Record v{process.env.REACT_APP_VERSION} | <Link href="/privacy.html">Privacy Policy</Link>
						</Typography>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}