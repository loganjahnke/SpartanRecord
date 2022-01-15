import { Routes, Route, useNavigate } from "react-router-dom";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ThemeProvider } from '@mui/material/styles';
import { SpartanCompanyView } from "./Pages/SpartanCompanyView";
import { ArrowheadTheme } from "./Assets/Theme/ArrowheadTheme";
import { PlayerView } from "./Pages/PlayerView";
import { MedalsView } from "./Pages/MedalsView";
import { useCallback, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { MatchesView } from "./Pages/MatchesView";
import { SingleMatchView } from "./Pages/SingleMatchView";
import { FilteredView } from "./Pages/FilteredView";
import { Arrowhead } from "./Database/Arrowhead";
import { AuthenticationView } from "./Pages/AuthenticationView";
import { HomeView } from "./Pages/HomeView";
import { AHAppBar } from "./Assets/Components/Layout/AHAppBar";
import { AHDrawer } from "./Assets/Components/Layout/AHDrawer";
import { Box } from "@mui/material";
import { AHLoading } from "./Assets/Components/Layout/AHLoading";
import { ArrowheadUser } from "./Objects/Model/ArrowheadUser";

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
	const auth = getAuth();
	const analytics = getAnalytics();
	const arrowhead = new Arrowhead(database, analytics, auth);
	//#endregion

	//#region My User
	const [loggedInUser, setLoggedInUser] = useState<ArrowheadUser | undefined>();
	//#endregion

	//#region Navigate
	const navigate = useNavigate();
	//#endregion

	//#region Load User
	const loadUser = useCallback(async () =>
	{
		await arrowhead.SyncProfile();
		setLoggedInUser(arrowhead.arrowheadUser);
		if (arrowhead.arrowheadUser?.player?.gamertag)
		{
			setTab("Service Record");
			navigate("/service_record/" + arrowhead.arrowheadUser.player.gamertag);
		}
	}, [arrowhead, setLoggedInUser, navigate]);

	useEffect(() =>
	{
		const authToken = sessionStorage.getItem("Auth Token");
		const gamertag = sessionStorage.getItem("Gamertag");
		if (authToken && gamertag)
		{
			loadUser();
		}
	}, []);
	//#endregion

	//#region App Bar and Drawer
	const [mobileOpen, setMobileOpen] = useState(false);
	const [tab, setTab] = useState("");
	const [subTab, setSubTab] = useState("");
	const [loadingMessage, setLoadingMessage] = useState("");

	/** Opens or closes the drawer */
	const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
	
	/** When logout is clicked */
	const logout = async () => 
	{
		await arrowhead.Logout();
		setLoggedInUser(undefined);
		navigate("/");
	}

	/** Navigates to a new URL */
	const switchTab = (url: string, tab?: string, subTab?: string) => 
	{
		setMobileOpen(false);
		setTab(tab ?? "");
		setSubTab(subTab ?? "");
		navigate(url);
	}

	/** After authenticating */
	const afterAuth = (success: boolean) =>
	{
		if (success)
		{
			loadUser();
		}
	}

	/** The container for the drawer */
	const container = window !== undefined ? () => window.document.body : undefined;
	//#endregion

	return (
		<ThemeProvider theme={ArrowheadTheme.theme}>
			<Box sx={{ display: "flex", backgroundColor: "background.paper", height: "100vh" }}>
				<AHAppBar player={loggedInUser?.player} handleDrawerToggle={handleDrawerToggle} openAuth={switchTab} />
				<AHDrawer loggedInUser={loggedInUser} currentTab={tab} subtab={subTab} container={container} mobileOpen={mobileOpen} switchTab={switchTab} handleDrawerToggle={handleDrawerToggle} onLogout={logout}/>
				<AHLoading loadingMessage={loadingMessage} />
				<Routes>
					<Route path="/" element={<HomeView app={arrowhead} setLoadingMessage={setLoadingMessage} />} />
					<Route path="/service_record/:gamertag" element={<PlayerView app={arrowhead} setLoadingMessage={setLoadingMessage} />} />
					<Route path="/service_record/:tree/:filter/:gamertag" element={<FilteredView app={arrowhead} setLoadingMessage={setLoadingMessage} />} />
					<Route path="/company/:company" element={<SpartanCompanyView app={arrowhead} setLoadingMessage={setLoadingMessage} />} />
					<Route path="/medals/:gamertag" element={<MedalsView app={arrowhead} setLoadingMessage={setLoadingMessage} />} />
					<Route path="/matches/:gamertag" element={<MatchesView app={arrowhead} setLoadingMessage={setLoadingMessage} />} />
					<Route path="/match/:id" element={<SingleMatchView app={arrowhead} setLoadingMessage={setLoadingMessage} />} />
					<Route path="/login" element={<AuthenticationView app={arrowhead} setLoadingMessage={setLoadingMessage} afterAuth={afterAuth} />} />
					<Route path="/signup" element={<AuthenticationView app={arrowhead} setLoadingMessage={setLoadingMessage} afterAuth={afterAuth} registering />} />
				</Routes>
			</Box>
		</ThemeProvider>
	);
}

export default App;
