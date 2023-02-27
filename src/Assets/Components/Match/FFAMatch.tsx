import { Grid, Card, CardContent, Typography, LinearProgress } from "@mui/material";
import { Match } from "../../../Objects/Model/Match";
import { Compare } from "../Compare/Compare";
import { CompareHeader } from "../Compare/CompareHeader";
import { DynamicTeamCard } from "../TeamAppearance/TeamCard";
import { TeamTable } from "../../../Pages/Subpage/TeamTable";

import "../../Styles/Views/SingleMatch.css";
import { Team } from "../../../Objects/Pieces/Team";
import { DynamicPlayerCard } from "../PlayerAppearance/PlayerCard";
import { Player } from "../../../Objects/Model/Player";
import { useCallback, useEffect, useState } from "react";
import { SCData } from "../../../Database/SCData";
import { MatchPlayer } from "../../../Objects/Pieces/MatchPlayer";

export interface TeamsMatch
{
	app: SCData;
	match: Match;
	myGamertag?: string;
	onGamertagClick: (tag: string) => void;
}

export function FFAMatch(props: TeamsMatch)
{
	const { app, match, myGamertag, onGamertagClick } = props;

	const [myMatchPlayer, setMyMatchPlayer] = useState(new MatchPlayer());
	const [compareMatchPlayer, setCompareMatchPlayer] = useState(new MatchPlayer());
	const [myPlayer, setMyPlayer] = useState(new Player());
	const [comparePlayer, setComparePlayer] = useState(new Player());
	const [loadingPlayerAppearance, setLoadingPlayerAppearance] = useState(false);

	const loadData = useCallback(async () =>
	{
		setLoadingPlayerAppearance(true);

		const me = match.GetMyPlayer(myGamertag || "");
		const winner = match.GetWinningPlayer();
		const second = match.GetSecondPlacePlayer();

		const left = me.gamertag === "" ? winner : me;
		const right = me.gamertag === "" || me.gamertag === winner.gamertag ? second : winner;

		const [player1, player2] = await Promise.all([
			app.GetPlayerAppearanceOnly(left.gamertag),
			app.GetPlayerAppearanceOnly(right.gamertag)
		]);

		setMyMatchPlayer(left);
		setMyPlayer(player1);

		setCompareMatchPlayer(right);
		setComparePlayer(player2);

		setLoadingPlayerAppearance(false);

	}, [app, match, myGamertag, setMyPlayer, setComparePlayer, setLoadingPlayerAppearance]);

	useEffect(() =>
	{
		loadData();
	}, [match, myGamertag]);

	return (
		<>
			<Grid item sm={0} md={3} />
			<Grid container item spacing={2} xs={12} xl={6}>
				<Grid item xs={12}>
					<Card sx={{ height: "100%", width: "100%", borderRadius: 3 }}>
						<CardContent className="teamCompareSection">
							{loadingPlayerAppearance ? <LinearProgress variant="indeterminate" /> : 
								<CompareHeader stretch
									compare1={<DynamicPlayerCard player={myPlayer} topDown noMargin rightAlign />}
									compare2={<DynamicPlayerCard player={comparePlayer} topDown noMargin />}
								/>
							}
							<Compare category="Kills" value1={myMatchPlayer.stats.summary.kills} value2={compareMatchPlayer.stats.summary.kills} />
							<Compare category="Expected Kills" value1={myMatchPlayer.killExpectations.expected} value2={compareMatchPlayer.killExpectations.expected} />
							<Compare category="Assists" value1={myMatchPlayer.stats.summary.assists} value2={compareMatchPlayer.stats.summary.assists} />
							<Compare category="Deaths" value1={myMatchPlayer.stats.summary.deaths} value2={compareMatchPlayer.stats.summary.deaths} lessIsBetter />
							<Compare category="Damage" value1={myMatchPlayer.stats.damage.dealt} value2={compareMatchPlayer.stats.damage.dealt} />
							<Compare category="MMR" value1={myMatchPlayer.mmr} value2={compareMatchPlayer.mmr} />
						</CardContent>
					</Card>
				</Grid>
			</Grid>
			<Grid item sm={0} md={3} />
			<Grid container item spacing={2}>
				<Grid item xs={12}>
					<TeamTable team={new Team(undefined, undefined, match.players)} match={match} onGamertagClick={onGamertagClick} selectedGamertag={myGamertag} ffa />
				</Grid>
			</Grid>
		</>
	);
}