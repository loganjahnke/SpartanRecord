import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box } from "@mui/material";
import { useState } from "react";
import { AHTextField } from "../Layout/AHTextField";

export function Signup(props: { open: boolean, closeHandler: any })
{
	const { open, closeHandler } = props;

	function acceptHandler()
	{
		console.log("Accept");
		closeHandler();
	}

	return (
		<Dialog open={open} onClose={closeHandler}>
			<DialogTitle>Signup</DialogTitle>
			<DialogContent>
				<DialogContentText sx={{ color: "primary.main" }}>
					Create an account to gain access to the following features:
					<ul>
						<li>Track your Halo Infinite statistics over time</li>
						<li>Create or join a spartan company</li>
						<li>Breakdown your service record by map, mode, and ranked</li>
					</ul>
				</DialogContentText>
				<Box>
					<TextField autoFocus required margin="dense" id="email" label="Email Address" type="email" fullWidth variant="standard" sx={{ color: "caption" }} />
					<TextField required margin="dense" id="gamertag" label="Gamertag" fullWidth variant="standard" />
					<TextField required margin="dense" id="password" label="Password" type="password" fullWidth variant="standard" />
					<TextField required margin="dense" id="confirm-password" label="Confirm Password" type="password" fullWidth variant="standard" />
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={closeHandler}>Cancel</Button>
				<Button onClick={acceptHandler}>Signup</Button>
			</DialogActions>
		</Dialog>
	);
}