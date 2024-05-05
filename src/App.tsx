import { Routes, Route, useNavigate } from "react-router-dom";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ThemeProvider } from '@mui/material/styles';
import { SpartanCompanyView } from "./Pages/Spartan Company/SpartanCompanyView";
import { ArrowheadTheme } from "./Assets/Theme/ArrowheadTheme";
import { PlayerView } from "./Pages/PlayerView";
import { MedalsView } from "./Pages/MedalsView";
import { useCallback, useMemo, useState } from "react";
import { MultiMatchesView } from "./Pages/Matches/MultiMatchesView";
import { FilteredView } from "./Pages/FilteredView";
import { SCData } from "./Database/SCData";
import { HomeView } from "./Pages/HomeView";
import { AHAppBar } from "./Assets/Components/Layout/AHAppBar";
import { AHDrawer, SRTabs } from "./Assets/Components/Layout/AHDrawer";
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import { AHLoading } from "./Assets/Components/Layout/AHLoading";
import { UhOh } from "./Pages/UhOh";
import { Player } from "./Objects/Model/Player";
import { Appearance } from "./Objects/Model/Appearance";
import { ServiceRecord } from "./Objects/Model/ServiceRecord";
import { PatreonView } from "./Pages/PatreonView";
import { CSRS } from "./Objects/Model/CSRS";
import { OtherCreators } from "./Pages/OtherCreators";
import { Admin } from "./Pages/Admin";
import { CSRLeaderboardView } from "./Pages/Leaderboards/CSRLeaderboardView";
import { LegacyLeaderboardView } from "./Pages/Leaderboards/LegacyLeaderboardView";
import { CompareView } from "./Pages/Compare/CompareView";
import { BetaSingleMatchView } from "./Pages/Matches/BetaSingleMatchView";
import { PlaylistsView } from "./Pages/Playlists/PlaylistsView";
import { StoreView } from "./Pages/Store/StoreView";
import { ClipsView } from "./Pages/Clips/ClipsView";
import { CareerRankSchema, EmptyCareerRank } from "./Database/Schemas/CareerRankSchema";
import { CareerRankView } from "./Pages/Career Rank/CareerRankView";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	databaseURL: process.env.NODE_ENV === "production" ? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_TEST_URL,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_APP_ID,
	measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

const App = () =>
{
	//#region Firebase
	const app = initializeApp(firebaseConfig);
	const database = getDatabase(app);
	const analytics = getAnalytics();
	const arrowhead = useMemo(() => new SCData(app, database, analytics), [app, database, analytics]);
	//#endregion

	//#region State
	const [player, setPlayer] = useState<Player>(new Player());
	const [mobileOpen, setMobileOpen] = useState(false);
	const [tab, setTab] = useState("Search");
	const [loadingMessage, setLoadingMessage] = useState("");
	const [backgroundLoadingProgress, setBackgroundLoadingProgress] = useState<string>("");
	const [isSubscribedToPatreon, setIsSubscribedToPatreon] = useState(false);
	const [apiError, setApiError] = useState(false);
	//#endregion

	//#region Navigate
	const navigate = useNavigate();
	//#endregion

	//#region Callback and Effect
	/**
	 * Updates the player
	 * @param gamertag the new gamertag of the player
	 * @param appearance the new appearance of the player
	 * @param serviceRecord the new service record for the player
	 * @param csrs the ranked ranks
	 * @param careerRank the career rank for the player
	 * @param isPrivate is the gamertag private?
	 * @param oldPlayer the current (old) player
	 */
	const updatePlayer = useCallback(async (gamertag?: string, appearance?: Appearance, serviceRecord?: ServiceRecord, csrs?: CSRS[], careerRank?: CareerRankSchema, isPrivate?: boolean, oldPlayer?: Player) =>
	{
		const newPlayer = Player.Copy(oldPlayer ?? player);

		if (gamertag && gamertag.toUpperCase() !== newPlayer.gamertag.toUpperCase())
		{
			newPlayer.gamertag = gamertag;
			newPlayer.appearance = appearance ?? new Appearance();
			newPlayer.serviceRecord = serviceRecord ?? new ServiceRecord();
			newPlayer.csrs = csrs ?? [];
			newPlayer.careerRank = careerRank ?? EmptyCareerRank();
			newPlayer.isPrivate = isPrivate !== undefined ? isPrivate : false;
		}
		else
		{
			if (appearance && appearance.emblemURL) { newPlayer.appearance = appearance; }
			if (serviceRecord && !serviceRecord.IsEmpty()) { newPlayer.serviceRecord = serviceRecord; }
			if (csrs && csrs.length > 0) { newPlayer.csrs = csrs; }
			if (careerRank?.data?.current?.title) { newPlayer.careerRank = careerRank; }
			if (isPrivate !== undefined) { newPlayer.isPrivate = isPrivate; }
		}

		setPlayer(newPlayer);
		setIsSubscribedToPatreon(await arrowhead.GetIsSubscribedToPatreon(newPlayer.gamertag));
	}, [player, arrowhead, setPlayer, setIsSubscribedToPatreon]);

	/**
	 * On the toast closing
	 */
	const onSnackbarClose = useCallback(() =>
	{
		setApiError(false);
	}, [setApiError]);
	//#endregion

	//#region App Bar and Drawer
	/** Opens or closes the drawer */
	const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

	/** Navigates to a new URL */
	const switchTab = (url?: string, tab?: SRTabs) => 
	{
		setLoadingMessage("");
		setBackgroundLoadingProgress("");
		setMobileOpen(false);
		setTab(tab ?? "");
		if (url) { navigate(url); }
	}

	/** The container for the drawer */
	const container = window !== undefined ? () => window.document.body : undefined;
	//#endregion

	return (
		<ThemeProvider theme={ArrowheadTheme.theme}>
			<Box sx={{ display: "flex", backgroundColor: "background.paper", height: "calc(100vh - 34px)" }}>
				<AHAppBar player={player} handleDrawerToggle={handleDrawerToggle} backgroundLoadingMessage={backgroundLoadingProgress} />
				<AHDrawer player={player} currentTab={tab} container={container} mobileOpen={mobileOpen} switchTab={switchTab} handleDrawerToggle={handleDrawerToggle} isAllowed={isSubscribedToPatreon} />
				<AHLoading loadingMessage={loadingMessage} />
				<Snackbar open={apiError} autoHideDuration={6000} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={onSnackbarClose}>
					<Alert onClose={onSnackbarClose} severity="error" sx={{ width: '100%' }}>
						<Typography>API limit reached!</Typography>
						<Typography variant="caption">Sorry! SpartanRecord.com hit the API limit, try again later.</Typography>
					</Alert>
				</Snackbar>
				<Routes>
					{/* Home Views */}
					<Route path="/" element={<HomeView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />

					{/* Metadata Views */}
					<Route path="/playlists" element={<PlaylistsView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					<Route path="/store" element={<StoreView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />

					{/* Halo Clips */}
					<Route path="/clips/:gamertag" element={<ClipsView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					
					{/* Compare Views */}
					<Route path="/compare/:gamertag1" element={<CompareView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					<Route path="/compare/:gamertag1/:gamertag2" element={<CompareView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					
					{/* Career Rank Views */}
					<Route path="/career_rank/:gamertag" element={<CareerRankView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />

					{/* Service Record Views */}
					<Route path="/service_record/:gamertag" element={<PlayerView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					<Route path="/service_record/:node/:gamertag" element={<FilteredView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					<Route path="/service_record/:node/:gamertag/:filter" element={<FilteredView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					
					{/* Spartan Company Views */}
					<Route path="/spartan_company" element={<SpartanCompanyView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					
					{/* Medal Views */}
					<Route path="/medals/:gamertag" element={<MedalsView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					
					{/* Matches Views */}
					<Route path="/matches/:gamertag" element={<MultiMatchesView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					<Route path="/customs/:gamertag" element={<MultiMatchesView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} customs />} />
					<Route path="/LAN/:gamertag" element={<MultiMatchesView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} local />} />
					<Route path="/match/:id" element={<BetaSingleMatchView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					<Route path="/match/:id/:gamertag" element={<BetaSingleMatchView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					
					{/* Leaderboard Views */}
					<Route path="/leaderboard/:playlist" element={<CSRLeaderboardView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					<Route path="/legacy/leaderboard" element={<LegacyLeaderboardView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					<Route path="/legacy/leaderboard/:gamertag" element={<LegacyLeaderboardView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					<Route path="/legacy/leaderboard/:gamertag/:category" element={<LegacyLeaderboardView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					
					{/* Admin Views */}
					<Route path="/subscribe" element={<PatreonView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					<Route path="/subscribe/:gamertag" element={<PatreonView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					<Route path="/admin" element={<Admin app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} setApiError={setApiError} isSubscribedToPatreon={isSubscribedToPatreon} />} />
					<Route path="/powered_by_halodotapi" element={<OtherCreators />} />
					<Route path="/privacy" element={() => {window.location.href="/privacy.html"}} />
					<Route path="*" element={<UhOh />} />
				</Routes>
			</Box>
		</ThemeProvider>
	);
}

export default App;
