import { Avatar, Box, Button, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, TextField, Toolbar, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ArrowheadError } from "../Objects/Helpers/ArrowheadError";
import { AuthViewProps } from "./Props/AuthViewProps";

import TimelineIcon from '@mui/icons-material/Timeline';
import MapIcon from '@mui/icons-material/Map';
import GroupsIcon from '@mui/icons-material/Groups';

export function AuthenticationView(props: AuthViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, afterAuth, registering } = props;
	const navigate = useNavigate();
	//#endregion
	
	//#region State
    const [dialogAlertMessages, setDialogAlertMessages] = useState<string[]>([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gamertag, setGamertag] = useState("");
    const [emailValidation, setEmailValidation] = useState("");
    const [passwordValidation, setPasswordValidation] = useState("");
    const [confirmPasswordValidation, setConfirmPasswordValidation] = useState("");
    const [gamertagValidation, setGamertagValidation] = useState("");
	//#endregion

    useEffect(() =>
	{
		const authToken = sessionStorage.getItem("Auth Token");
		const gamertag = sessionStorage.getItem("Gamertag");
		if (authToken && gamertag)
		{
			afterAuth(true);
		}
	}, []);

    /**
     * Callback for when the sign up button is pressed
     */
    const signInClicked = useCallback(async () =>
    {
        setLoadingMessage("Logging in");
        const result = await app.Login(email, password);
        setLoadingMessage("");

        if (result)
        {
            setDialogAlertMessages([result]);
        }
        else
        {
            afterAuth(true);
        }
    }, [app, navigate, email, password, setLoadingMessage, setDialogAlertMessages]);

    /**
     * Callback for when the sign up button is pressed
     */
    const signUpClicked = useCallback(async () =>
    {
        let isValid = true;
        let errors: string[] = [];

        // Is password good enough?
        errors = validatePassword(password);
        if (errors.length > 0)
        {
            isValid = false;
            setPasswordValidation(errors.join("\n"));
        }
        else 
        { 
            setPasswordValidation(""); 
        }

        // Do passwords match?
        if (password !== confirmPassword)
        {
            isValid = false;
            const e = "Passwords must match.";
            errors.push(e);
            setPasswordValidation(e);
            setConfirmPasswordValidation(e);
        }
        else
        {
            setPasswordValidation("");
            setConfirmPasswordValidation("");
        }

        if (isValid)
        {
            setLoadingMessage("Signing up");
            const regResult = await app.Register(email, password, gamertag);
            setLoadingMessage("");
            if (regResult) { setDialogAlertMessages([regResult]); }
            else
            {
                setLoadingMessage("Pulling statistics");
                const newResult = await app.db.ProcessMatchesForNewUser(gamertag);
                setLoadingMessage("");
                if (newResult) { setDialogAlertMessages([newResult]); }
                else
                {
                    afterAuth(true);
                }
            }

        }
        else { setDialogAlertMessages(errors); }
    }, [app, navigate, email, password, confirmPassword, gamertag, setPasswordValidation, setConfirmPasswordValidation, setLoadingMessage, setDialogAlertMessages]);

    /**
     * Changes the email
     * @param event 
     */
    function changeEmail(event: React.ChangeEvent<HTMLInputElement>)
    {
        setEmail(event.target.value);
    }

    /**
     * Changes the password
     * @param event 
     */
    function changePassword(event: React.ChangeEvent<HTMLInputElement>)
    {
        setPassword(event.target.value);
        if (!registering) { return; }

        // Is password good enough?
        const errors = validatePassword(event.target.value);
        if (errors.length > 0)
        {
            setPasswordValidation(errors.join("\n"));
        }
        else { setPasswordValidation(""); }
    }

    function validatePassword(password: string): string[] 
    {
        const errors: string[] = [];
        if (password.length < 8) 
        {
            errors.push("Your password must be at least 8 characters"); 
        }
        if (password.search(/[a-z]/i) < 0) 
        {
            errors.push("Your password must contain at least one letter.");
        }
        if (password.search(/[0-9]/) < 0) 
        {
            errors.push("Your password must contain at least one digit."); 
        }
        return errors;
    }

    /**
     * Changes the confirm password
     * @param event 
     */
    function changeConfirmPassword(event: React.ChangeEvent<HTMLInputElement>)
    {
        setConfirmPassword(event.target.value);
        if (password !== event.target.value)
        {
            setConfirmPasswordValidation("Passwords must match.");
        }
        else { setConfirmPasswordValidation(""); }
    }

    /**
     * Changes the gamertag
     * @param event 
     */
    function changeGamertag(event: React.ChangeEvent<HTMLInputElement>)
    {
        setGamertag(event.target.value);
    }

    /** Closes the dialog */
    function closeDialog()
    {
        setDialogAlertMessages([]);
    }

	return (
        <Box component="main" sx={{ flexGrow: 1, height: "100%" }}>
            <ArrowheadError.Dialog open={dialogAlertMessages.length > 0} handleClose={closeDialog} title="Something went wrong..." messages={dialogAlertMessages} />
            <Toolbar />
            <Divider />
            <Box sx={{ p: 2 }}>
                <Grid container spacing={4} sx={{ backgroundColor: "divider", pb: 10, borderRadius: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mt: 2, ml: 5 }}>
                            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>{registering ? "Create an account" : "Login"}</Typography>
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
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ mt: 2, ml: 2, mr: 3 }}>
                            <TextField label="Email" helperText={emailValidation} variant="standard" type="email" required fullWidth sx={{ mb: 2 }} value={email} onChange={changeEmail} />
                            <TextField label="Password" helperText={passwordValidation} error={!!passwordValidation} variant="standard" type="password" required fullWidth sx={{ mb: 2 }} value={password} onChange={changePassword} />
                            {registering ? <TextField label="Confirm Password" helperText={confirmPasswordValidation} error={!!confirmPasswordValidation} variant="standard" type="password" required fullWidth sx={{ mb: 2 }} value={confirmPassword} onChange={changeConfirmPassword} /> : undefined}
                            {registering ? <TextField label="Gamertag" helperText={gamertagValidation} variant="standard" required fullWidth value={gamertag} onChange={changeGamertag} /> : undefined}
                        </Box>
                    </Grid>
                </Grid>
                <Button sx={{ textAlign: "right", float: "right", mt: 5, mb: 5, mr: 5 }} variant="contained" onClick={registering ? signUpClicked : signInClicked}>{registering ? "Sign Up" : "Sign In"}</Button>
            </Box>
        </Box>
	);
}