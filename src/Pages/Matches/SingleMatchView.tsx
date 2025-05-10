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

import { Match } from "../../Objects/Model/Match";
import { MatchPlayer } from "../../Objects/Pieces/MatchPlayer";
import { Team } from "../../Objects/Pieces/Team";
import { ViewProps } from "../Props/ViewProps";
import { TeamTable } from "../Subpage/TeamTable";
import { Debugger } from "../../Objects/Helpers/Debugger";

export function SingleMatchView(props: ViewProps)
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
		Debugger.LoadView("SingleMatchView");
		
		// Get player's service record
		if (id)
		{
            setLoadingMessage("Loading match");
			if (gamertag) { setGamertag(gamertag); }
			const match = await app.GetMatch(id);
            setMatch(match);

			if (match)
			{
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
			}
		}

		switchTab(undefined, SRTabs.Matches)
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
		if (tag)
		{
			switchTab("/service_record/" + tag, SRTabs.ServiceRecord);
		}
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
				<link rel="canonical" href={`https://spartanrecord.com/match/${match?.id}/${gamertag}`} />
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
					<Grid container item spacing={2} xs={12} xl={4}>
						<Grid item xs={12}>
							<ImageCard image={match?.map?.asset.thumbnail} 
								titles={[match?.map?.name || "", match?.mode?.name || "", match?.playlist?.name || match?.type || ""]} 
								headers={["Map", "Variant", "Playlist"]} />
						</Grid>
						<Grid item xs={12}>
							<KDAMatchRanks players={players} myGamertag={gamertag} goToMember={onGamertagClick} />
						</Grid>
						<Grid item xs={12}>
							<AccuracyMatchRanks players={players} myGamertag={gamertag} goToMember={onGamertagClick} />
						</Grid>
						<Grid item xs={12}>
							<DamageMatchRanks players={players} myGamertag={gamertag} goToMember={onGamertagClick} />
						</Grid>
						<Grid item xs={12}>
							<TopSpreeRanks players={players} myGamertag={gamertag} goToMember={onGamertagClick} />
						</Grid>
					</Grid>
					<Grid container item spacing={2} xs={12} xl={8}>
						{match?.teams && match.teams.length > 0 
								? match?.teams?.map(team => (
									<>
										<Grid item xs={12}>
											<TeamResultBreakdown team={team} />
										</Grid>
										<Grid item xs={12}>
											<TeamTable team={team} match={match} onGamertagClick={onGamertagClick} selectedGamertag={gamertag} />
										</Grid>
									</>
								))
								: match?.players && match.players.length > 0 && (
									<Grid item xs={12}>
										<TeamTable team={new Team(undefined, undefined, match.players)} match={match} onGamertagClick={onGamertagClick} selectedGamertag={gamertag} ffa />
									</Grid>
							)}
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