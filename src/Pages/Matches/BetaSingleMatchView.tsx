import { Box, Divider, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, Toolbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { TeamResultBreakdown } from "../../Assets/Components/Breakdowns/TeamResultBreakdown";
import { ImageCard } from "../../Assets/Components/Cards/ImageCard";
import { SRTabs } from "../../Assets/Components/Layout/AHDrawer";
import { AccuracyMatchRanks } from "../../Assets/Components/Ranks/AccuracyRanks";
import { DamageMatchRanks } from "../../Assets/Components/Ranks/DamageRanks";
import { KDAMatchRanks } from "../../Assets/Components/Ranks/KDARanks";
import { TopSpreeRanks } from "../../Assets/Components/Ranks/TopSpreeRanks";

import { TwoTeamsMatch } from "../../Assets/Components/Match/TwoTeamsMatch";
import { Match } from "../../Objects/Model/Match";
import { MatchPlayer } from "../../Objects/Pieces/MatchPlayer";
import { Team } from "../../Objects/Pieces/Team";
import { ViewProps } from "../Props/ViewProps";
import { TeamTable } from "../Subpage/TeamTable";

import "../../Assets/Styles/Views/SingleMatch.css";
import { MatchTitleCard } from "../../Assets/Components/Match/MatchTitleCard";
import { MultiTeamsMatch } from "../../Assets/Components/Match/MultiTeamMatch";
import { FFAMatch } from "../../Assets/Components/Match/FFAMatch";

export function BetaSingleMatchView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, updatePlayer: setGamertag, switchTab } = props;
	const { id, gamertag } = useParams();
	//#endregion
	
	//#region State
    const [match, setMatch] = useState<Match | undefined>(new Match());
	const [players, setPlayers] = useState<MatchPlayer[]>([]);
	const [snacking, setSnacking] = useState(false);
	const [menu, setMenu] = useState(-1);
	//#endregion

	const loadData = useCallback(async () => 
	{
		if (!id) { return; }
		
		// Set loading message
		setLoadingMessage("Loading match");
		if (gamertag) { setGamertag(gamertag); }
		
		// Get the match
		const match = await app.GetMatch(id);
		setMatch(match);

		if (!match) { return; }
		setPlayers(match.players && match.players.length > 0 ? match.players : match.teams.reduce((prev, curr) => 
		{
			if (prev)
			{
				prev.players.concat(curr.players);
				return prev;
			}
			else
			{
				return curr;
			}
		}).players);

		// Switch tab, show loading message
		switchTab(undefined, SRTabs.None);
		setLoadingMessage("");

	}, [app, setMatch, setPlayers, setGamertag, gamertag, switchTab, id, setLoadingMessage]);
	
	useEffect(() =>
	{
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	/**
	 * Navigates the service record for the gamertag
	 * @param gamertag the gamertag
	 */
	function onGamertagClick(tag: string): void
	{
		if (!tag) { return; }
		switchTab("/service_record/" + tag, SRTabs.ServiceRecord);
	}

	const onOptionChanged = (event: SelectChangeEvent<HTMLElement>) =>
	{
		if (!match) { return; }
		if (+event.target.value === 0)
		{
			shareWithTwitter();
		}
		else if (+event.target.value === 1)
		{
			copyMatchID();
		}
		else if (+event.target.value === 2)
		{
			openInLeafApp();
		}
		else if (+event.target.value === 3)
		{
			openInHaloDataHive();
		}
		else if (+event.target.value === 4)
		{
			openInHaloSouthAfrica();
		}

		setMenu(-1);
	};

	const closeSnackbar = () => setSnacking(false);

	/** Copy the match ID to the clipboard */
	const copyMatchID = () => 
	{
		navigator.clipboard.writeText(match!.id);
		setSnacking(true);
	}

	/** Open in Leaf */
	const openInLeafApp = () =>
	{
		window.open("https://leafapp.co/game/" + match!.id, "_blank");
	};

	/** Open in Halo South Africa */
	const openInHaloSouthAfrica = () =>
	{
		window.open(`https://halosa.co.za/match/${match!.id}`, "_blank");
	};

	/** Open in HDH */
	const openInHaloDataHive = () =>
	{
		window.open(`https://halodatahive.com/Infinite/Match/${match!.id}?gamertag=${gamertag}&page=0`, "_blank");
	};

	/** Share the match link on Twitter */
	const shareWithTwitter = () =>
	{
		// Opens a pop-up with twitter sharing dialog
		var shareURL = "http://twitter.com/share?"; //url base

		//params
		var params = {
			url: `https://spartanrecord.com/match/${match!.id}/${gamertag}\n\n`,
			text: `${gamertag} - ${match!.mode.name} on ${match!.map.name}\n\n`,
			hashtags: "Halo,SpartanRecord,HaloDotAPI"
		}

		for (const param in params) { shareURL += "&" + param + "=" + encodeURIComponent((params as any)[param]); }
		window.open(shareURL, "_blank", "left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0");
	};

	return (
		<Box component="main" sx={{ flexGrow: 1, width: "100%" }}>
			<Helmet>
				<title>{`Spartan Record | ${match!.mode.name} on ${match!.map.name}`}</title>
				<meta name="description" content={`${gamertag} - ${match!.mode.name} on ${match!.map.name}`} />
				<meta property="og:title" content="Spartan Record" />
				<meta property="og:image" content={match?.map?.asset.thumbnail} />
				<link rel="canonical" href={`https://spartanrecord.com/beta/match/${match?.id}/${gamertag}`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<Box sx={{ p: 2 }}>
				{/* Description of the game (map, mode, playlist) */}
				<Grid container spacing={2} sx={{ alignItems: "flex-start", justifyContent: "flex-start" }}>
					{/* Top */}
					<Grid item xs={12}>
						<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
							<Box sx={{ flexGrow: 1 }}></Box>
							<FormControl sx={{ width: "150px" }}>
								<InputLabel id="additional-options-select-label"></InputLabel>
								<Select
									labelId="additional-options-select-label"
									id="additional-options-select"
									label=""
									value={menu as any}
									onChange={onOptionChanged}
								>
									<MenuItem disabled value={-1}>Options</MenuItem>
									<MenuItem value={0}>Share on Twitter</MenuItem>
									<MenuItem value={1}>Copy Match ID</MenuItem>
									<MenuItem value={2}>Open in leafapp.co</MenuItem>
									<MenuItem value={3}>Open in HaloDataHive.com</MenuItem>
									<MenuItem value={4}>Open in Halo South Africa</MenuItem>
								</Select>
								</FormControl>
						</Box>
					</Grid>
					{match && match.teams.length === 2 && <TwoTeamsMatch match={match} myGamertag={gamertag} onGamertagClick={onGamertagClick} />} {/* 8e55d32a-3f23-445e-9e9b-07e14c01f7bc */}
					{match && match.teams.length > 2 && <MultiTeamsMatch match={match} myGamertag={gamertag} onGamertagClick={onGamertagClick} />} {/* de9ff755-17bd-4e14-a0c2-668f3bda4fe2 */}
					{match && !match.teamGame && <FFAMatch app={app} match={match} myGamertag={gamertag} onGamertagClick={onGamertagClick} />}     {/* 05a68b81-8b14-489b-82e4-4a57df911334 */}
					<Grid container item spacing={2} xs={12}>
						<Grid item xs={12} md={6} xl={3}>
							<KDAMatchRanks players={players} myGamertag={gamertag} goToMember={onGamertagClick} />
						</Grid>
						<Grid item xs={12} md={6} xl={3}>
							<AccuracyMatchRanks players={players} myGamertag={gamertag} goToMember={onGamertagClick} />
						</Grid>
						<Grid item xs={12} md={6} xl={3}>
							<DamageMatchRanks players={players} myGamertag={gamertag} goToMember={onGamertagClick} />
						</Grid>
						<Grid item xs={12} md={6} xl={3}>
							<TopSpreeRanks players={players} myGamertag={gamertag} goToMember={onGamertagClick} />
						</Grid>
					</Grid>
				</Grid>
			</Box>
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				open={snacking}
				onClose={closeSnackbar}
				message="Copied Match ID"
				autoHideDuration={3000}
			/>
		</Box>
	);
}