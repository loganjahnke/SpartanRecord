import { Grid, Card, CardContent, Typography } from "@mui/material";
import { Compare } from "../Compare/Compare";
import { CompareHeader } from "../Compare/CompareHeader";
import { DynamicTeamCard } from "../TeamAppearance/TeamCard";
import { TeamTable } from "../../../Pages/Subpage/TeamTable";
import { TeamsMatch } from "./MultiTeamMatch";

import "../../Styles/Views/SingleMatch.css";

export function TwoTeamsMatch(props: TeamsMatch)
{
	const { match, myGamertag, onGamertagClick } = props;

	return (
		<>
			<Grid item sm={0} md={3} />
			<Grid container item spacing={2} xs={12} xl={6}>
				<Grid item xs={12}>
					<Card sx={{ height: "100%", width: "100%", borderRadius: 3 }}>
						<CardContent className="teamCompareSection">
							<CompareHeader stretch
								compare1={<DynamicTeamCard team={match?.teams[0]} winner={match.teams[0].details.name === match.winner} topDown noMargin rightAlign />}
								compare2={<DynamicTeamCard team={match?.teams[1]} winner={match.teams[1].details.name === match.winner} topDown noMargin />}
								icon={<Typography variant="body1">vs</Typography>}
							/>
							<Compare category="Kills" value1={match.teams[0].statistics.summary.kills} value2={match.teams[1].statistics.summary.kills} value1back={match.teams[0].color} value2back={match.teams[1].color} />
							<Compare category="Damage" value1={match.teams[0].statistics.damage.dealt} value2={match.teams[1].statistics.damage.dealt} value1back={match.teams[0].color} value2back={match.teams[1].color} />
							<Compare category="MMR" value1={match.teams[0].mmr} value2={match.teams[1].mmr} value1back={match.teams[0].color} value2back={match.teams[1].color} />
							<Compare category="Win Odds" value1={match.teams[0].oddsToWin} value2={match.teams[1].oddsToWin} isPercent value1back={match.teams[0].color} value2back={match.teams[1].color} />
						</CardContent>
					</Card>
				</Grid>
			</Grid>
			<Grid item sm={0} md={3} />
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