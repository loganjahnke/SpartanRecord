import { Grid, Card, CardContent, Typography, LinearProgress } from "@mui/material";
import { Match } from "../../../Objects/Model/Match";
import { Compare } from "../Compare/Compare";
import { CompareHeader } from "../Compare/CompareHeader";
import { TeamTable } from "../../../Pages/Subpage/TeamTable";
import { Team } from "../../../Objects/Pieces/Team";
import { DynamicPlayerCard } from "../PlayerAppearance/PlayerCard";
import { Player } from "../../../Objects/Model/Player";
import { useCallback, useEffect, useState } from "react";
import { SCData } from "../../../Database/SCData";
import { MatchPlayer } from "../../../Objects/Pieces/MatchPlayer";
import { MatchTitleCard } from "./MatchTitleCard";
import { BackgroundWinnerIcon } from "./BackgroundWinnerIcon";

import "../../Styles/Views/SingleMatch.css";

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [match, myGamertag]);

	return (
		<>
			<BackgroundWinnerIcon winner={myMatchPlayer.gamertag === match.winner} />
			<Grid container item sx={{ zIndex: 5 }} spacing={2} xs={12} xl={6}>
				<Grid item xs={12}>
					<Card sx={{ height: "100%", width: "100%", borderRadius: 3 }}>
						<CardContent className="teamCompareSection">
							{loadingPlayerAppearance ? <LinearProgress variant="indeterminate" /> : 
								<CompareHeader stretch
									compare1={<DynamicPlayerCard player={myPlayer} winner={myMatchPlayer.gamertag === match.winner} topDown noMargin rightAlign />}
									compare2={<DynamicPlayerCard player={comparePlayer} winner={comparePlayer.gamertag === match.winner} topDown noMargin />}
									icon={<Typography variant="body1">vs</Typography>}
									backgroundURL={`url(${match.map.asset.thumbnail})`}
									subtitle={<MatchTitleCard match={match} />}
								/>
							}
							{match.showPoints && <Compare category="Points" value1={myMatchPlayer.stats.totalPoints} value2={compareMatchPlayer.stats.totalPoints} />}
							<Compare category="Kills" value1={myMatchPlayer.stats.summary.kills} value2={compareMatchPlayer.stats.summary.kills} />
							{ myMatchPlayer.killExpectations.expected !== -1 && compareMatchPlayer.killExpectations.expected !== -1 &&
								<Compare category="Expected Kills" value1={myMatchPlayer.killExpectations.expected} value2={compareMatchPlayer.killExpectations.expected} />
							}
							<Compare category="Assists" value1={myMatchPlayer.stats.summary.assists} value2={compareMatchPlayer.stats.summary.assists} />
							<Compare category="Deaths" value1={myMatchPlayer.stats.summary.deaths} value2={compareMatchPlayer.stats.summary.deaths} lessIsBetter />
							<Compare category="Damage" value1={myMatchPlayer.stats.damage.dealt} value2={compareMatchPlayer.stats.damage.dealt} />
							{ myMatchPlayer.mmr !== 0 && compareMatchPlayer.mmr !== 0 &&
								<Compare category="MMR" value1={myMatchPlayer.mmr} value2={compareMatchPlayer.mmr} />
							}
						</CardContent>
					</Card>
				</Grid>
			</Grid>
			<BackgroundWinnerIcon winner={compareMatchPlayer.gamertag === match.winner} />
			<Grid container item spacing={2}>
				<Grid item xs={12}>
					<TeamTable team={new Team(undefined, undefined, match.players)} match={match} onGamertagClick={onGamertagClick} selectedGamertag={myGamertag} ffa />
				</Grid>
			</Grid>
		</>
	);
}