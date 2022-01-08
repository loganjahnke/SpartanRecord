import { AppBar, Toolbar, IconButton, Divider, Typography, Box, Button } from "@mui/material";
import { Player } from "../../../Objects/Model/Player";

import MenuIcon from '@mui/icons-material/Menu';
import { Signup } from "../Authentication/Signup";
import { useState } from "react";

interface AHAppBarProps
{
	/** The logged in player */
	player?: Player;
	/** Callback for when the drawer is opened or closed */
	handleDrawerToggle?: any;
}

export function AHAppBar(props: AHAppBarProps)
{
	const { player, handleDrawerToggle } = props;
	const [signup, setSignup] = useState(false);

	function closeDialog()
	{
		setSignup(false);
	}

	function openSignUp()
	{
		setSignup(true);
	}

	return (
		<AppBar position="fixed" sx={{ width: { sm: `calc(100% - 240px)` }, ml: { sm: `240px` }}}>
			<Signup open={signup} closeHandler={closeDialog} />
			<Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
				<IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
					<MenuIcon />
				</IconButton>
				<Divider orientation="vertical" flexItem sx={{ display: { sm: "none" }}} />
					{player ? (
						<Box sx={{ flexGrow: 1, textAlign: "right", display: "flex", alignItems: "center" }}>
							<Typography variant="body1" sx={{ textAlign: "right", p: 2 }}>{player.gamertag}</Typography>
							<img src={player.appearance.emblemURL} alt="emblem" height="32px" />
						</Box>
					) : (
						<Box sx={{ flexGrow: 1, textAlign: "right", display: "flex", alignItems: "center" }}>
							<Typography variant="subtitle1" sx={{ textAlign: "right" }}>Select a gamertag from the Member List</Typography>
							{/* <Button variant="text" sx={{ mr: 1 }}>Log In</Button>
							<Button variant="text" onClick={openSignUp}>Signup</Button> */}
						</Box>
						)
					}
			</Toolbar>
		</AppBar>
	);
}