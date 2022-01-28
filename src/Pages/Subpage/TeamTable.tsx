import { TableContainer, Box, Table, TableHead, TableCell, TableRow, TableBody, IconButton, Collapse, Typography, Grid } from "@mui/material";
import { ArrowheadTheme } from "../../Assets/Theme/ArrowheadTheme";
import { HaloMode, HaloOutcome } from "../../Database/ArrowheadFirebase";
import { MatchPlayer } from "../../Objects/Pieces/MatchPlayer";
import { Team } from "../../Objects/Pieces/Team";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useState } from "react";
import { MedalTile } from "../../Assets/Components/Medals/MedalTile";
import { DamageBreakdown } from "../../Assets/Components/Breakdowns/DamageBreakdown";
import { ShotsBreakdown } from "../../Assets/Components/Breakdowns/ShotsBreakdown";

interface TeamTableProps
{
	mode: HaloMode;
	ranked?: boolean;
	team: Team;
	best: { score: number, points: number, kills: number, deaths: number, assists: number };
	onGamertagClick: (gamertag: string) => void;
}

interface TeamTableRowProps
{
	onGamertagClick: (gamertag: string) => void; 
	player: MatchPlayer; 
	topSR: { score: number, points: number, kills: number, deaths: number, assists: number };
	showRank?: boolean;
	showPoints?: boolean;
}

export function TeamTable(props: TeamTableProps)
{
	const { mode, ranked, team, best, onGamertagClick } = props;

	return (
		<TableContainer component={Box} sx={{ backgroundColor: ArrowheadTheme.box, borderRadius: 3 }}>
			<Table>
				<TableHead sx={{ backgroundColor: team.details.name === "Cobra" ? ArrowheadTheme.cobra : ArrowheadTheme.eagle }}>
					<TableRow>
						<TableCell />
						{ranked ? <TableCell sx={{ pr: 2 }} align="right">Rank</TableCell> : undefined}
						<TableCell sx={{ pl: 2, pr: 2, position: "sticky", left: 0, backgroundColor: team.details.name === "Cobra" ? ArrowheadTheme.cobra : ArrowheadTheme.eagle }}>Gamertag</TableCell>
						<TableCell sx={{ pl: 2, pr: 2 }} align="right">Total Score</TableCell>
						{mode === HaloMode.Oddball || mode === HaloMode.CTF ? <TableCell sx={{ pl: 2, pr: 2 }} align="right">Points</TableCell> : undefined}
						<TableCell sx={{ pl: 2, pr: 2 }} align="right">Kills</TableCell>
						<TableCell sx={{ pl: 2, pr: 2 }} align="right">Deaths</TableCell>
						<TableCell sx={{ pl: 2, pr: 2 }} align="right">Assists</TableCell>
						<TableCell sx={{ pl: 2, pr: 2 }} align="right">KDA</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{team.players.sort((a, b) => b.stats.totalScore - a.stats.totalScore).map((player, index) => (
						<Row key={index} player={player} topSR={best} showRank={ranked} showPoints={mode === HaloMode.Oddball || mode === HaloMode.CTF} onGamertagClick={onGamertagClick} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

function Row(props: TeamTableRowProps)
{
	const { onGamertagClick, player, topSR, showRank, showPoints } = props;
	const [expanded, setExpanded] = useState(false);

	const bestScore = player.stats.totalScore === topSR?.score ? ArrowheadTheme.good + " !important" : "";
	const bestPoints = player.stats.totalPoints === topSR?.points ? ArrowheadTheme.good + " !important" : "";
	const bestKills = player.stats.summary.kills === topSR?.kills ? ArrowheadTheme.good + " !important" : "";
	const bestDeaths = player.stats.summary.deaths === topSR?.deaths ? ArrowheadTheme.good + " !important" : "";
	const bestAssists = player.stats.summary.assists === topSR?.assists ? ArrowheadTheme.good + " !important" : "";

	return (
		<React.Fragment>
			<TableRow sx={{ ".MuiTableCell-body": { color: player.outcome === HaloOutcome.Left ? ArrowheadTheme.leftEarlyText : ArrowheadTheme.text_primary } }}>
				<TableCell width={"32px"}>
					<IconButton size="small" onClick={() => setExpanded(!expanded)}>
						{expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				{showRank ? 
					<TableCell sx={{ pl: 2, pr: 2, pt: 0, pb: 0 }} align="right" width={"64px"}>
						<img src={player.progression.post.tierImageUrl} alt={player.progression.post.tier + " " + (player.progression.post.subTier + 1)} title={player.progression.post.tier + " " + (player.progression.post.subTier + 1)} height="32px" />
					</TableCell> 
				: undefined}
				<TableCell sx={{ pl: 2, pr: 2, position: "sticky", left: 0, backgroundColor: ArrowheadTheme.box }} component="th" scope="row" onClick={() => onGamertagClick(player.gamertag)} width={"150px"}>{player.gamertag}</TableCell>
				<TableCell sx={{ pl: 2, pr: 2, backgroundColor: bestScore }} width={"80px"} align="right">{player.stats.totalScore}</TableCell>
				{showPoints ? <TableCell sx={{ pl: 2, pr: 2, backgroundColor: bestPoints }} width={"80px"} align="right">{player.stats.totalPoints}</TableCell> : undefined}
				<TableCell sx={{ pl: 2, pr: 2, backgroundColor: bestKills }} width={"80px"} align="right">{player.stats.summary.kills}</TableCell>
				<TableCell sx={{ pl: 2, pr: 2, backgroundColor: bestDeaths }} width={"80px"} align="right">{player.stats.summary.deaths}</TableCell>
				<TableCell sx={{ pl: 2, pr: 2, backgroundColor: bestAssists }} width={"80px"} align="right">{player.stats.summary.assists}</TableCell>
				<TableCell sx={{ pr: 2 }} width={"80px"} align="right">{player.stats.kda}</TableCell>
			</TableRow>
			<TableRow sx={{ width: "calc(100%-128px)"}}>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={showRank && showPoints ? 9 : showRank || showPoints ? 8 : 7}>
					<Collapse in={expanded} timeout="auto" unmountOnExit sx={{ width: "auto" }}>
						<Grid container spacing={1}>
							<Grid item xs={6} xl={5}>
								<Box sx={{ borderRadius: 3, padding: 1, display: "flex", alignItems: "flex-start", flexDirection: "column", maxWidth: "auto", overflowX: "scroll", backgroundColor: ArrowheadTheme.secondary }}>
									<Typography variant="h5" sx={{ width: "auto", textAlign: "left", ml: 2, mt: 1, fontSize: "0.95rem !important" }}>Medals</Typography>
									<Box sx={{ margin: 1, display: "flex", flexDirection: "row", width: "auto", overflowX: "scroll" }}>
										{player.stats.medals.length > 0 
											? player.stats.medals.sort((a, b) => b.RarityValue() - a.RarityValue()).map(medal => <MedalTile medal={medal} small />) 
											: <Typography variant="body1" sx={{ m: 4 }}>No medals earned.</Typography>}
									</Box>
								</Box>
							</Grid>
							<Grid item xs={6} xl={4}>
								<ShotsBreakdown serviceRecord={player.stats} small />
							</Grid>
							<Grid item xs={6} xl={3}>
								<DamageBreakdown serviceRecord={player.stats} small />								
							</Grid>
						</Grid>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	)
}