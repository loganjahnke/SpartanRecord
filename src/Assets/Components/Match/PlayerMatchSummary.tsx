import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Menu, MenuItem, Snackbar, Typography } from "@mui/material";
import { useState } from "react";
import { PlayerMatch } from "../../../Objects/Model/PlayerMatch";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { MatchBreakdown } from "../Breakdowns/Templates/MatchBreakdown";
import { CSRSProgression } from "../Custom/CSRSTooltip";

interface MatchSummaryProps
{
	match: PlayerMatch;
	goToMatch: Function;
	gamertag: string;
	showExpanded?: boolean;
}

export function PlayerMatchSummary(props: MatchSummaryProps)
{
	const { match, goToMatch, gamertag, showExpanded } = props;

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
						<Box sx={{ backgroundColor: ArrowheadTheme.box, width: "100%", ml: "-16px", padding: "8px 16px 4px 16px", mt: -2 }}>
							<Typography variant="h5" component="div" sx={{ textAlign: "center" }}>{match.playlist.name}</Typography>
							<Typography variant="body1" sx={{ color: match.player.outcome === "win" ? ArrowheadTheme.good : match.player.outcome === "loss" ? ArrowheadTheme.bad : ArrowheadTheme.text_primary, textAlign: "center" }}>
								{match.player.outcome === "win" 
									? "Win"
									: match.player.outcome === "loss" 
									? "Loss"
									: match.player.outcome === "draw"
									? "Tie"
									: "Left Early" 
								}
							</Typography>
							<Typography fontSize="small" sx={{ textAlign: "center" }}>{match.player.placement}</Typography>
						</Box>
						<Box sx={{ backgroundColor: ArrowheadTheme.card, width: "100%", ml: "-16px", padding: "8px 16px" }}>
							<Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
								<Box sx={{ display: "flex", width: "75px", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
									<Typography variant="caption">Kills</Typography>
									<Typography variant="body1">{match.player.summary.kills}</Typography>
								</Box>
								<Box sx={{ display: "flex", width: "75px", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
									<Typography variant="caption">Assists</Typography>
									<Typography variant="body1">{match.player.summary.assists}</Typography>
								</Box>
								<Box sx={{ display: "flex", width: "75px", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
									<Typography variant="caption">Deaths</Typography>
									<Typography variant="body1">{match.player.summary.deaths}</Typography>
								</Box>
							</Box>
						</Box>
						{showExpanded && <>
							<Box sx={{ backgroundColor: ArrowheadTheme.box, width: "100%", marginLeft: "-16px", padding: "8px 16px" }}>
								<Box sx={{ mb: 1, display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
									<Box sx={{ display: "flex", width: "112px", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
										<Typography variant="caption">KDA</Typography>
										<Typography variant="body1">{match.player.kda.toLocaleString()}</Typography>
									</Box>
									<Box sx={{ display: "flex", width: "112px", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
										<Typography variant="caption">KDR</Typography>
										<Typography variant="body1">{match.player.kdr.toLocaleString()}</Typography>
									</Box>
								</Box>
								<Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
									<Box sx={{ display: "flex", width: "112px", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
										<Typography variant="caption">Damage Efficiency</Typography>
										<Typography variant="body1">{Math.round(match.player.damageEfficiency * 100).toLocaleString() + "%"}</Typography>
									</Box>
									<Box sx={{ display: "flex", width: "112px", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
										<Typography variant="caption">Enemy Efficiency</Typography>
										<Typography variant="body1">{Math.round(match.player.enemyDamageEfficiency * 100).toLocaleString() + "%"}</Typography>
									</Box>
								</Box>
								<Box sx={{ mt: 2, display: "flex", justifyContent: "center", width: "100%" }}><MatchBreakdown label1="Damage Dealt" value1={match.player.damage.dealt} label2="Damage Taken" value2={match.player.damage.taken} /></Box>
								<Box sx={{ mt: 1, display: "flex", justifyContent: "center", width: "100%" }}><MatchBreakdown label1="Shots Landed" value1={match.player.shots.landed} label2="Shots Missed" value2={match.player.shots.missed} /></Box>
							</Box>
						</>}
						{match.playlist.ranked && 
							<Box sx={{ backgroundColor: ArrowheadTheme.card, width: "100%", marginLeft: "-16px", padding: "8px 16px" }}>
								<Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 2, mb: 2 }}>
									<CSRSProgression pre={match.player.csr.pre} post={match.player.csr.post} noBackground />
								</Box>
							</Box>	
						}
						<Box sx={{ backgroundColor: ArrowheadTheme.card, width: "100%", marginLeft: "-16px", padding: "8px 16px", marginBottom: -2 }}>
							<Typography variant="body1" component="div" sx={{ textAlign: "center", color: "#AAA", fontSize: "0.6rem" }}>{match.date.toLocaleString()}</Typography>
						</Box>
					</CardContent>
				</CardActionArea>
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