import { AppBar, Toolbar, IconButton, Typography, CircularProgress, Box } from "@mui/material";

import MenuIcon from '@mui/icons-material/Menu';
import { Player } from "../../../Objects/Model/Player";
import { PlayerCard } from "../Cards/PlayerCard";

interface AHAppBarProps
{
	/** Callback for when the drawer is opened or closed */
	handleDrawerToggle?: any;
	/** Is someone doing a load in the background? */
	loadingFromAutocode?: number;
	/** The player */
	player?: Player;
}

export function AHAppBar(props: AHAppBarProps)
{
	const { handleDrawerToggle, loadingFromAutocode, player } = props;

	return (
		<AppBar position="fixed" sx={{ width: { sm: `calc(100% - 240px)` }, ml: { sm: `240px` }}}>
			<Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
				<IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ display: { sm: "none" } }}>
					<MenuIcon />
				</IconButton>
				{loadingFromAutocode && 
				<>
					<CircularProgress size={20} variant={loadingFromAutocode === -1 ? "indeterminate" : "determinate"} value={loadingFromAutocode} />
					<Typography sx={{ ml: 2 }} variant="subtitle1">Getting latest data from HaloDotAPI for {player?.gamertag}</Typography>
				</>}
				<Box sx={{ flexGrow: 1, ml: 1, mr: 1 }}></Box>
				<Box sx={{ display: { xs: "none", sm: "block" }}}>
					{player && <PlayerCard player={player} showNameplate />}
				</Box>
				<Box sx={{ display: { sm: "none" }}}>
					{!loadingFromAutocode && player && <PlayerCard player={player} rightAlign />}
				</Box>
			</Toolbar>
		</AppBar>
	);
}