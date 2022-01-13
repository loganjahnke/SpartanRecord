import { Avatar, Box, Button, Divider, List, ListItem, ListItemAvatar, ListItemText, TextField, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AHDrawer } from "../Assets/Components/Layout/AHDrawer";
import { AHAppBar } from "../Assets/Components/Layout/AHAppBar";
import { Arrowhead } from "../Database/Arrowhead";

import GroupsIcon from '@mui/icons-material/Groups';
import TimelineIcon from '@mui/icons-material/Timeline';
import MapIcon from '@mui/icons-material/Map';

export function HomeView(props: { app: Arrowhead })
{
	//#region Props and Navigate
	const { app } = props;
	const navigate = useNavigate();
	//#endregion
	
	//#region State
	const [loggedInUser, setLoggedInUser] = useState(app.arrowheadUser);
 	const [gamertag, setGamertag] = useState("");
	const [spartanCompany, setSpartanCompany] = useState("");
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

	/** Controlled search component */
	function onSpartanCompanyTextChange(event: React.ChangeEvent<HTMLInputElement>)
	{
		setSpartanCompany(event.target.value);
	};

	/** When the search button is pressed */
	function searchForGamertag()
	{
		if (gamertag === "") { return; }
		navigate(`service_record/${gamertag}`);
	}

	/** When the search button is pressed */
	function searchForSpartanCompany()
	{
		if (spartanCompany === "") { return; }
		navigate(`company/${spartanCompany}`);
	}

	/** When enter is pressed */
	function searchForGamertagViaEnter(event: React.KeyboardEvent<HTMLDivElement>)
	{
		if (event.key === "Enter")
		{
			searchForGamertag();
		}
	}

	/** When enter is pressed */
	function searchForCompanyViaEnter(event: React.KeyboardEvent<HTMLDivElement>)
	{
		if (event.key === "Enter")
		{
			searchForSpartanCompany();
		}
	}

	function handleDrawerToggle()
	{
		setMobileOpen(!mobileOpen);
	};

	const container = window !== undefined ? () => window.document.body : undefined;

	useEffect(() =>
	{
		console.log("UseEffect was called");
		setLoggedInUser(app.arrowheadUser);
	}, [app, setLoggedInUser]);

	/** Logs out the current user */
	async function logout()
	{
		await app.Logout();
	}

	return (
		<Box sx={{ display: "flex", backgroundColor: "background.paper" }}>
			<AHAppBar player={loggedInUser?.player} handleDrawerToggle={handleDrawerToggle} openAuth={changeView} />
			<AHDrawer loggedInUser={app.arrowheadUser} currentTab={0} container={container} mobileOpen={mobileOpen} switchTab={changeView} handleDrawerToggle={handleDrawerToggle} onLogout={logout}/>
	  		<Box component="main" sx={{ flexGrow: 1 }}>
				<Toolbar />
				<Divider />
				<Box sx={{ p: 2, pl: 8, pt: 8, backgroundColor: "divider", pb: 8 }}>
					<Typography variant="h3">Halo Infinite Service Record</Typography>
					<Typography variant="h6">Search for a gamertag to see Halo Infinite statistics such as KDA, KDR, and more</Typography>
					<Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
						<TextField label="Gamertag" variant="outlined" size="small" sx={{ width: "50%" }} value={gamertag} onChange={onGamertagTextChange} onKeyPress={searchForGamertagViaEnter} />
						<Button variant="contained" sx={{ ml: 2 }} onClick={searchForGamertag}>Search</Button>
					</Box>
				</Box>
				<Box sx={{ p: 2, pl: 8, pt: 8, backgroundColor: "secondary.main", pb: 8 }}>
					{loggedInUser?.user ? <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>Welcome <span className="skinny">{loggedInUser?.user.displayName}</span></Typography>
					: <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>Get extra features <span className="skinny">by creating an account</span></Typography>}
					<List>
						<ListItem>
							<ListItemAvatar>
								<Avatar><TimelineIcon /></Avatar>
							</ListItemAvatar>
							<ListItemText primary="Track your service record over time." />
						</ListItem>
						<ListItem>
							<ListItemAvatar>
								<Avatar><MapIcon /></Avatar>
							</ListItemAvatar>
							<ListItemText primary="Filter your service record by map, mode, match outcome, and ranked." />
						</ListItem>
						<ListItem>
							<ListItemAvatar>
								<Avatar><GroupsIcon /></Avatar>
							</ListItemAvatar>
							<ListItemText primary="Join or create a Spartan Company and compare your stats." />
						</ListItem>
					</List>
				</Box>
				<Box sx={{ p: 2, pr: 8, pt: 8, backgroundColor: "divider", pb: 8, textAlign: "right" }}>
					<Typography variant="h3">Halo Infinite Spartan Company</Typography>
					<Typography variant="h6">Search for a spartan company to see Halo Infinite statistics for a group of spartans</Typography>
					<Box sx={{ display: "flex", alignItems: "center", mt: 3, justifyContent: "flex-end" }}>
						<TextField label="Spartan Company" variant="outlined" size="small" sx={{ width: "50%" }} value={spartanCompany} onChange={onSpartanCompanyTextChange} onKeyPress={searchForCompanyViaEnter} />
						<Button variant="contained" sx={{ ml: 2 }} onClick={searchForSpartanCompany}>Search</Button>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}