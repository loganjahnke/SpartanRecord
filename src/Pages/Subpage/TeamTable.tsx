import { TableContainer, Box, Table, TableHead, TableCell, TableRow, TableBody, IconButton, Collapse, Typography } from "@mui/material";
import { ArrowheadTheme } from "../../Assets/Theme/ArrowheadTheme";
import { MatchPlayer } from "../../Objects/Pieces/MatchPlayer";
import { Team } from "../../Objects/Pieces/Team";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import React, { useState } from "react";

import StarIcon from '@mui/icons-material/Star';
import { CSRSProgression, CSRSTooltip } from "../../Assets/Components/Custom/CSRSTooltip";
import { Match } from "../../Objects/Model/Match";
import { Converter } from "../../Objects/Helpers/Statics/Converter";
import { MedalsMode, PlayerMatchSummaryDetails } from "../../Assets/Components/Match/PlayerMatchSummaryDetails";

interface TeamTableProps
{
	match?: Match;
	selectedGamertag?: string;
	team: Team;
	onGamertagClick: (gamertag: string) => void;
	ffa?: boolean;
}

interface TeamTableRowProps
{
	selectedGamertag?: string;
	onGamertagClick: (gamertag: string) => void; 
	player: MatchPlayer; 
	topSR: { score: number, points: number, kills: number, deaths: number, assists: number };
	showRank?: boolean;
	showPoints?: boolean;
	ffa?: boolean;
}

export function TeamTable(props: TeamTableProps)
{
	const { match } = props;

	if (!match) { return <></>; }
	return (
		<TableContainer component={Box} sx={{ backgroundColor: ArrowheadTheme.box, borderRadius: 3 }}>
			{match.interaction?.toUpperCase() === "PVE"
				? <PVETable {...props} />
				: <PVPTable {...props} />}
		</TableContainer>
	);
}

function PVPTable(props: TeamTableProps)
{
	const { selectedGamertag, team, match, onGamertagClick, ffa } = props;

	const bestTextColor = Converter.GetBestTextColor(team.color);

	const sortedPlayers = match?.showPoints
		? team.players.sort((a, b) => 
		{
			if (b.stats.totalPoints - a.stats.totalPoints === 0) { return b.stats.totalScore - a.stats.totalScore; }
			return b.stats.totalPoints - a.stats.totalPoints;
		})
		: team.players.sort((a, b) => b.stats.totalScore - a.stats.totalScore);

	if (!match) { return <></>; }
	return (
		<Table size="small">
			<TableHead sx={{ backgroundColor: team.color }}>
				<TableRow>
					<TableCell />
					{match.playlist.ranked && <TableCell sx={{ color: bestTextColor, pr: 2 }} align="right">Rank</TableCell>}
					<TableCell sx={{ color: bestTextColor, pl: 2, pr: 2, position: "sticky", left: 0, backgroundColor: team.color }}>Gamertag</TableCell>
					<TableCell sx={{ color: bestTextColor, pl: 2, pr: 2 }} align="right">Score</TableCell>
					{match.showPoints &&  <TableCell sx={{ color: bestTextColor, pl: 2, pr: 2 }} align="right">Points</TableCell>}
					<TableCell sx={{ color: bestTextColor, pl: 2, pr: 2 }} align="right">Kills</TableCell>
					<TableCell sx={{ color: bestTextColor, pl: 2, pr: 2 }} align="right">Deaths</TableCell>
					<TableCell sx={{ color: bestTextColor, pl: 2, pr: 2 }} align="right">Assists</TableCell>
					<TableCell sx={{ color: bestTextColor, pl: 2, pr: 2 }} align="right">KDA</TableCell>
					{ffa && <TableCell sx={{ color: bestTextColor, pl: 2, pr: 2 }} align="right">MMR</TableCell>}
				</TableRow>
			</TableHead>
			<TableBody>
				{sortedPlayers.map((player, index) => (
					<PVPRow key={index} player={player} topSR={match.best} showPoints={match.showPoints} showRank={match.playlist.ranked} onGamertagClick={onGamertagClick} selectedGamertag={selectedGamertag} ffa={ffa} />
				))}
			</TableBody>
		</Table>
	);
}

function PVPRow(props: TeamTableRowProps)
{
	const { selectedGamertag, onGamertagClick, player, topSR, showRank, showPoints, ffa } = props;
	const [expanded, setExpanded] = useState(false);

	const bestScore = player.stats.totalScore === topSR?.score;
	const bestPoints = player.stats.totalPoints === topSR?.points;
	const bestKills = player.stats.summary.kills === topSR?.kills;
	const bestDeaths = player.stats.summary.deaths === topSR?.deaths;
	const bestAssists = player.stats.summary.assists === topSR?.assists;

	return (
		<React.Fragment>
		<TableRow sx={{ ".MuiTableCell-body": { verticalAlign: "middle", color: player.leftEarly ? ArrowheadTheme.leftEarlyText : ArrowheadTheme.text_primary } }}>
				{/* Expansion Button */}
				<TableCell width={"32px"}>
					<IconButton size="small" onClick={() => setExpanded(!expanded)}>
						{expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				{/* Rank */}
				{showRank &&
						<TableCell sx={{ pl: 2, pr: 2, pt: 0, pb: 0 }} align="right" width={"64px"}>
							<CSRSTooltip title={
								<CSRSProgression pre={player.progression.pre} post={player.progression.post} />
							}>
								<img src={player.progression.post.tierImageUrl} alt={player.progression.post.tier + " " + (player.progression.post.subTier)} title={player.progression.post.tier + " " + (player.progression.post.subTier)} height="32px" />
							</CSRSTooltip>
						</TableCell> 
				}
				{/* Gamertag */}
				<TableCell 
					sx={{ pl: 2, pr: 2, position: "sticky", cursor: player.type === "bot" ? "default" : "pointer", left: 0, background: ArrowheadTheme.box }} 
					component="th" 
					scope="row" 
					onClick={player.type === "human" ? () => onGamertagClick(player.gamertag) : undefined} 
					width={"150px"}>
						<Typography sx={{ fontWeight: selectedGamertag === player.gamertag ? 900 : 500, color: selectedGamertag === player.gamertag ? ArrowheadTheme.halo_grass : player.leftEarly ? ArrowheadTheme.leftEarlyText : ArrowheadTheme.text_primary }} variant="body2">{player.gamertag}</Typography>
				</TableCell>
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
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8 + +(showPoints ?? 0) + +(showRank ?? 0) + +(ffa ?? 0)}>
					<Collapse in={expanded} timeout="auto" unmountOnExit sx={{ width: "auto" }}>
						<Box sx={{ p: 1, width: { sm: "calc(100vw - 76px)", md: "auto" }}}>
							<PlayerMatchSummaryDetails player={player} isRanked={showRank} medalsMode={MedalsMode.all} />
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	)
}

function PVETable(props: TeamTableProps)
{
	const { selectedGamertag, team, match, onGamertagClick, ffa } = props;

	const bestTextColor = Converter.GetBestTextColor(team.color);

	const sortedPlayers = match?.showPoints
		? team.players.sort((a, b) => 
		{
			if (b.stats.totalPoints - a.stats.totalPoints === 0) { return b.stats.totalScore - a.stats.totalScore; }
			return b.stats.totalPoints - a.stats.totalPoints;
		})
		: team.players.sort((a, b) => b.stats.totalScore - a.stats.totalScore);

	if (!match) { return <></>; }
	return (
		<Table size="small">
			<TableHead sx={{ backgroundColor: team.color }}>
				<TableRow>
					<TableCell />
					<TableCell sx={{ color: bestTextColor, pl: 2, pr: 2, position: "sticky", left: 0, backgroundColor: team.color }}>Gamertag</TableCell>
					<TableCell sx={{ color: bestTextColor, pl: 2, pr: 2 }} align="right">Score</TableCell>
					<TableCell sx={{ color: bestTextColor, pl: 2, pr: 2 }} align="right">Assists</TableCell>
					<TableCell sx={{ color: bestTextColor, pl: 2, pr: 2 }} align="right">Deaths</TableCell>
					<TableCell sx={{ color: bestTextColor, pl: 2, pr: 2 }} align="right">Damage</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{sortedPlayers.map((player, index) => (
					<PVERow key={index} player={player} topSR={match.best} showPoints={match.showPoints} showRank={match.playlist.ranked} onGamertagClick={onGamertagClick} selectedGamertag={selectedGamertag} ffa={ffa} />
				))}
			</TableBody>
		</Table>
	);
}

function PVERow(props: TeamTableRowProps)
{
	const { selectedGamertag, onGamertagClick, player, topSR, showRank, showPoints, ffa } = props;
	const [expanded, setExpanded] = useState(false);

	const bestScore = player.stats.totalScore === topSR?.score;
	const bestDeaths = player.stats.summary.deaths === topSR?.deaths;
	const bestAssists = player.stats.summary.assists === topSR?.assists;

	return (
		<React.Fragment>
		<TableRow sx={{ ".MuiTableCell-body": { verticalAlign: "middle", color: player.leftEarly ? ArrowheadTheme.leftEarlyText : ArrowheadTheme.text_primary } }}>
				{/* Expansion Button */}
				<TableCell width={"32px"}>
					<IconButton size="small" onClick={() => setExpanded(!expanded)}>
						{expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				{/* Gamertag */}
				<TableCell 
					sx={{ pl: 2, pr: 2, position: "sticky", cursor: player.type === "bot" ? "default" : "pointer", left: 0, background: ArrowheadTheme.box }} 
					component="th" 
					scope="row" 
					onClick={player.type === "player" ? () => onGamertagClick(player.gamertag) : undefined} 
					width={"150px"}>
						<Typography sx={{ fontWeight: selectedGamertag === player.gamertag ? 900 : 500, color: selectedGamertag === player.gamertag ? ArrowheadTheme.halo_grass : player.leftEarly ? ArrowheadTheme.leftEarlyText : ArrowheadTheme.text_primary }} variant="body2">{player.gamertag}</Typography>
				</TableCell>
				<TableCell sx={{ pl: 2, pr: 2 }} width={"80px"} align="right">
					<Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
						{bestScore ? <StarIcon sx={{ color: ArrowheadTheme.good, mr: 1 }} /> : undefined}
						{player.stats.totalScore.toLocaleString()}
					</Box>
				</TableCell>
				<TableCell sx={{ pl: 2, pr: 2 }} width={"80px"} align="right">
					<Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
						{bestAssists ? <StarIcon sx={{ color: ArrowheadTheme.good, mr: 1 }} /> : undefined}
						{player.stats.summary.assists}
					</Box>
				</TableCell>
				<TableCell sx={{ pl: 2, pr: 2 }} width={"80px"} align="right">
					<Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
						{bestDeaths ? <StarIcon sx={{ color: ArrowheadTheme.good, mr: 1 }} /> : undefined}
						{player.stats.summary.deaths}
					</Box>
				</TableCell>
				<TableCell sx={{ pr: 2 }} width={"80px"} align="right">{player.stats.damage.dealt.toLocaleString()}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8 + +(showPoints ?? 0) + +(showRank ?? 0) + +(ffa ?? 0)}>
					<Collapse in={expanded} timeout="auto" unmountOnExit sx={{ width: "auto" }}>
						<Box sx={{ p: 1, width: { sm: "calc(100vw - 76px)", md: "auto" }}}>
							<PlayerMatchSummaryDetails player={player} isRanked={showRank} medalsMode={MedalsMode.all} isPVE />
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	)
}