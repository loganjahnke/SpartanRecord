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

import StarIcon from '@mui/icons-material/Star';
import { ExpectationBreakdown } from "../../Assets/Components/Breakdowns/ExpectationBreakdown";

interface TeamTableProps
{
	ranked?: boolean;
	team: Team;
	variant?: string;
	best: { score: number, points: number, kills: number, deaths: number, assists: number };
	onGamertagClick: (gamertag: string) => void;
	ffa?: boolean;
}

interface TeamTableRowProps
{
	onGamertagClick: (gamertag: string) => void; 
	player: MatchPlayer; 
	topSR: { score: number, points: number, kills: number, deaths: number, assists: number };
	showRank?: boolean;
	showPoints?: boolean;
	ffa?: boolean;
}

export function TeamTable(props: TeamTableProps)
{
	const { ranked, team, best, variant, onGamertagClick, ffa } = props;

	const showPoints = !!variant && (variant.includes("CTF") || variant.includes("Oddball"));

	return (
		<TableContainer component={Box} sx={{ backgroundColor: ArrowheadTheme.box, borderRadius: 3 }}>
			<Table>
				<TableHead sx={{ backgroundColor: team.details.name === "Cobra" ? ArrowheadTheme.cobra : ArrowheadTheme.eagle }}>
					<TableRow>
						<TableCell />
						{ranked && <TableCell sx={{ pr: 2 }} align="right">Rank</TableCell>}
						<TableCell sx={{ pl: 2, pr: 2, position: "sticky", left: 0, backgroundColor: team.details.name === "Cobra" ? ArrowheadTheme.cobra : ArrowheadTheme.eagle }}>Gamertag</TableCell>
						<TableCell sx={{ pl: 2, pr: 2 }} align="right">Total Score</TableCell>
						{showPoints &&  <TableCell sx={{ pl: 2, pr: 2 }} align="right">Points</TableCell>}
						<TableCell sx={{ pl: 2, pr: 2 }} align="right">Kills</TableCell>
						<TableCell sx={{ pl: 2, pr: 2 }} align="right">Deaths</TableCell>
						<TableCell sx={{ pl: 2, pr: 2 }} align="right">Assists</TableCell>
						<TableCell sx={{ pl: 2, pr: 2 }} align="right">KDA</TableCell>
						{ffa && <TableCell sx={{ pl: 2, pr: 2 }} align="right">MMR</TableCell>}
					</TableRow>
				</TableHead>
				<TableBody>
					{team.players.sort((a, b) => b.stats.totalScore - a.stats.totalScore).map((player, index) => (
						<Row key={index} player={player} topSR={best} showPoints={showPoints} showRank={ranked} onGamertagClick={onGamertagClick} ffa={ffa} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

function Row(props: TeamTableRowProps)
{
	const { onGamertagClick, player, topSR, showRank, showPoints, ffa } = props;
	const [expanded, setExpanded] = useState(false);

	const bestScore = player.stats.totalScore === topSR?.score;
	const bestPoints = player.stats.totalPoints === topSR?.points;
	const bestKills = player.stats.summary.kills === topSR?.kills;
	const bestDeaths = player.stats.summary.deaths === topSR?.deaths;
	const bestAssists = player.stats.summary.assists === topSR?.assists;

	return (
		<React.Fragment>
		<TableRow sx={{ ".MuiTableCell-body": { verticalAlign: "middle", color: player.outcome === HaloOutcome.Left ? ArrowheadTheme.leftEarlyText : ArrowheadTheme.text_primary } }}>
				<TableCell width={"32px"}>
					<IconButton size="small" onClick={() => setExpanded(!expanded)}>
						{expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				{showRank && 
					<TableCell sx={{ pl: 2, pr: 2, pt: 0, pb: 0 }} align="right" width={"64px"}>
						<img src={player.progression.post.tierImageUrl} alt={player.progression.post.tier + " " + (player.progression.post.subTier)} title={player.progression.post.tier + " " + (player.progression.post.subTier)} height="32px" />
					</TableCell> 
				}
				<TableCell sx={{ pl: 2, pr: 2, position: "sticky", left: 0, backgroundColor: ArrowheadTheme.box }} component="th" scope="row" onClick={() => onGamertagClick(player.gamertag)} width={"150px"}>{player.gamertag}</TableCell>
				<TableCell sx={{ pl: 2, pr: 2 }} width={"80px"} align="right">
					<Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
						{bestScore ? <StarIcon sx={{ color: ArrowheadTheme.good, mr: 1 }} /> : undefined}
						{player.stats.totalScore.toLocaleString()}
					</Box>
				</TableCell>
				{showPoints && <TableCell sx={{ pl: 2, pr: 2 }} width={"80px"} align="right">
					<Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
						{bestPoints ? <StarIcon sx={{ color: ArrowheadTheme.good, mr: 1 }} /> : undefined}
						{player.stats.totalPoints.toLocaleString()}
					</Box>
				</TableCell>
				}
				<TableCell sx={{ pl: 2, pr: 2 }} width={"80px"} align="right">
					<Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
						{bestKills ? <StarIcon sx={{ color: ArrowheadTheme.good, mr: 1 }} /> : undefined}
						{player.stats.summary.kills}
					</Box>
				</TableCell>
				<TableCell sx={{ pl: 2, pr: 2 }} width={"80px"} align="right">
					<Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
						{bestDeaths ? <StarIcon sx={{ color: ArrowheadTheme.good, mr: 1 }} /> : undefined}
						{player.stats.summary.deaths}
					</Box>
				</TableCell>
				<TableCell sx={{ pl: 2, pr: 2 }} width={"80px"} align="right">
					<Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
						{bestAssists ? <StarIcon sx={{ color: ArrowheadTheme.good, mr: 1 }} /> : undefined}
						{player.stats.summary.assists}
					</Box>
				</TableCell>
				<TableCell sx={{ pr: 2 }} width={"80px"} align="right">{player.stats.kda.toLocaleString()}</TableCell>
				{ffa && 
					<TableCell sx={{ pl: 2, pr: 2, pt: 0, pb: 0 }} align="right" width={"64px"}>
						<Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
							{player.mmr.toLocaleString()}
						</Box>
					</TableCell> 
				}
			</TableRow>
			<TableRow sx={{ width: "calc(100%-128px)"}}>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8 + +(showPoints ?? 0) + +(showRank ?? 0) + +(ffa ?? 0)}>
					<Collapse in={expanded} timeout="auto" unmountOnExit sx={{ width: "auto" }}>
						<Box sx={{ p: 1 }}>
							<Grid container spacing={1}>
								<Grid item xs={6}>
									<ShotsBreakdown serviceRecord={player.stats} small />
									<Box sx={{ m: 1 }}></Box>
									<DamageBreakdown serviceRecord={player.stats} small />
									<Box sx={{ m: 1 }}></Box>
									<ExpectationBreakdown kills={player.killExpectations} deaths={player.deathExpectations} small />						
								</Grid>
								<Grid item xs={6}>
									<Box sx={{ display: "flex", 
										flexDirection: "column", 
										justifyContent: "center", 
										clear: "both", 
										borderRadius: 3,
										backgroundColor: ArrowheadTheme.secondary }}>
										<Box sx={{ margin: 1 }}>
											{player.stats.medals.length > 0 
												? player.stats.medals.sort((a, b) => b.RarityValue() - a.RarityValue()).map(medal => <MedalTile medal={medal} />) 
												: <Typography variant="body1" sx={{ m: 4 }}>No medals earned.</Typography>}
										</Box>
									</Box>
								</Grid>
							</Grid>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	)
}