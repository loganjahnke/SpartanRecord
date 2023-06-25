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
import { Box } from "@mui/material";
import { AHLoading } from "./Assets/Components/Layout/AHLoading";
import { UhOh } from "./Pages/UhOh";
import { BestMatchesView } from "./Pages/BestMatchesView";
import { Player } from "./Objects/Model/Player";
import { Appearance } from "./Objects/Model/Appearance";
import { ServiceRecord } from "./Objects/Model/ServiceRecord";
import { PatreonView } from "./Pages/PatreonView";
import { ModesView } from "./Pages/ModesView";
import { CSRS } from "./Objects/Model/CSRS";
import { OtherCreators } from "./Pages/OtherCreators";
import { Admin } from "./Pages/Admin";
import { Donate } from "./Pages/Donate";
import { LeaderboardView } from "./Pages/LeaderboardView";
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
	const [isAllowed, setIsAllowed] = useState(true);
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
	 * @param isPrivate is the gamertag private?
	 */
	const updatePlayer = useCallback(async (gamertag?: string, appearance?: Appearance, serviceRecord?: ServiceRecord, csrs?: CSRS[], careerRank?: CareerRankSchema, isPrivate?: boolean) =>
	{
		const newPlayer = Player.Copy(player);

		if (gamertag && gamertag !== player.gamertag)
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
			if (appearance) { newPlayer.appearance = appearance; }
			if (serviceRecord) { newPlayer.serviceRecord = serviceRecord; }
			if (csrs) { newPlayer.csrs = csrs; }
			if (careerRank) { newPlayer.careerRank = careerRank; }
			if (isPrivate !== undefined) { newPlayer.isPrivate = isPrivate; }
		}

		setPlayer(newPlayer);
		setIsAllowed(await arrowhead.GetIsAllowed(newPlayer.gamertag));
	}, [player, setPlayer, setIsAllowed, arrowhead]);
	//#endregion

	//#region App Bar and Drawer
	/** Opens or closes the drawer */
	const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

	/** Navigates to a new URL */
	const switchTab = (url?: string, tab?: SRTabs) => 
	{
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
				<AHDrawer player={player} currentTab={tab} container={container} mobileOpen={mobileOpen} switchTab={switchTab} handleDrawerToggle={handleDrawerToggle} isAllowed={isAllowed} />
				<AHLoading loadingMessage={loadingMessage} />
				<Routes>
					{/* Home Views */}
					<Route path="/" element={<HomeView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} />} />

					{/* Metadata Views */}
					<Route path="/playlists" element={<PlaylistsView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} />} />
					<Route path="/store" element={<StoreView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} />} />

					{/* Halo Clips */}
					<Route path="/clips/:gamertag" element={<ClipsView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} />} />
					
					{/* Compare Views */}
					<Route path="/compare/:gamertag1" element={<CompareView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} isAllowed={isAllowed} />} />
					<Route path="/compare/:gamertag1/:gamertag2" element={<CompareView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} isAllowed={isAllowed} />} />
					
					{/* Mode Views */}
					<Route path="/modes/:gamertag" element={<ModesView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} isAllowed={isAllowed} />} />
					
					{/* Career Rank Views */}
					<Route path="/career_rank/:gamertag" element={<CareerRankView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} isAllowed={isAllowed} />} />

					{/* Service Record Views */}
					<Route path="/service_record/:gamertag" element={<PlayerView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} isAllowed={isAllowed} />} />
					<Route path="/service_record/:node/:gamertag" element={<FilteredView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} />} />
					<Route path="/service_record/:node/:gamertag/:filter" element={<FilteredView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} />} />
					
					{/* Best Matches Views */}
					<Route path="/best/matches/:gamertag" element={<BestMatchesView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} />} />
					
					{/* Spartan Company Views */}
					<Route path="/spartan_company" element={<SpartanCompanyView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} />} />
					
					{/* Medal Views */}
					<Route path="/medals/:gamertag" element={<MedalsView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} />} />
					
					{/* Matches Views */}
					<Route path="/matches/:gamertag" element={<MultiMatchesView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} isAllowed={isAllowed} />} />
					<Route path="/customs/:gamertag" element={<MultiMatchesView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} isAllowed={isAllowed} customs />} />
					<Route path="/LAN/:gamertag" element={<MultiMatchesView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} isAllowed={isAllowed} local />} />
					<Route path="/match/:id" element={<BetaSingleMatchView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} isAllowed={isAllowed} />} />
					<Route path="/match/:id/:gamertag" element={<BetaSingleMatchView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} isAllowed={isAllowed} />} />
					
					{/* Leaderboard Views */}
					<Route path="/leaderboard" element={<LeaderboardView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} isAllowed={isAllowed} />} />
					<Route path="/leaderboard/:gamertag" element={<LeaderboardView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} isAllowed={isAllowed} />} />
					<Route path="/leaderboard/:gamertag/:category" element={<LeaderboardView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} isAllowed={isAllowed} />} />
					
					{/* Admin Views */}
					<Route path="/patreon/:gamertag" element={<PatreonView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} isAllowed={isAllowed} />} />
					<Route path="/admin" element={<Admin app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} isAllowed={isAllowed} />} />
					<Route path="/powered_by_halodotapi" element={<OtherCreators />} />
					<Route path="/donate" element={<Donate />} />
					<Route path="*" element={<UhOh />} />
				</Routes>
			</Box>
		</ThemeProvider>
	);
}

export default App;
