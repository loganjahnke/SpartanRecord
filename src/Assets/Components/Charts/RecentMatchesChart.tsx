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

enum RecentMatchesDataSets
{
	WinLoss = "Win / Loss",
	KDA = "KDA",
	KDR = "KDR",
	Kills = "Kills",
	Deaths = "Deaths",
	Assists = "Assists"
}

enum ChartType
{
	Bar = "Bar",
	Line = "Line"
}

export const RecentMatchesChart = (props: { matches: PlayerMatch[] }) =>
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

	const { matches } = props;
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
							return context.tick.value === 0 ? "white" : "transparent"
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

		setChartData({
			labels: matches.map((_, index) => index + 1),
			datasets: [
				{
					backgroundColor: matches.map(match => 
					{
						switch (dataSet.current)
						{
							case RecentMatchesDataSets.WinLoss: return match.player.won ? ArrowheadTheme.good : ArrowheadTheme.bad;
							case RecentMatchesDataSets.KDA: return match.player.kda > 0 ? ArrowheadTheme.good : ArrowheadTheme.bad;
							case RecentMatchesDataSets.KDR: return match.player.kdr > 1 ? ArrowheadTheme.good : ArrowheadTheme.bad;
							case RecentMatchesDataSets.Kills: return match.player.kills ? ArrowheadTheme.good : ArrowheadTheme.bad;
							case RecentMatchesDataSets.Deaths: return match.player.deaths ? ArrowheadTheme.good : ArrowheadTheme.bad;
							case RecentMatchesDataSets.Assists: return match.player.assists ? ArrowheadTheme.good : ArrowheadTheme.bad;
							default: return match.player.won ? ArrowheadTheme.good : ArrowheadTheme.bad;
						}
					}),
					borderColor: ArrowheadTheme.text_secondary,
					data: matches.map(match => 
					{
						switch (dataSet.current)
						{
							case RecentMatchesDataSets.WinLoss: return match.player.won ? 1 : -1;
							case RecentMatchesDataSets.KDA: return match.player.kda;
							case RecentMatchesDataSets.KDR: return match.player.kdr;
							case RecentMatchesDataSets.Kills: return match.player.kills;
							case RecentMatchesDataSets.Deaths: return match.player.deaths;
							case RecentMatchesDataSets.Assists: return match.player.assists;
							default: return match.player.won ? 1 : -1;
						}
					}),
				}
			]
		});
	}, [matches]);

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
	}, [matches]);
	
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
							<MenuItem value={RecentMatchesDataSets.KDA}>{RecentMatchesDataSets.KDA}</MenuItem>
							<MenuItem value={RecentMatchesDataSets.KDR}>{RecentMatchesDataSets.KDR}</MenuItem>
							<MenuItem value={RecentMatchesDataSets.Kills}>{RecentMatchesDataSets.Kills}</MenuItem>
							<MenuItem value={RecentMatchesDataSets.Deaths}>{RecentMatchesDataSets.Deaths}</MenuItem>
							<MenuItem value={RecentMatchesDataSets.Assists}>{RecentMatchesDataSets.Assists}</MenuItem>
						</Select>
					</FormControl>
					{dataSet.current !== RecentMatchesDataSets.WinLoss && 
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
					<Box sx={{ width: dataSet.current !== RecentMatchesDataSets.WinLoss ? "calc(50% - 266px)" : "calc(50% - 125px)" }} />
				</Box>
				<Box sx={{ height: "300px" }}>
					{(dataSet.current === RecentMatchesDataSets.WinLoss || chartType === ChartType.Bar) && <Bar options={options} data={chartData.labels.length === 0 ? initialChartData : chartData} />}
					{dataSet.current !== RecentMatchesDataSets.WinLoss && chartType === ChartType.Line && <Line options={options} data={chartData.labels.length === 0 ? initialChartData : chartData} />}
				</Box>
			</Box>
			: 
			<Box sx={{ p: 2, backgroundColor: "divider", borderRadius: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
				<Typography variant="body1">Not enough matches to show match history chart.</Typography>
			</Box>
	);
}