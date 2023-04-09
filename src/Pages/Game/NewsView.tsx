import { Box, Divider, Link, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

import { ViewProps } from "../Props/ViewProps";
import { SRTabs } from "../../Assets/Components/Layout/AHDrawer";
import { Player } from "../../Objects/Model/Player";
import { Cookie } from "../../Objects/Helpers/Cookie";
import { Helmet } from "react-helmet";
import { GamertagSearch } from "../../Assets/Components/ServiceRecord/GamertagSearch";
import { Grow } from "../../Assets/Components/Common/Grow";

export function NewsView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, updatePlayer, switchTab } = props;
	//#endregion
	
	//#region State
 	const [localGamertag, setLocalGamertag] = useState("");
	const [recentPlayers, setRecentPlayers] = useState<Player[]>(Cookie.getRecents().map(gamertag => new Player(gamertag)));
	const [favoritePlayers, setFavoritePlayers] = useState<Player[]>([]);
	//#endregion

	useEffect(() =>
	{
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	return (
		<Box component="main" sx={{ flexGrow: 1, height: "calc(100% - 32px)" }}>
			<Helmet>
				<title>{`Spartan Record | News`}</title>
				<meta name="description" content={`Halo Infinite statistics such as KDA, KDR, and more`} />
				<meta property="og:title" content="Spartan Record" />
				<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<Box sx={{ backgroundColor: "secondary.main", height: "100%", display: "flex", flexDirection: "column" }}>
				<Grow />
				<Grow />
			</Box>
		</Box>
	);
}