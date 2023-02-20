import { Box, Card, CardActionArea, CardContent, CardMedia, Divider, Grid, Menu, MenuItem, Snackbar, Typography } from "@mui/material";
import { useState } from "react";
import { Match } from "../../../Objects/Model/Match";

interface MatchSummaryProps
{
	match: Match;
	category: string;
	goToMatch: Function;
	value: number;
	gamertag: string;
}

export function MatchSummary(props: MatchSummaryProps)
{
	const { match, goToMatch, category, value, gamertag } = props;

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

	const copyMatchID = () => 
	{
		navigator.clipboard.writeText(match.id);
		setSnacking(true);
		closeContextMenu();
	}

	const openInLeafApp = () =>
	{
		closeContextMenu();
		window.open("https://leafapp.co/game/" + match.id, "_blank");
	};

	const openInHaloDataHive = () =>
	{
		closeContextMenu();
		window.open(`https://halodatahive.com/Infinite/Match/${match.id}?gamertag=${gamertag}&page=0`, "_blank");
	};

	/** Open in HaloWaypoint */
	const openInHaloWaypoint = () =>
	{
		closeContextMenu();
		window.open(`https://www.halowaypoint.com/halo-infinite/players/${gamertag}/matches/${match!.id}`, "_blank");
	};

	return (
		<Grid item xs={12} md={4} lg={3}>
			<Card>
				<CardActionArea onClick={onCardAreaClick} onContextMenu={handleContextMenu}>
					<CardMedia component="img" height="200" image={match.map.asset.thumbnail} alt={match.map.name} />
					<CardContent>
						<Typography variant="h5" component="div" sx={{ textAlign: "center" }}>{category}</Typography>
						<Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
							<Typography variant="h3">{value.toLocaleString()}</Typography>
						</Box>
						<Divider flexItem sx={{ borderColor: "#666", borderWidth: "0.5px", borderTop: "none", mt:1, mb:1 }} />
						<Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", flexWrap: "wrap", alignItems: "center" }}>
							<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", m: 1 }}>
								<Typography variant="caption">Playlist</Typography>
								<Typography variant="body1">{match.playlist.name}</Typography>
							</Box>
							<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", m:1 }}>
								<Typography variant="caption">Map</Typography>
								<Typography variant="body1">{match.map.name}</Typography>
							</Box>
							<Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", m:1 }}>
								<Typography variant="caption">Variant</Typography>
								<Typography variant="body1">{match.mode.name}</Typography>
							</Box>
						</Box>
						<Typography variant="body1" component="div" sx={{ mt: 2, mb: -1.5, textAlign: "center", color: "#666", fontSize: "0.6rem" }}>{match.date.toLocaleString()}</Typography>
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
				<MenuItem onClick={copyMatchID}>Copy Match ID</MenuItem>
				<MenuItem onClick={openInLeafApp}>Open in leafapp.co</MenuItem>
				<MenuItem onClick={openInHaloDataHive}>Open in HaloDataHive.com</MenuItem>
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