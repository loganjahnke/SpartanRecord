import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Compare } from "../Compare/Compare";
import { CompareHeader } from "../Compare/CompareHeader";
import { DynamicTeamCard } from "../TeamAppearance/TeamCard";
import { TeamTable } from "../../../Pages/Subpage/TeamTable";
import { TeamsMatch } from "./MultiTeamMatch";
import { MatchTitleCard } from "./MatchTitleCard";
import { BackgroundWinnerIcon } from "./BackgroundWinnerIcon";

import "../../Styles/Views/SingleMatch.css";

export function TwoTeamsMatch(props: TeamsMatch)
{
	const { match, myGamertag, onGamertagClick } = props;

	const teams = match.teams.filter(team => team.players && team.players.length > 0);

	return (
		<>
			<BackgroundWinnerIcon winner={match.teams[0].details.name === match.winner} />
			<Grid container item sx={{ zIndex: 5 }} spacing={2} xs={12} xl={6}>
				<Grid item xs={12}>
					<Card sx={{ height: "100%", width: "100%", borderRadius: 3 }}>
						<CardContent className="teamCompareSection">
							<CompareHeader stretch
								compare1={<DynamicTeamCard team={match?.teams[0]} winner={match.teams[0].details.name === match.winner} topDown noMargin rightAlign />}
								compare2={<DynamicTeamCard team={match?.teams[1]} winner={match.teams[1].details.name === match.winner} topDown noMargin />}
								icon={<Typography variant="body1">vs</Typography>}
								backgroundURL={`url(${match.map.asset.thumbnail})`}
								subtitle={<MatchTitleCard match={match} />}
							/>
							{teams.some(team => team.statistics.rounds && team.statistics.rounds.won > 1) && <Compare category="Rounds Won" value1={match.teams[0].statistics.rounds?.won ?? 0} value2={match.teams[1].statistics.rounds?.won ?? 0} value1back={match.teams[0].color} value2back={match.teams[1].color} />}
							{match.showPoints && <Compare category="Points" value1={match.teams[0].statistics.totalPoints} value2={match.teams[1].statistics.totalPoints} value1back={match.teams[0].color} value2back={match.teams[1].color} />}
							{teams.some(team => team.statistics.summary.kills > 0) && <Compare category="Kills" value1={match.teams[0].statistics.summary.kills} value2={match.teams[1].statistics.summary.kills} value1back={match.teams[0].color} value2back={match.teams[1].color} />}
							{teams.some(team => team.statistics.damage.dealt > 0) && <Compare category="Damage" value1={match.teams[0].statistics.damage.dealt} value2={match.teams[1].statistics.damage.dealt} value1back={match.teams[0].color} value2back={match.teams[1].color} />}
							{teams.some(team => team.csr > 0) && <Compare category="Average CSR" value1={match.teams[0].csr} value2={match.teams[1].csr} value1back={match.teams[0].color} value2back={match.teams[1].color} />}
							{teams.some(team => team.mmr > 0) && <Compare category="Average MMR" value1={match.teams[0].mmr} value2={match.teams[1].mmr} value1back={match.teams[0].color} value2back={match.teams[1].color} />}
							{teams.some(team => team.oddsToWin > 0) && <Compare category="Win Odds" value1={match.teams[0].oddsToWin} value2={match.teams[1].oddsToWin} isPercent value1back={match.teams[0].color} value2back={match.teams[1].color} />}
						</CardContent>
					</Card>
				</Grid>
			</Grid>
			<BackgroundWinnerIcon winner={match.teams[1].details.name === match.winner} />
			<Grid container item spacing={2}>
				{teams.map(team => (
					<Grid item xs={12} lg={teams.length === 1 ? 12 : 6}>
						<TeamTable team={team} match={match} onGamertagClick={onGamertagClick} selectedGamertag={myGamertag} />
					</Grid>
				))}
			</Grid>
		</>
	);
}