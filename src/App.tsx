import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { MedalsSummary } from './Pages/MedalsSummary';
import { ThemeProvider } from '@mui/material/styles';
import { ArrowheadFirebase } from "./Database/ArrowheadFirebase";
import { CompanyView } from "./Pages/CompanyView";
import { Company } from "./Objects/Model/Company";
import { ArrowheadTheme } from "./Assets/Theme/ArrowheadTheme";
import { PlayerView } from "./Pages/PlayerView";
import { SingleUser } from "./Pages/SingleUser";
import { MedalsView } from "./Pages/MedalsView";

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
	
	const db = new ArrowheadFirebase(database);
	const company = new Company("Arrowhead");

	return (
		<ThemeProvider theme={ArrowheadTheme.theme}>
			<div className="App">
				<Router>
					<Routes>
						<Route path="/" element={<CompanyView db={db} company={company} />} />
						<Route path="/service_record/:gamertag" element={<PlayerView db={db} company={company} />} />
						<Route path="/service_record/:gamertag/medals" element={<MedalsView db={db} company={company} />} />
					</Routes>
				</Router>
			</div>
		</ThemeProvider>
	);
}

export default App;
