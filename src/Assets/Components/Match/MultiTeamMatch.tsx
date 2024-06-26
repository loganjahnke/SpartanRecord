import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Match } from "../../../Objects/Model/Match";
import { Compare } from "../Compare/Compare";
import { CompareHeader } from "../Compare/CompareHeader";
import { DynamicTeamCard } from "../TeamAppearance/TeamCard";
import { TeamTable } from "../../../Pages/Subpage/TeamTable";
import { MatchTitleCard } from "./MatchTitleCard";
import { BackgroundWinnerIcon } from "./BackgroundWinnerIcon";

import "../../Styles/Views/SingleMatch.css";
import { Team } from "../../../Objects/Pieces/Team";

export interface TeamsMatch
{
	match: Match;
	myGamertag?: string;
	onGamertagClick: (tag: string) => void;
}

export function MultiTeamsMatch(props: TeamsMatch)
{
	const { match, myGamertag, onGamertagClick } = props;

	let winningTeam: Team | undefined;
	let myTeam: Team | undefined;
	let alternativeTeam: Team | undefined;

	let leftTeam: Team | undefined;
	let rightTeam: Team | undefined;

	if (match)
	{
		const teamsInOrderOfPoints = [...match.teams].sort((a, b) => a.statistics.totalPoints > b.statistics.totalPoints ? -1 : 1);

		for (const team of teamsInOrderOfPoints)
		{
			const isWinningTeam = team.details.name === match.winner;
			const isMyTeam = myGamertag && team.containsGamertag(myGamertag);

			if (isMyTeam) { myTeam = team; }
			else if (isWinningTeam) { winningTeam = team; }
			else if (!alternativeTeam) { alternativeTeam = team; }
		}

		/** Throws out the A team if it equals B */
		const duplicateHater = (a?: Team, b?: Team): Team | undefined => a?.details?.name === b?.details?.name ? undefined : a;

		leftTeam = myTeam ?? winningTeam ?? alternativeTeam ?? match.teams[0];
		rightTeam = duplicateHater(winningTeam, leftTeam) ?? duplicateHater(alternativeTeam, leftTeam) ?? match.teams[1];
	}

	return (
		<>
			<BackgroundWinnerIcon winner={leftTeam?.details.name === match.winner} />
			<Grid container item sx={{ zIndex: 5 }} spacing={2} xs={12} xl={6}>
				<Grid item xs={12}>
					<Card sx={{ height: "100%", width: "100%", borderRadius: 3 }}>
						<CardContent className="teamCompareSection">
							<CompareHeader stretch
								compare1={<DynamicTeamCard team={leftTeam} winner={leftTeam?.details.name === match.winner} topDown noMargin rightAlign />}
								compare2={<DynamicTeamCard team={rightTeam} winner={rightTeam?.details.name === match.winner} topDown noMargin />}
								icon={<Typography variant="body1">vs</Typography>}
								backgroundURL={`url(${match.map.asset.thumbnail})`}
								subtitle={<MatchTitleCard match={match} />}
							/>
							{match.showPoints && <Compare category="Points" value1={leftTeam?.statistics.totalPoints} value2={rightTeam?.statistics.totalPoints} value1back={leftTeam?.color} value2back={rightTeam?.color} />}
							<Compare category="Kills" value1={leftTeam?.statistics.summary.kills} value2={rightTeam?.statistics.summary.kills} value1back={leftTeam?.color} value2back={rightTeam?.color} />
							<Compare category="Damage" value1={leftTeam?.statistics.damage.dealt} value2={rightTeam?.statistics.damage.dealt} value1back={leftTeam?.color} value2back={rightTeam?.color} />
							<Compare category="MMR" value1={leftTeam?.mmr} value2={rightTeam?.mmr} value1back={leftTeam?.color} value2back={rightTeam?.color} />
							<Compare category="Win Odds" value1={leftTeam?.oddsToWin} value2={rightTeam?.oddsToWin} isPercent value1back={leftTeam?.color} value2back={rightTeam?.color} />
						</CardContent>
					</Card>
				</Grid>
			</Grid>
			<BackgroundWinnerIcon winner={rightTeam?.details.name === match.winner} />
			<Grid container item spacing={2}>
				{match.teams.map(team => (
					<Grid item xs={12} lg={6}>
						<TeamTable team={team} match={match} onGamertagClick={onGamertagClick} selectedGamertag={myGamertag} />
					</Grid>
				))}
			</Grid>
		</>
	);
}