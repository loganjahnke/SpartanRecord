import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ThemeProvider } from '@mui/material/styles';
import { ArrowheadFirebase } from "./Database/ArrowheadFirebase";
import { CompanyView } from "./Pages/CompanyView";
import { Company } from "./Objects/Model/Company";
import { ArrowheadTheme } from "./Assets/Theme/ArrowheadTheme";
import { PlayerView } from "./Pages/PlayerView";
import { MedalsView } from "./Pages/MedalsView";
import { useCallback, useState } from "react";
import { User } from "./Objects/Model/User";
import { getAuth } from "firebase/auth";
import { Player } from "./Objects/Model/Player";
import { MatchesView } from "./Pages/MatchesView";
import { SingleMatchView } from "./Pages/SingleMatchView";
import { FilteredView } from "./Pages/FilteredView";

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

	const db = new ArrowheadFirebase(database);
	const company = new Company("Arrowhead");

	const [myUser, setMyUser] = useState(new User(auth));

	const setPlayer = useCallback((player: Player) =>
	{
		let user = myUser;
		user.player = player;
		setMyUser(user);
	}, [myUser, setMyUser]);

	return (
		<ThemeProvider theme={ArrowheadTheme.theme}>
			<div className="App">
				<Router>
					<Routes>
						<Route path="/" element={<CompanyView db={db} company={company} user={myUser} setPlayer={setPlayer} />} />
						<Route path="/sr/:gamertag" element={<PlayerView db={db} company={company} user={myUser} />} />
						<Route path="/sr/:tree/:filter/:gamertag" element={<FilteredView db={db} company={company} user={myUser} />} />
						<Route path="/medals/:gamertag" element={<MedalsView db={db} company={company} user={myUser} />} />
						<Route path="/matches/:gamertag" element={<MatchesView db={db} company={company} user={myUser} />} />
						<Route path="/match/:id" element={<SingleMatchView db={db} company={company} user={myUser} />} />
					</Routes>
				</Router>
			</div>
		</ThemeProvider>
	);
}

export default App;
