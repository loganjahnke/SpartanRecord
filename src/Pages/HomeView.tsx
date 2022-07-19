import { Box, Divider, Link, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { ViewProps } from "./Props/ViewProps";
import { SRTabs } from "../Assets/Components/Layout/AHDrawer";
import { Player } from "../Objects/Model/Player";
import { Cookie } from "../Objects/Helpers/Cookie";
import { Helmet } from "react-helmet";
import { GamertagSearch } from "../Assets/Components/ServiceRecord/GamertagSearch";

export function HomeView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, updatePlayer, switchTab } = props;
	//#endregion
	
	//#region State
 	const [localGamertag, setLocalGamertag] = useState("");
	const [recentPlayers, setRecentPlayers] = useState<Player[]>(Cookie.getRecents().map(gamertag => new Player(gamertag)));
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

	/** When the search button is pressed */
	function openRecent(gamertag: string)
	{
		updatePlayer(localGamertag);
		switchTab(`service_record/${gamertag}`, SRTabs.ServiceRecord);
	}

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

	useEffect(() =>
	{
		loadRecentPlayers();
		document.title = "Spartan Record";
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	return (
		<Box component="main" sx={{ flexGrow: 1, height: "calc(100% - 32px)" }}>
			<Helmet>
				<title>{`Spartan Record`}</title>
				<meta name="description" content={`Halo Infinite statistics such as KDA, KDR, and more`} />
				<meta property="og:title" content="Spartan Record" />
				<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<Box sx={{ backgroundColor: "secondary.main", height: "100%", display: "flex", flexDirection: "column" }}>
				<Box sx={{ flexGrow: 1 }} />
				<GamertagSearch search={localGamertag} openRecent={openRecent} onValueChanged={onGamertagTextChange} onKeyPress={searchForGamertagViaEnter} onSearch={searchForGamertag} recentPlayers={recentPlayers} />
				<Box sx={{ flexGrow: 1 }} />
				<Box sx={{ backgroundColor: "secondary.main", textAlign: "center", mt: 18 }}>
					<Typography variant="subtitle1" sx={{ textAlign: "center" }}>Powered by <Link sx={{ cursor: "pointer" }} onClick={() => switchTab("/powered_by_halodotapi")}>HaloDotAPI</Link> v{process.env.REACT_APP_HALO_API_VERSION} | Spartan Record v{process.env.REACT_APP_VERSION}</Typography>
				</Box>

			</Box>
		</Box>
	);
}