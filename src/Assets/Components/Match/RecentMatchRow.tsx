import { Box, Card, CardActionArea, CardContent, CardMedia, Grid, Menu, MenuItem, Snackbar, Typography } from "@mui/material";
import { useState } from "react";
import { PlayerMatch } from "../../../Objects/Model/PlayerMatch";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { DamageBreakdown, MatchDamageBreakdown } from "../Breakdowns/DamageBreakdown";
import { MatchShotsBreakdown } from "../Breakdowns/ShotsBreakdown";
import { CSRSProgression } from "../Custom/CSRSTooltip";

interface MatchSummaryProps
{
	match: PlayerMatch;
	goToMatch: Function;
	gamertag: string;
	showExpanded?: boolean;
}

export function RecentMatchRow(props: MatchSummaryProps)
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

	/** Label value component */
	const LabelValue = (props: { label: string, value: number, width: string }) =>
	{
		const { label, value, width } = props;
		return (
			<Box sx={{ mt: "4px", width: width }}>
				<Typography variant="caption">{label}</Typography>
				<Typography variant="subtitle1">{(Math.trunc(value * 10) / 10).toLocaleString()}</Typography>
			</Box>
		);
	}

	return (
		<>
			<Grid item xs={0} xl={showExpanded ? 2 : 3} sx={{ mt: -2, mb: -2 }} />
			<Grid item xs={12} xl={showExpanded ? 8 : 6}>
				<Card>
					<CardActionArea onClick={onCardAreaClick} onContextMenu={handleContextMenu} sx={{ mt: -2, mb: -2 }}>
						<CardContent>
							<Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
								<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100px", alignSelf: "stretch", justifySelf: "center", ml: -2, backgroundColor: match.player.outcome === "win" ? ArrowheadTheme.good : match.player.outcome === "loss" || match.player.outcome === "left" ? ArrowheadTheme.bad : "transparent" }}>
									<Typography variant="h3">{match.player.placement}</Typography>
								</Box>
								<Box sx={{ display: "flex", flexDirection: "column", mr: 4, mt: 1, mb: 1, ml: 2 }}>
									<Box sx={{ width: "175px" }}>
										<Typography variant="h5">{match.playlist.short}</Typography>
										<Typography variant="h6">{match.variant.short}</Typography>
									</Box>
									<Box sx={{ display: "flex" }}>
										<LabelValue width="40px" label="KDA" value={match.player.kda} />
										<LabelValue width="40px" label="K" value={match.player.summary.kills} />
										<LabelValue width="40px" label="D" value={match.player.summary.deaths} />
										<LabelValue width="40px" label="A" value={match.player.summary.assists} />
									</Box>
								</Box>
								{showExpanded && <>
									<Box>
										<MatchDamageBreakdown match={match} small />
									</Box>
									<Box>
										<MatchShotsBreakdown match={match} small />
									</Box>
								</>}
								{match.playlist.ranked && <>
									<Box sx={{ flexGrow: 1 }} />
									<Box sx={{ mt: 1, mb: 1 }}>
										<CSRSProgression pre={match.player.csr.pre} post={match.player.csr.post} noBackground />
									</Box>
									</>
								}
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
			<Grid item xs={0} xl={showExpanded ? 2 : 3} sx={{ mt: -2, mb: -2 }} />
		</>
	);
}