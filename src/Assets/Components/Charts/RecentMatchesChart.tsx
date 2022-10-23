import { Bar, Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	Title,
	Tooltip,
	Legend,
	BarElement,
	LineElement,
  } from 'chart.js';

import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { PlayerMatch } from "../../../Objects/Model/PlayerMatch";
import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";

enum RecentMatchesDataSets
{
	WinLoss = "Win / Loss",
	CSRRankedArenaController = "CSR Arena Controller",
	CSRRankedArenaMnK = "CSR Arena MnK",
	CSRRankedArenaOpen = "CSR Arena Open",
	CSRDoubles = "CSR Doubles",
	CSRFFA = "CSR FFA",
	KDA = "KDA",
	KDR = "KDR",
	Kills = "Kills",
	Deaths = "Deaths",
	Assists = "Assists",
	Damage = "Damage",
	DamageEfficiency = "Damage Efficiency",
	EnemyEfficiency = "Enemy Efficiency",
	Accuracy = "Accuracy"
}

enum ChartType
{
	Bar = "Bar",
	Line = "Line"
}

export const RecentMatchesChart = (props: { matches: PlayerMatch[], sr: ServiceRecord, openMatch: (matchID: string) => void }) =>
{
	ChartJS.defaults.color = "#DDDDDD";
	ChartJS.defaults.font.family = "Roboto";
	ChartJS.defaults.font.weight = "100";
	ChartJS.register(
		CategoryScale,
		LinearScale,
		PointElement,
		BarElement,
		LineElement,
		Title,
		Tooltip,
		Legend
	);

	const { matches, sr, openMatch } = props;
	const dataSet = useRef<RecentMatchesDataSets>(RecentMatchesDataSets.WinLoss);
	const [chartType, setChartType] = useState(ChartType.Bar);
	const [options, setOptions] = useState<any>({
		responsive: true
	});
	
	const [chartData, setChartData] = useState<any>({
		labels: [],
		datasets: []
	});

	/**
	 * Changes the data set
	 * @param event the event containing the new data set
	 */
	const changeChartType = useCallback((event?: SelectChangeEvent): void =>
	{
		setChartType(event?.target.value as ChartType ?? ChartType.Bar);
	}, [setChartType]);

	/**
	 * Changes the data set
	 * @param event the event containing the new data set
	 */
	const changeDataSet = useCallback((event?: SelectChangeEvent): void =>
	{
		const newDataSet = event?.target.value as RecentMatchesDataSets ?? RecentMatchesDataSets.WinLoss;
		if (event && dataSet.current === newDataSet) { return; }
		dataSet.current = newDataSet;

		setOptions({
			responsive: true,
			maintainAspectRatio: false,
			onClick: (event: any, item: any) =>
			{
				if (item && item.length > 0 && item[0].index !== undefined)
				{
					openMatch(matches[item[0].index].id);
				}
			},
			plugins: {
				legend: {
					display: false,
					position: "top" as const,
				},
				title: {
					display: false,
					text: dataSet.current,
				}
			},
			elements: {
				line: {
					tension: 0.2
				}
			},
			layout: {
				padding: 20
			},
			scales: {
				x: {
					display: true,
					title: {
						padding: 15,
						display: true,
						text: "Matches Ago"
					},
					grid: {
						display: false
					}
				},
				y: {
					grid: {
						color: function(context: any)
						{
							if (context.tick.value === 0) { return ArrowheadTheme.text_primary; }
							switch (dataSet.current)
							{
								case RecentMatchesDataSets.WinLoss: break;
								case RecentMatchesDataSets.KDA: 
									if (context.tick.value === sr.kda) { return ArrowheadTheme.selected; }
									break;
								case RecentMatchesDataSets.KDR: 
									if (context.tick.value === sr.kdr) { return ArrowheadTheme.selected; }
									break;
								case RecentMatchesDataSets.Kills: 
									if (context.tick.value === sr.killsPerGame) { return ArrowheadTheme.selected; }
									break;
								case RecentMatchesDataSets.Deaths: 
									if (context.tick.value === sr.deathsPerGame) { return ArrowheadTheme.selected; }
									break;
								case RecentMatchesDataSets.Assists: 
									if (context.tick.value === sr.assistsPerGame) { return ArrowheadTheme.selected; }
									break;
								case RecentMatchesDataSets.Damage: 
									if (context.tick.value === sr.damagePerGame) { return ArrowheadTheme.selected; }
									break;
								case RecentMatchesDataSets.Damage: 
									if (context.tick.value === sr.damageEfficiency) { return ArrowheadTheme.selected; }
									break;
								case RecentMatchesDataSets.Damage: 
									if (context.tick.value === sr.enemyDamageEfficiency) { return ArrowheadTheme.selected; }
									break;
								case RecentMatchesDataSets.Accuracy: 
									if (context.tick.value === sr.shots.accuracy) { return ArrowheadTheme.selected; }
									break;
								default: return "transparent";
							}

							return "transparent";
						},
						display: true,
						drawBorder: false,
						lineWidth: 0.5
					},
					ticks: {
						padding: 15,
						callback: function(value: any, index: any, ticks: any) 
						{
							if (dataSet.current === RecentMatchesDataSets.WinLoss)
							{
								if (value === 0.6) { return "Win"; }
								if (value === -0.6) { return "Loss"; }
								return "";
							}
							return value % 1 === 0 ? value : "";
						}
					},
					title: {
						display: true,
						text: dataSet.current
					},
				}
			}
		});

		let label = "";
		switch (dataSet.current)
		{
			case RecentMatchesDataSets.WinLoss: label = "Win"; break;
			case RecentMatchesDataSets.CSRRankedArenaController: label = RecentMatchesDataSets.CSRRankedArenaController; break;
			case RecentMatchesDataSets.CSRRankedArenaMnK: label = RecentMatchesDataSets.CSRRankedArenaMnK; break;
			case RecentMatchesDataSets.CSRRankedArenaOpen: label = RecentMatchesDataSets.CSRRankedArenaOpen; break;
			case RecentMatchesDataSets.CSRDoubles: label = RecentMatchesDataSets.CSRDoubles; break;
			case RecentMatchesDataSets.CSRFFA: label = RecentMatchesDataSets.CSRFFA; break;
			case RecentMatchesDataSets.KDA: label = "KDA"; break;
			case RecentMatchesDataSets.KDR: label = "KDR"; break;
			case RecentMatchesDataSets.Kills: label = "Kills"; break;
			case RecentMatchesDataSets.Deaths: label = "Deaths"; break;
			case RecentMatchesDataSets.Assists: label = "Assists"; break;
			case RecentMatchesDataSets.Damage: label = "Damage"; break;
			case RecentMatchesDataSets.DamageEfficiency: label = "Damage Efficiency"; break;
			case RecentMatchesDataSets.EnemyEfficiency: label = "Enemy Efficiency"; break;
			case RecentMatchesDataSets.Accuracy: label = "Accuracy"; break;
			default: label = ""; break;
		}

		setChartData({
			labels: matches.map((_, index) => index + 1),
			datasets: [
				{
					label: label,
					backgroundColor: matches.map(match => 
					{
						switch (dataSet.current)
						{
							case RecentMatchesDataSets.WinLoss: return match.player.won ? ArrowheadTheme.good : ArrowheadTheme.bad;
							case RecentMatchesDataSets.KDA: return match.player.kda > sr.kda ? ArrowheadTheme.good : ArrowheadTheme.bad;
							case RecentMatchesDataSets.KDR: return match.player.kdr > sr.kdr ? ArrowheadTheme.good : ArrowheadTheme.bad;
							case RecentMatchesDataSets.Kills: return match.player.summary.kills > sr.killsPerGame ? ArrowheadTheme.good : ArrowheadTheme.bad;
							case RecentMatchesDataSets.Deaths: return match.player.summary.deaths > sr.deathsPerGame ? ArrowheadTheme.good : ArrowheadTheme.bad;
							case RecentMatchesDataSets.Assists: return match.player.summary.assists > sr.assistsPerGame ? ArrowheadTheme.good : ArrowheadTheme.bad;
							case RecentMatchesDataSets.Damage: return match.player.damage.dealt > sr.damagePerGame ? ArrowheadTheme.good : ArrowheadTheme.bad;
							case RecentMatchesDataSets.DamageEfficiency: 
								return match.player.damageEfficiency >= 0.8 
									? ArrowheadTheme.good 
									: match.player.damageEfficiency >= 0.7
									? ArrowheadTheme.halo_sunshine
									: ArrowheadTheme.bad;
							case RecentMatchesDataSets.EnemyEfficiency: 
								return match.player.enemyDamageEfficiency >= 0.8 
									? ArrowheadTheme.bad 
									: match.player.enemyDamageEfficiency >= 0.7
									? ArrowheadTheme.halo_sunshine
									: ArrowheadTheme.good;
							case RecentMatchesDataSets.Accuracy: return match.player.shots.accuracy > sr.shots.accuracy ? ArrowheadTheme.good : ArrowheadTheme.bad;
							default: return match.player.won ? ArrowheadTheme.good : ArrowheadTheme.bad;
						}
					}),
					borderColor: ArrowheadTheme.text_secondary,
					data: matches.map(match => 
					{
						switch (dataSet.current)
						{
							case RecentMatchesDataSets.WinLoss: return match.player.won ? 1 : -1;
							//queue: "open" | "solo-duo" | null;
						    //input: "controller" | "mnk" | "crossplay" | null;
							case RecentMatchesDataSets.CSRRankedArenaController: return match.playlist.queue === "solo-duo" && match.playlist.input === "controller" && match.playlist.name.includes("Arena") ? match.player.csr.post.value : undefined;
							case RecentMatchesDataSets.CSRRankedArenaMnK: return match.playlist.queue === "solo-duo" && match.playlist.input === "mnk" && match.playlist.name.includes("Arena") ? match.player.csr.post.value : undefined;
							case RecentMatchesDataSets.CSRRankedArenaOpen: return match.playlist.queue === "open" && match.playlist.input === "crossplay" && match.playlist.name.includes("Arena") ? match.player.csr.post.value : undefined;
							case RecentMatchesDataSets.CSRDoubles: return match.playlist.queue === "open" && match.playlist.input === "crossplay" && match.playlist.name.includes("Doubles") ? match.player.csr.post.value : undefined;
							case RecentMatchesDataSets.CSRFFA: return match.playlist.queue === "open" && match.playlist.input === "crossplay" && match.playlist.name.includes("FFA") ? match.player.csr.post.value : undefined;
							case RecentMatchesDataSets.KDA: return match.player.kda;
							case RecentMatchesDataSets.KDR: return match.player.kdr;
							case RecentMatchesDataSets.Kills: return match.player.summary.kills;
							case RecentMatchesDataSets.Deaths: return match.player.summary.deaths;
							case RecentMatchesDataSets.Assists: return match.player.summary.assists;
							case RecentMatchesDataSets.Damage: return match.player.damage.dealt;
							case RecentMatchesDataSets.DamageEfficiency: return Math.round(match.player.damageEfficiency * 100);
							case RecentMatchesDataSets.EnemyEfficiency: return Math.round(match.player.enemyDamageEfficiency * 100);
							case RecentMatchesDataSets.Accuracy: return match.player.shots.accuracy;
							default: return match.player.won ? 1 : -1;
						}
					}),
				}
			]
		});
	}, [matches, openMatch, sr]);

	const initialChartData = {
		labels: matches.map((_, index) => matches.length - index),
		datasets: [
			{
				backgroundColor: ArrowheadTheme.text_secondary,
				borderColor: ArrowheadTheme.text_secondary,
				data: matches.map(match => match.player.won ? 1 : -1)
			}
		]
	};

	useEffect(() => 
	{
		changeDataSet();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [matches]);

	/** Is a CSR category? */
	const isCSR = () => dataSet.current === RecentMatchesDataSets.CSRRankedArenaOpen || 
		dataSet.current === RecentMatchesDataSets.CSRRankedArenaController || 
		dataSet.current === RecentMatchesDataSets.CSRRankedArenaMnK || 
		dataSet.current === RecentMatchesDataSets.CSRDoubles || 
		dataSet.current === RecentMatchesDataSets.CSRFFA;
	
	return (
		matches.length > 2 
			?
			<Box sx={{ backgroundColor: "divider", borderRadius: 3, pt: 2 }}>
				<Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
					<Box sx={{ width: "calc(50% - 125px)" }} />
					<FormControl size="small" sx={{ minWidth: "125px" }}>
						<InputLabel id="data-set-label">Data Set</InputLabel>
						<Select labelId="data-set-label" id="data-set" value={dataSet.current} label="Data Set" onChange={changeDataSet}>
							<MenuItem value={RecentMatchesDataSets.WinLoss}>{RecentMatchesDataSets.WinLoss}</MenuItem>
							<MenuItem value={RecentMatchesDataSets.CSRRankedArenaOpen}>{RecentMatchesDataSets.CSRRankedArenaOpen}</MenuItem>
							<MenuItem value={RecentMatchesDataSets.CSRRankedArenaController}>{RecentMatchesDataSets.CSRRankedArenaController}</MenuItem>
							<MenuItem value={RecentMatchesDataSets.CSRRankedArenaMnK}>{RecentMatchesDataSets.CSRRankedArenaMnK}</MenuItem>
							<MenuItem value={RecentMatchesDataSets.CSRDoubles}>{RecentMatchesDataSets.CSRDoubles}</MenuItem>
							<MenuItem value={RecentMatchesDataSets.CSRFFA}>{RecentMatchesDataSets.CSRFFA}</MenuItem>
							<MenuItem value={RecentMatchesDataSets.KDA}>{RecentMatchesDataSets.KDA}</MenuItem>
							<MenuItem value={RecentMatchesDataSets.KDR}>{RecentMatchesDataSets.KDR}</MenuItem>
							<MenuItem value={RecentMatchesDataSets.Kills}>{RecentMatchesDataSets.Kills}</MenuItem>
							<MenuItem value={RecentMatchesDataSets.Deaths}>{RecentMatchesDataSets.Deaths}</MenuItem>
							<MenuItem value={RecentMatchesDataSets.Assists}>{RecentMatchesDataSets.Assists}</MenuItem>
							<MenuItem value={RecentMatchesDataSets.Damage}>{RecentMatchesDataSets.Damage}</MenuItem>
							<MenuItem value={RecentMatchesDataSets.DamageEfficiency}>{RecentMatchesDataSets.DamageEfficiency}</MenuItem>
							<MenuItem value={RecentMatchesDataSets.EnemyEfficiency}>{RecentMatchesDataSets.EnemyEfficiency}</MenuItem>
							<MenuItem value={RecentMatchesDataSets.Accuracy}>{RecentMatchesDataSets.Accuracy}</MenuItem>
						</Select>
					</FormControl>
					{dataSet.current !== RecentMatchesDataSets.WinLoss && !isCSR() && 
						<>
							<Box sx={{ width: "16px" }} />
							<FormControl size="small" sx={{ minWidth: "125px" }}>
								<InputLabel id="chart-type-label">Chart Type</InputLabel>
								<Select labelId="chart-type-label" id="chart-type" value={chartType} label="Chart Type" onChange={changeChartType}>
									<MenuItem value={ChartType.Bar}>{ChartType.Bar}</MenuItem>
									<MenuItem value={ChartType.Line}>{ChartType.Line}</MenuItem>
								</Select>
							</FormControl>
						</>
					}
					<Box sx={{ width: (dataSet.current !== RecentMatchesDataSets.WinLoss && !isCSR()) ? "calc(50% - 266px)" : "calc(50% - 125px)" }} />
				</Box>
				<Box sx={{ height: "300px" }}>
					{(dataSet.current === RecentMatchesDataSets.WinLoss || (!isCSR() && chartType === ChartType.Bar)) && <Bar options={options} data={chartData.labels.length === 0 ? initialChartData : chartData} />}
					{(isCSR() || (dataSet.current !== RecentMatchesDataSets.WinLoss && chartType === ChartType.Line)) && <Line options={options} data={chartData.labels.length === 0 ? initialChartData : chartData} />}
				</Box>
			</Box>
			: 
			<Box sx={{ p: 2, backgroundColor: "divider", borderRadius: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
				<Typography variant="body1">Not enough matches to show match history chart.</Typography>
			</Box>
	);
}