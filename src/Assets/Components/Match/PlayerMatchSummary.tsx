import { Box, Card, CardActionArea, CardContent, CardMedia, Chip, Grid, Menu, MenuItem, Snackbar, Typography } from "@mui/material";
import { useState } from "react";
import { PlayerMatch } from "../../../Objects/Model/PlayerMatch";
import { MatchPlayer } from "../../../Objects/Pieces/MatchPlayer";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { MatchBreakdown } from "../Breakdowns/Templates/MatchBreakdown";
import { CSRSProgression } from "../Custom/CSRSTooltip";

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import "../../Styles/Components/PlayerMatchSummary.css";
import { LeftvsRight } from "../Breakdowns/Templates/LeftvsRight";
import { MatchMode } from "./Mode/MatchMode";
import { GenericMode } from "./Mode/GenericMode";
import { OutcomeChip } from "./OutcomeChip";
import { MedalsMode, PlayerMatchSummaryDetails } from "./PlayerMatchSummaryDetails";

interface MatchSummaryProps
{
	match: PlayerMatch;
	player?: MatchPlayer;
	goToMatch: Function;
	gamertag: string;
	showExpanded?: boolean;
	hideExpected?: boolean;
}

export function PlayerMatchSummary(props: MatchSummaryProps)
{
	const { match, player, goToMatch, gamertag, showExpanded, hideExpected } = props;

	const [contextMenu, setContextMenu] = useState<{mouseX: number; mouseY: number;} | null>(null);
	const [snacking, setSnacking] = useState(false);

	function onCardAreaClick()
	{
		goToMatch(match.id);
	}

	const handleContextMenu = (event: React.MouseEvent) => {
		event.preventDefault();
		setContextMenu(
		  contextMenu === null
			? {
				mouseX: event.clientX + 2,
				mouseY: event.clientY - 6,
			  }
			: // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
			  // Other native context menus might behave different.
			  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
			  null,
		);
	};

	const closeSnackbar = () => setSnacking(false);
	const closeContextMenu = () => setContextMenu(null);

	/** Copy the match ID to the clipboard */
	const copyMatchID = () => 
	{
		navigator.clipboard.writeText(match!.id);
		setSnacking(true);
		closeContextMenu();
	}

	/** Open in Leaf */
	const openInLeafApp = () =>
	{
		closeContextMenu();
		window.open("https://leafapp.co/game/" + match!.id, "_blank");
	};

	/** Open in Halo South Africa */
	const openInHaloSouthAfrica = () =>
	{
		closeContextMenu();
		window.open(`https://halosa.co.za/match/${match!.id}`, "_blank");
	};

	/** Open in HDH */
	const openInHaloDataHive = () =>
	{
		closeContextMenu();
		window.open(`https://halodatahive.com/Infinite/Match/${match!.id}?gamertag=${gamertag}&page=0`, "_blank");
	};

	/** Open in HaloWaypoint */
	const openInHaloWaypoint = () =>
	{
		closeContextMenu();
		window.open(`https://www.halowaypoint.com/halo-infinite/players/${gamertag}/matches/${match!.id}`, "_blank");
	};

	/** Share the match link on Twitter */
	const shareWithTwitter = () =>
	{
		closeContextMenu();

		// Opens a pop-up with twitter sharing dialog
		var shareURL = "http://twitter.com/share?"; //url base

		//params
		var params = {
			url: `https://spartanrecord.com/match/${match!.id}/${gamertag}\n\n`,
			text: `${gamertag} - ${match!.variant.name} on ${match!.map.name}\n\n`,
			hashtags: "Halo,SpartanRecord,HaloDotAPI"
		}

		for (const param in params) { shareURL += "&" + param + "=" + encodeURIComponent((params as any)[param]); }
		window.open(shareURL, "_blank", "left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0");
	};

	return (
		<Grid item xs={12} md={6} lg={4} xl={3}>
			<Card>
				<CardActionArea onClick={onCardAreaClick} onContextMenu={handleContextMenu}>
					<CardMedia component="img" height="200" image={match.map.asset.thumbnail} alt={match.map.name} title={match.map.name} />
					<CardContent>
						<Box sx={{ backgroundColor: ArrowheadTheme.card, width: "100%", ml: "-16px", padding: "8px 16px 0px 16px", mt: -2, mb: -1 }}>
							<Typography variant="h5" component="div" sx={{ textAlign: "center", fontWeight: 700 }}>{match.playlist.name}</Typography>
							<Typography variant="h6" component="div" sx={{ textAlign: "center" }}>{match.variant.name.indexOf(":") !== -1 ? match.variant.name.substring(match.variant.name.indexOf(":") + 1) : match.variant.name}</Typography>
							<Typography variant="h6" component="div" sx={{ textAlign: "center", fontSize: "0.8rem !important" }}>{match.map.name}</Typography>
						</Box>
					</CardContent>
				</CardActionArea>
				<PlayerMatchSummaryDetails player={match?.player} isRanked={match?.playlist?.ranked} medalsMode={MedalsMode.top3} />
				<Box sx={{ backgroundColor: ArrowheadTheme.card, width: "100%", padding: "8px" }}>
					{match.odds > 0 && <Typography variant="caption" component="div" sx={{ textAlign: "center", color: "#AAAAAA", fontSize: "0.6rem", textTransform: "uppercase" }}>Experience Odds: <Typography variant="subtitle1" component="span" sx={{ fontSize: "0.6rem" }}>{match.odds}%</Typography></Typography>}
					<Typography variant="caption" component="div" sx={{ textAlign: "center", color: "#AAAAAA", fontSize: "0.6rem", textTransform: "uppercase" }}>Match Duration: <Typography variant="subtitle1" component="span" sx={{ fontSize: "0.6rem", textTransform: "none" }}>{match.duration.readable()}</Typography></Typography>
					<Typography variant="caption" component="div" sx={{ textAlign: "center", color: "#AAAAAA", fontSize: "0.6rem", textTransform: "uppercase" }}>Match Date: <Typography variant="subtitle1" component="span" sx={{ fontSize: "0.6rem", textTransform: "none" }}>{match.date.toLocaleString()}</Typography></Typography>
				</Box>
			</Card>
			<Menu
				open={contextMenu !== null}
				onClose={() => setContextMenu(null)}
				anchorReference="anchorPosition"
				anchorPosition={
				contextMenu !== null
					? { top: contextMenu.mouseY, left: contextMenu.mouseX }
					: undefined
				}
			>
				<MenuItem onClick={shareWithTwitter}>Share on Twitter</MenuItem>
				<MenuItem onClick={copyMatchID}>Copy Match ID</MenuItem>
				<MenuItem onClick={openInLeafApp}>Open in leafapp.co</MenuItem>
				<MenuItem onClick={openInHaloDataHive}>Open in HaloDataHive.com</MenuItem>
				<MenuItem onClick={openInHaloSouthAfrica}>Open in Halo South Africa</MenuItem>
				<MenuItem onClick={openInHaloWaypoint}>Open in HaloWaypoint</MenuItem>
			</Menu>
			<Snackbar
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				open={snacking}
				onClose={closeSnackbar}
				message="Copied Match ID"
				autoHideDuration={3000}
			/>
		</Grid>
	);
}