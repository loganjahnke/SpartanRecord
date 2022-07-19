import { Box, Button, Divider, Toolbar } from "@mui/material";

import { ViewProps } from "./Props/ViewProps";
import { Helmet } from "react-helmet";
import { LabelValue } from "../Assets/Components/Common/LabelValue";
import { useCallback, useState } from "react";
import { Leaderboard } from "../Database/ArrowheadFirebase";
import { LeaderboardOutlined } from "@mui/icons-material";
import { Leader } from "../Objects/Model/Leader";
import { LeaderRanks } from "../Assets/Components/Ranks/LeaderRanks";

export function Admin(props: ViewProps)
{
	//#region Props and Navigate
	const { app, switchTab } = props;
	//#endregion
	
	//#region State
	const [leaderboardCategory, setLeaderboardCategory] = useState(Leaderboard.AssistsPerGame);
	const [leaders, setLeaders] = useState<Leader[]>([]);
	//#endregion

	//#region Callbacks
	const loadLeaderboard = useCallback(async () =>
	{
		setLeaders(await app.GetLeaderboard(leaderboardCategory));
	}, [leaderboardCategory, setLeaders]);

	const goToSR = useCallback((gamertag: string) =>
	{
		switchTab("service_record/" + gamertag);
	}, [switchTab]);
	//#endregion

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
				{process.env.NODE_ENV !== "production" && 
				<>
					<Box sx={{ display: "flex", mt: 2, ml: 2 }}>
						<Button variant="contained" startIcon={<LeaderboardOutlined />} onClick={loadLeaderboard}>Test Leaderboard (Assists / Game)</Button>
					</Box>
					<Box sx={{ mt: 2, ml: 2, width: "500px" }}>
						<LeaderRanks leaders={leaders} goToMember={goToSR} category={leaderboardCategory} />
					</Box>
					<Box sx={{ flexGrow: 1 }} />
				</>}
			</Box>
		</Box>
	);
}