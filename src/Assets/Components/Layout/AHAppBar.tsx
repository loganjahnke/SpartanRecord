import { AppBar, Toolbar, IconButton, Typography, CircularProgress, Box } from "@mui/material";

import MenuIcon from '@mui/icons-material/Menu';
import { Player } from "../../../Objects/Model/Player";
import { DynamicPlayerCard } from "../PlayerAppearance/PlayerCard";
import { SR } from "../../../Objects/Helpers/Statics/SR";
import { useCallback, useEffect, useState } from "react";
import { Cookie } from "../../../Objects/Helpers/Cookie";

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

	const [favorite, setFavorite] = useState(false);

	const onFavorite = useCallback((gamertag: string) =>
	{
		if (favorite) 
		{ 
			Cookie.removeFavorite(gamertag); 
			setFavorite(false);
		}
		else 
		{ 
			Cookie.addFavorite(gamertag); 
			setFavorite(true);
		}
	}, [favorite]);

	useEffect(() =>
	{
		if (!player) { return; }
		setFavorite(Cookie.isFavorite(player.gamertag));
	}, [player]);

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
							<img src="https://grunt.api.dotapi.gg/games/halo-infinite/tooling/cms-images?hash=eyJpZGVudGlmaWVyIjoiaGkiLCJwYXRoIjoicHJvZ3Jlc3Npb24vTWFudWZhY3R1cmVycy8zNDMucG5nIiwib3B0aW9ucyI6e319" height="36px" title="HaloDotAPI" alt="HaloDotAPI" />
							{player && <Typography sx={{ ml: 1 }} variant="subtitle1">for {player.gamertag}</Typography>}
						</>
						: <Typography sx={{ ml: 2 }} variant="subtitle1">{backgroundLoadingMessage}</Typography>
					}
				</>}
				<Box sx={{ flexGrow: 1, ml: 1, mr: 1 }}></Box>
				<DynamicPlayerCard player={player} loading={!!backgroundLoadingMessage} onFavorite={onFavorite} isFavorite={favorite} rightAlign />
			</Toolbar>
		</AppBar>
	);
}