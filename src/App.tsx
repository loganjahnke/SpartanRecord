import { Routes, Route, useNavigate } from "react-router-dom";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ThemeProvider } from '@mui/material/styles';
import { SpartanCompanyView } from "./Pages/Spartan Company/SpartanCompanyView";
import { ArrowheadTheme } from "./Assets/Theme/ArrowheadTheme";
import { PlayerView } from "./Pages/PlayerView";
import { MedalsView } from "./Pages/MedalsView";
import { useCallback, useEffect, useState } from "react";
import { MatchesView } from "./Pages/MatchesView";
import { SingleMatchView } from "./Pages/SingleMatchView";
import { FilteredView } from "./Pages/FilteredView";
import { SCData } from "./Database/SCData";
import { HomeView } from "./Pages/HomeView";
import { AHAppBar } from "./Assets/Components/Layout/AHAppBar";
import { AHDrawer } from "./Assets/Components/Layout/AHDrawer";
import { Box } from "@mui/material";
import { AHLoading } from "./Assets/Components/Layout/AHLoading";
import { SCConfigView } from "./Pages/Spartan Company/SCConfigView";
import { UhOh } from "./Pages/UhOh";
import { ServiceRecordFilter } from "./Database/ArrowheadFirebase";
import { BestMatchesView } from "./Pages/BestMatchesView";
import { Player } from "./Objects/Model/Player";
import { Appearance } from "./Objects/Model/Appearance";
import { ServiceRecord } from "./Objects/Model/ServiceRecord";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE,
	authDomain: "arrowhead-company.firebaseapp.com",
	projectId: "arrowhead-company",
	storageBucket: "arrowhead-company.appspot.com",
	messagingSenderId: "232273781507",
	appId: "1:232273781507:web:f76541de89eba0baa77f36",
	measurementId: "G-LWFYKTGPY4"
};

const App = () =>
{
	//#region Firebase
	const app = initializeApp(firebaseConfig);
	const database = getDatabase(app);
	const analytics = getAnalytics();
	const arrowhead = new SCData(database, analytics);
	//#endregion

	//#region State
	const [player, setPlayer] = useState<Player>(new Player());
	//#endregion

	//#region Navigate
	const navigate = useNavigate();
	//#endregion

	//#region Callback and Effect
	const updateIsAllowed = useCallback(async () =>
	{
		setIsAllowed(await arrowhead.GetIsAllowed(player.gamertag));
	}, [player]);

	/**
	 * Updates the player
	 * @param gamertag the new gamertag of the player
	 * @param appearance the new appearance of the player
	 * @param serviceRecord the new service record for the player
	 */
	const updatePlayer = useCallback((gamertag?: string, appearance?: Appearance, serviceRecord?: ServiceRecord, season?: number) =>
	{
		if (gamertag && gamertag !== player.gamertag)
		{
			player.gamertag = gamertag;
			player.appearance = appearance ?? new Appearance();
			player.serviceRecord = serviceRecord ?? new ServiceRecord();
			player.season = season ?? -1;
		}
		else
		{
			if (appearance) { player.appearance = appearance; }
			if (serviceRecord) { player.serviceRecord = serviceRecord; }
			player.season = season ?? -1;
		}

		setPlayer(player);
	}, [player, setPlayer]);

	useEffect(() => { updateIsAllowed() }, [player]);
	//#endregion

	//#region App Bar and Drawer
	const [mobileOpen, setMobileOpen] = useState(false);
	const [tab, setTab] = useState("");
	const [loadingMessage, setLoadingMessage] = useState("");
	const [backgroundLoadingProgress, setBackgroundLoadingProgress] = useState<number | undefined>(undefined);
	const [isAllowed, setIsAllowed] = useState(true);

	/** Opens or closes the drawer */
	const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

	/** Navigates to a new URL */
	const switchTab = (url: string, tab?: string) => 
	{
		setMobileOpen(false);
		setTab(tab ?? "");
		navigate(url);
	}

	/** The container for the drawer */
	const container = window !== undefined ? () => window.document.body : undefined;
	//#endregion

	return (
		<ThemeProvider theme={ArrowheadTheme.theme}>
			<Box sx={{ display: "flex", backgroundColor: "background.paper", height: "calc(100vh - 34px)" }}>
				<AHAppBar player={player} handleDrawerToggle={handleDrawerToggle} loadingFromAutocode={backgroundLoadingProgress} />
				<AHDrawer player={player} currentTab={tab} container={container} mobileOpen={mobileOpen} switchTab={switchTab} handleDrawerToggle={handleDrawerToggle} isAllowed={isAllowed} />
				<AHLoading loadingMessage={loadingMessage} />
				<Routes>
					<Route path="/" element={<HomeView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} switchTab={switchTab} />} />
					<Route path="/service_record/:gamertag" element={<PlayerView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} />} />
					<Route path={`/service_record/:node/:gamertag`} element={<FilteredView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} />} />
					<Route path={`/service_record/:node/:gamertag/:filter`} element={<FilteredView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} />} />
					<Route path="/best/matches/:gamertag" element={<BestMatchesView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} />} />
					<Route path="/arrowhead" element={<SpartanCompanyView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} />} />
					<Route path="/medals/:gamertag" element={<MedalsView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} />} />
					<Route path="/matches/:gamertag" element={<MatchesView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} />} />
					<Route path="/match/:id" element={<SingleMatchView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} />} />
					<Route path="/match/:id/:gamertag" element={<SingleMatchView app={arrowhead} setLoadingMessage={setLoadingMessage} setBackgroundLoadingProgress={setBackgroundLoadingProgress} player={player} updatePlayer={updatePlayer} />} />
					<Route path="*" element={<UhOh />} />
				</Routes>
			</Box>
		</ThemeProvider>
	);
}

export default App;
