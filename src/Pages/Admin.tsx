import { Box, Button, Divider, FormControlLabel, Link, Switch, Toolbar, Typography } from "@mui/material";

import { ViewProps } from "./Props/ViewProps";
import { Helmet } from "react-helmet";
import { LabelValue } from "../Assets/Components/Common/LabelValue";
import { useCallback } from "react";

export function Admin(props: ViewProps)
{
	//#region Props and Navigate
	const { app, updatePlayer, switchTab, setLoadingMessage } = props;
	//#endregion
	
	//#region State
	
	//#endregion

	const setProgress = useCallback((percent: number) =>
	{
		setLoadingMessage((percent * 100).toLocaleString() + "%");
	}, [setLoadingMessage]);
	
	const loadLeaderboard = useCallback(async () =>
	{
		await app.SetLeaderboard(setProgress);
		setLoadingMessage("");
	}, [app, setProgress]);

	return (
		<Box component="main" sx={{ flexGrow: 1, height: "calc(100% - 32px)" }}>
			<Helmet>
				<title>{`Spartan Record | Admin`}</title>
				<meta name="description" content={`Halo Infinite statistics such as KDA, KDR, and more`} />
				<meta property="og:title" content="Spartan Record | Admin" />
				<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/admin`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<Box sx={{ backgroundColor: "secondary.main", height: "100%", display: "flex", flexDirection: "column" }}>
				<Box sx={{ display: "flex", mt: 2 }}>
					<LabelValue label="Database URL" value={app.app.options.databaseURL} />
					<LabelValue label="HaloDotAPI Version" value={process.env.REACT_APP_HALO_API_VERSION} />
					<LabelValue label="Website Version" value={process.env.REACT_APP_VERSION} />
				</Box>
				<Box sx={{ flexGrow: 1 }} />
				{/* <Button onClick={loadLeaderboard}>Load Leaderboard</Button> */}
			</Box>
		</Box>
	);
}