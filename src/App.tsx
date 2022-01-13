import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ThemeProvider } from '@mui/material/styles';
import { SpartanCompanyView } from "./Pages/SpartanCompanyView";
import { SpartanCompany } from "./Objects/Model/SpartanCompany";
import { ArrowheadTheme } from "./Assets/Theme/ArrowheadTheme";
import { PlayerView } from "./Pages/PlayerView";
import { MedalsView } from "./Pages/MedalsView";
import { useCallback, useState } from "react";
import { ArrowheadUser } from "./Objects/Model/ArrowheadUser";
import { getAuth } from "firebase/auth";
import { Player } from "./Objects/Model/Player";
import { MatchesView } from "./Pages/MatchesView";
import { SingleMatchView } from "./Pages/SingleMatchView";
import { FilteredView } from "./Pages/FilteredView";
import { Arrowhead } from "./Database/Arrowhead";
import { AuthenticationView } from "./Pages/AuthenticationView";
import { HomeView } from "./Pages/HomeView";

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
	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	const database = getDatabase(app);
	const auth = getAuth();
	const analytics = getAnalytics();

	const arrowhead = new Arrowhead(database, analytics, auth);

	return (
		<ThemeProvider theme={ArrowheadTheme.theme}>
			<div className="App">
				<Router>
					<Routes>
						<Route path="/" element={<HomeView app={arrowhead} />} />
						<Route path="/service_record/:gamertag" element={<PlayerView app={arrowhead} />} />
						<Route path="/service_record/:tree/:filter/:gamertag" element={<FilteredView app={arrowhead} />} />
						<Route path="/company/:company" element={<SpartanCompanyView app={arrowhead} />} />
						<Route path="/medals/:gamertag" element={<MedalsView app={arrowhead} />} />
						<Route path="/matches/:gamertag" element={<MatchesView app={arrowhead} />} />
						<Route path="/match/:id" element={<SingleMatchView app={arrowhead} />} />
						<Route path="/login" element={<AuthenticationView app={arrowhead} />} />
						<Route path="/signup" element={<AuthenticationView app={arrowhead} registering />} />
					</Routes>
				</Router>
			</div>
		</ThemeProvider>
	);
}

export default App;
