import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { ViewProps } from "./Props/ViewProps";
import { SRTabs } from "../Assets/Components/Layout/AHDrawer";
import { Leaderboard } from "../Database/ArrowheadFirebase";
import { Leader, LeaderboardAverages } from "../Objects/Model/Leader";
import { LeaderRanks } from "../Assets/Components/Ranks/LeaderRanks";
import { Timeline } from "@mui/lab";
import { TimelineEvent } from "../Assets/Components/Leaderboard/TimelineEvent";
import { LeaderboardChooser } from "../Assets/Components/Leaderboard/LeaderboardChooser";

export function LeaderboardView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, player, updatePlayer, switchTab } = props;
	const { category, gamertag } = useParams();
	//#endregion
	
	//#region State
	const [leaders, setLeaders] = useState<Leader[]>([]);
	const [myLeader, setMyLeader] = useState<Leader>();
	const [averages, setLeaderboardAverages] = useState<LeaderboardAverages>();
	//#endregion

	/**
	 * Determines if a string is a leaderboard category enum
	 * @param value the string to check
	 * @returns true if in enum
	 */
	const isLeaderboard = (value: string): value is Leaderboard => Object.values<string>(Leaderboard).includes(value);

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

	/**
	 * Determines if the category is a percent
	 * @param leaderboard the leaderboard
	 * @returns true if in percent value
	 */
	const isPercent = (leaderboard: Leaderboard): boolean => 
	{
		switch (leaderboard)
		{
			case Leaderboard.Accuracy: 
				return true;
			case Leaderboard.Assists: 
			case Leaderboard.AssistsPerGame: 
			case Leaderboard.Callouts: 
			case Leaderboard.Damage: 
			case Leaderboard.Deaths: 
			case Leaderboard.DeathsPerGame: 
			case Leaderboard.KDA: 
			case Leaderboard.KDR: 
			case Leaderboard.Kills: 
			case Leaderboard.KillsPerGame: 
			case Leaderboard.SpartanRank: 
			default: 
				return false;
		}
	};

	/**
	 * Determines if the my leader value is the same as the given value
	 * @param value the value to check
	 * @returns true if the same
	 */
	const isValue = (value: number): boolean => !!myLeader && myLeader.value === value;

	/**
	 * Determines if the my leader value is bounded by the two values provided
	 * @param low the low value
	 * @param high the high value
	 * @returns true if the bounded
	 */
	const bounded = (low: number, high: number): boolean => !!myLeader && myLeader.value > low && myLeader.value < high;

	const loadData = useCallback(async () => 
	{
		if (!category || !isLeaderboard(category)) { return; }

		// Set page gamertag and show loading message
		setLoadingMessage("Loading " + leaderboardName(category));
		
		// Get the player from firebase and show on screen
		setLeaders(await app.GetLeaderboard(category));
		setLeaderboardAverages(await app.GetLeaderboardAverages(category));

		// Update my leader if needed
		if (gamertag)
		{
			if (player && player.gamertag !== gamertag) { updatePlayer(gamertag); }
			setMyLeader(await app.GetLeader(category, gamertag));
		}

		setLoadingMessage("");
	}, [app, category, gamertag, player, setLoadingMessage, setLeaders, setLeaderboardAverages, setMyLeader]);
	
	useEffect(() =>
	{
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [category, gamertag]);

	const goToSR = useCallback((gamertag: string) =>
	{
		switchTab("service_record/" + gamertag, SRTabs.ServiceRecord);
	}, [switchTab]);

	return (
		<Box component="main" sx={{ flexGrow: 1 }}>
			<Helmet>
				<title>{"Spartan Record | Leaderboards"}</title>
				<meta name="description" content={`Halo Infinite leaderboards`} />
				<meta property="og:title" content="Spartan Record" />
            	<meta property="og:image" content="https://spartanrecord.com/images/banner.png" />
				<link rel="canonical" href={`https://spartanrecord.com/leaderboard`} />
			</Helmet>
			<Toolbar />
			<Divider />
			<Box sx={{ p: player ? 2 : 0, height: "calc(100% - 64px)" }}>
				<Grid container spacing={2}>
					{/* Top */}
					<Grid item xs={12}>
						<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
							<LeaderboardChooser setLeaderboard={(newLeaderboard: Leaderboard) => switchTab(`/leaderboard/${gamertag ?? "none"}/${newLeaderboard}`)} />
						</Box>
					</Grid>
					{category && isLeaderboard(category) &&
					<>
					<Grid item xs={12} lg={8}>
						<LeaderRanks leaders={leaders} category={leaderboardName(category)} goToMember={goToSR} myGamertag={player?.gamertag ?? ""} isPercent={isPercent(category)} />
					</Grid>
					<Grid item xs={12} lg={4}>
						{averages && 
						<Timeline sx={{ "li": { minHeight: "50px" }}}>
							{isValue(averages.max) 
								? <TimelineEvent label={`${myLeader!.gamertag} - Maximum`} value={averages.max} height={((averages.max - averages.q75) / averages.range) * 500} isPercent={isPercent(category)} isGood />
								: bounded(averages.q75, averages.max)
								? <TimelineEvent label="Maximum" value={averages.max} height={((averages.max - myLeader!.value) / averages.range) * 500} isPercent={isPercent(category)} />
								: <TimelineEvent label="Maximum" value={averages.max} height={((averages.max - averages.q75) / averages.range) * 500} isPercent={isPercent(category)} />
							}
							
							{bounded(averages.q75, averages.max) && <TimelineEvent label={myLeader!.gamertag} value={myLeader!.value} height={((myLeader!.value - averages.q75) / averages.range) * 500} isGood isPercent={isPercent(category)}/>}

							{isValue(averages.median) 
								? <TimelineEvent label={`${myLeader!.gamertag} - 75th Percentile`} value={averages.q75} height={((averages.q75 - averages.median) / averages.range) * 500} isPercent={isPercent(category)} isGood />
								: bounded(averages.median, averages.q75)
								? <TimelineEvent label="75th Percentile" value={averages.q75} height={((averages.q75 - myLeader!.value) / averages.range) * 500} isPercent={isPercent(category)} />
								: <TimelineEvent label="75th Percentile" value={averages.q75} height={((averages.q75 - averages.median) / averages.range) * 500} isPercent={isPercent(category)} />
							}
							
							{bounded(averages.median, averages.q75) && <TimelineEvent label={myLeader!.gamertag} value={myLeader!.value} height={((myLeader!.value - averages.median) / averages.range) * 500} isGood isPercent={isPercent(category)}/>}
							
							{isValue(averages.q25) 
								? <TimelineEvent label={`${myLeader!.gamertag} - 50th Percentile`} value={averages.median} height={((averages.median - averages.q25) / averages.range) * 500} isPercent={isPercent(category)} isGood />
								: bounded(averages.q25, averages.median)
								? <TimelineEvent label="50th Percentile" value={averages.median} height={((averages.median - myLeader!.value) / averages.range) * 500} isPercent={isPercent(category)} />
								: <TimelineEvent label="50th Percentile" value={averages.median} height={((averages.median - averages.q25) / averages.range) * 500} isPercent={isPercent(category)} />
							}
							
							{bounded(averages.q25, averages.median) && <TimelineEvent label={myLeader!.gamertag} value={myLeader!.value} height={((myLeader!.value - averages.q25) / averages.range) * 500} isGood isPercent={isPercent(category)}/>}
							
							{isValue(averages.min) 
								? <TimelineEvent label={`${myLeader!.gamertag} - 25th Percentile`} value={averages.q25} height={((averages.q25 - averages.min) / averages.range) * 500} isPercent={isPercent(category)} isGood />
								: bounded(averages.min, averages.q25)
								? <TimelineEvent label="25th Percentile" value={averages.q25} height={((averages.q25 - myLeader!.value) / averages.range) * 500} isPercent={isPercent(category)} />
								: <TimelineEvent label="25th Percentile" value={averages.q25} height={((averages.q25 - averages.min) / averages.range) * 500} isPercent={isPercent(category)} />
							}
							
							{bounded(averages.min, averages.q25) && <TimelineEvent label={myLeader!.gamertag} value={myLeader!.value} height={((myLeader!.value - averages.min) / averages.range) * 500} isGood isPercent={isPercent(category)}/>}
							<TimelineEvent label={isValue(averages.min) ? `${myLeader!.gamertag} - Minimum` : "Minimum"} value={averages.min} lastEvent isPercent={isPercent(category)} />
						</Timeline>}
					</Grid></>}
				</Grid>
			</Box>
		</Box>
	);
}