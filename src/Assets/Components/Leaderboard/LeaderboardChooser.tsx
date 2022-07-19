import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { Leaderboard } from "../../../Database/ArrowheadFirebase";

interface LeaderboardChooserProps
{
	setLeaderboard: (leaderboard: Leaderboard) => void;
}

export function LeaderboardChooser(props: LeaderboardChooserProps)
{
	const { setLeaderboard } = props;
	const [category, chooseCategory] = useState<HTMLElement>((-1 as unknown as HTMLElement));

	/**
	 * When the select is changed
	 * @param event event
	 */
	function handleCategoryChange(event: SelectChangeEvent<HTMLElement>)
	{
		const element = event.target.value as HTMLElement;
		if (element)
		{
			chooseCategory(element);
			setLeaderboard(element as any as Leaderboard);
		}
	}

	/**
	 * Gets the leaderboard display name
	 * @param leaderboard the leaderboard category
	 * @returns the display name
	 */
	const leaderboardName = (leaderboard: Leaderboard): string => 
	{
		switch (leaderboard)
		{
			case Leaderboard.Accuracy: return "Accuracy";
			case Leaderboard.Assists: return "Assists";
			case Leaderboard.AssistsPerGame: return "Assists / Game";
			case Leaderboard.Callouts: return "Callouts";
			case Leaderboard.Damage: return "Damage";
			case Leaderboard.Deaths: return "Deaths";
			case Leaderboard.DeathsPerGame: return "Deaths / Game";
			case Leaderboard.KDA: return "KDA";
			case Leaderboard.KDR: return "KDR";
			case Leaderboard.Kills: return "Kills";
			case Leaderboard.KillsPerGame: return "Kills / Game";
			case Leaderboard.SpartanRank: return "Spartan Rank";
			default: return "CSR";
		}
	};

	return (
		<FormControl size="small" sx={{ minWidth: "150px" }}>
			<InputLabel>Leaderboard</InputLabel>
			<Select value={category} label="Leaderboard" onChange={handleCategoryChange}>
				<MenuItem value={Leaderboard.Accuracy}>{leaderboardName(Leaderboard.Accuracy)}</MenuItem>
				<MenuItem value={Leaderboard.Assists}>{leaderboardName(Leaderboard.Assists)}</MenuItem>
				<MenuItem value={Leaderboard.AssistsPerGame}>{leaderboardName(Leaderboard.AssistsPerGame)}</MenuItem>
				<MenuItem value={Leaderboard.Callouts}>{leaderboardName(Leaderboard.Callouts)}</MenuItem>
				<MenuItem value={Leaderboard.Damage}>{leaderboardName(Leaderboard.Damage)}</MenuItem>
				<MenuItem value={Leaderboard.Deaths}>{leaderboardName(Leaderboard.Deaths)}</MenuItem>
				<MenuItem value={Leaderboard.DeathsPerGame}>{leaderboardName(Leaderboard.DeathsPerGame)}</MenuItem>
				<MenuItem value={Leaderboard.KDA}>{leaderboardName(Leaderboard.KDA)}</MenuItem>
				<MenuItem value={Leaderboard.KDR}>{leaderboardName(Leaderboard.KDR)}</MenuItem>
				<MenuItem value={Leaderboard.Kills}>{leaderboardName(Leaderboard.Kills)}</MenuItem>
				<MenuItem value={Leaderboard.KillsPerGame}>{leaderboardName(Leaderboard.KillsPerGame)}</MenuItem>
				<MenuItem value={Leaderboard.SpartanRank}>{leaderboardName(Leaderboard.SpartanRank)}</MenuItem>
			</Select>
		</FormControl>
	);
}