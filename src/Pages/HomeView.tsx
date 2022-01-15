import { Box, Divider, Toolbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AHDrawer } from "../Assets/Components/Layout/AHDrawer";
import { AHAppBar } from "../Assets/Components/Layout/AHAppBar";
import { Arrowhead } from "../Database/Arrowhead";
import { GamertagSearch } from "./Subpage/GamertagSearch";

export function HomeView(props: { app: Arrowhead })
{
	//#region Props and Navigate
	const { app } = props;
	const navigate = useNavigate();
	//#endregion
	
	//#region State
	const [loggedInUser, setLoggedInUser] = useState(app.arrowheadUser);
 	const [gamertag, setGamertag] = useState("");
	const [mobileOpen, setMobileOpen] = useState(false);
	//#endregion

	/**
	 * On tab click, navigates to the right one
	 */
	const changeView = useCallback((url: string) => navigate(url), [navigate]);

	/** Controlled search component */
	function onGamertagTextChange(event: React.ChangeEvent<HTMLInputElement>)
	{
		setGamertag(event.target.value);
	};

	/** When the search button is pressed */
	function searchForGamertag()
	{
		if (gamertag === "") { return; }
		navigate(`service_record/${gamertag}`);
	}

	/** When enter is pressed */
	function searchForGamertagViaEnter(event: React.KeyboardEvent<HTMLDivElement>)
	{
		if (event.key === "Enter")
		{
			searchForGamertag();
		}
	};

	function handleDrawerToggle()
	{
		setMobileOpen(!mobileOpen);
	};

	const container = window !== undefined ? () => window.document.body : undefined;

	useEffect(() =>
	{
		console.log("Setting logged in user " + app.arrowheadUser?.user?.displayName);
		setLoggedInUser(app.arrowheadUser);
	}, [app, setLoggedInUser]);

	/** Logs out the current user */
	async function logout()
	{
		await app.Logout();
	}

	return (
		<Box sx={{ display: "flex", backgroundColor: "background.paper", height: "100vh" }}>
			<AHAppBar player={loggedInUser?.player} handleDrawerToggle={handleDrawerToggle} openAuth={changeView} />
			<AHDrawer loggedInUser={app.arrowheadUser} currentTab={-1} container={container} mobileOpen={mobileOpen} switchTab={changeView} handleDrawerToggle={handleDrawerToggle} onLogout={logout}/>
	  		<Box component="main" sx={{ flexGrow: 1, height: "100%" }}>
				<Toolbar />
				<Divider />
				<GamertagSearch search={gamertag} onValueChanged={onGamertagTextChange} onKeyPress={searchForGamertagViaEnter} onSearch={searchForGamertag} />
			</Box>
		</Box>
	);
}