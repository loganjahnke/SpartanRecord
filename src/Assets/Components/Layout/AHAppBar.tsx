import { AppBar, Toolbar, IconButton, Typography, CircularProgress, Box } from "@mui/material";

import MenuIcon from '@mui/icons-material/Menu';
import { Player } from "../../../Objects/Model/Player";
import { PlayerCard } from "../Cards/PlayerCard";
import { SR } from "../../../Objects/Helpers/Statics/SR";
import { HaloDotAPIIcon } from "../../Icons/CustomIcons";

interface AHAppBarProps
{
	/** Callback for when the drawer is opened or closed */
	handleDrawerToggle?: any;
	/** Is someone doing a load in the background? */
	backgroundLoadingMessage?: string;
	/** The player */
	player?: Player;
}

export function AHAppBar(props: AHAppBarProps)
{
	const { handleDrawerToggle, backgroundLoadingMessage, player } = props;

	return (
		<AppBar position="fixed" sx={{ width: { sm: `calc(100% - 240px)` }, ml: { sm: `240px` }}}>
			<Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
				<IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ display: { sm: "none" } }}>
					<MenuIcon />
				</IconButton>
				{backgroundLoadingMessage && 
				<>
					<CircularProgress size={20} variant={"indeterminate"} value={-1} />
					{backgroundLoadingMessage === SR.DefaultLoading
						? <>
							<Typography sx={{ ml: 2 }} variant="subtitle1">Getting latest data from</Typography>
							<Box sx={{pl: 1}} />
							<img src="https://halo.public.files.stdlib.com/static/halodotapi.png" height="24px" title="HaloDotAPI" alt="HaloDotAPI" />
							{player && <Typography sx={{ ml: 1 }} variant="subtitle1">for {player.gamertag}</Typography>}
						</>
						: <Typography sx={{ ml: 2 }} variant="subtitle1">{backgroundLoadingMessage}</Typography>
					}
				</>}
				<Box sx={{ flexGrow: 1, ml: 1, mr: 1 }}></Box>
				<Box sx={{ display: { xs: "none", sm: "block" }}}>
					{player && <PlayerCard player={player} showNameplate />}
				</Box>
				<Box sx={{ display: { sm: "none" }}}>
					{!backgroundLoadingMessage && player && <PlayerCard player={player} rightAlign />}
				</Box>
			</Toolbar>
		</AppBar>
	);
}