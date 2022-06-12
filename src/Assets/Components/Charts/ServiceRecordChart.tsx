import { Bar, Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	BarElement,
  } from 'chart.js';

import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

enum HistoricDataSets
{
	WinRate = "Win Rate",
	KDA = "KDA",
	KDR = "KDR",
	Accuracy = "Accuracy",
	KillsPerGame = "Kills / Game",
	DeathsPerGame = "Deaths / Game",
	AssistsPerGame = "Assists / Game",
	DamagePerGame = "Damage / Game",
	Kills = "Kills (25 Game Block)",
	Deaths = "Deaths (25 Game Block)",
	Assists = "Assists (25 Game Block)",
	DamageEfficiency = "Damage Efficiency"
}

export const ServiceRecordChart = (props: { historicServiceRecords: ServiceRecord[], currentSR: ServiceRecord }) =>
{
	ChartJS.defaults.font.family = "Roboto";
	ChartJS.defaults.font.weight = "100";
	ChartJS.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		BarElement,
		Title,
		Tooltip,
		Legend
	);

	const { historicServiceRecords, currentSR } = props;
	const allSRs = historicServiceRecords.concat(currentSR);
	const dataSet = useRef<HistoricDataSets>(HistoricDataSets.WinRate);
	const [options, setOptions] = useState<any>({
		responsive: true,
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
			xAxis: {
				display: true,
				title: {
					padding: 15,
					display: true,
					text: "Matches Played"
				}
			},
			yAxis: {
				grid: {
					display: false,
					drawTicks: false,
					drawBorder: false
				},
				ticks: {
					padding: 15
				},
				title: {
					display: true,
					text: dataSet.current
				},
			}
		}
	});
	
	const [chartData, setChartData] = useState<any>({
		labels: historicServiceRecords.map(sr => sr.matchesPlayed),
		datasets: [
			{
				backgroundColor: ArrowheadTheme.text_secondary,
				borderColor: ArrowheadTheme.text_secondary,
				data: historicServiceRecords.map(sr => sr.winRate)
			}
		]
	});

	/**
	 * Changes the data set
	 * @param event the event containing the new data set
	 */
	const changeDataSet = useCallback((event?: SelectChangeEvent): void =>
	{
		const newDataSet = event?.target.value as HistoricDataSets ?? HistoricDataSets.WinRate;
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
				xAxis: {
					display: true,
					title: {
						padding: 15,
						display: true,
						text: "Matches Played"
					}
				},
				yAxis: {
					grid: {
						display: false,
						drawTicks: false,
						drawBorder: false
					},
					ticks: {
						padding: 15
					},
					title: {
						display: true,
						text: dataSet.current
					},
				}
			}
		});

		setChartData({
			labels: allSRs.map(sr => sr.matchesPlayed),
			datasets: [
				{
					backgroundColor: ArrowheadTheme.text_secondary,
					borderColor: ArrowheadTheme.text_secondary,
					data: allSRs.map((sr, index) => 
					{
						switch (dataSet.current)
						{
							case HistoricDataSets.WinRate: return sr.winRate;
							case HistoricDataSets.KDA: return sr.kda;
							case HistoricDataSets.KDR: return sr.kdr;
							case HistoricDataSets.Accuracy: return sr.shots.accuracy;
							case HistoricDataSets.KillsPerGame: return sr.summary.kills / sr.matchesPlayed;
							case HistoricDataSets.DeathsPerGame: return sr.summary.deaths / sr.matchesPlayed;
							case HistoricDataSets.AssistsPerGame: return sr.summary.assists / sr.matchesPlayed;
							case HistoricDataSets.DamagePerGame: return sr.damage.dealt / sr.matchesPlayed;
							case HistoricDataSets.Kills: return index === 0 ? sr.summary.kills : sr.summary.kills - allSRs[index - 1].summary.kills;
							case HistoricDataSets.Deaths: return index === 0 ? sr.summary.deaths : sr.summary.deaths - allSRs[index - 1].summary.deaths;
							case HistoricDataSets.Assists: return index === 0 ? sr.summary.assists : sr.summary.assists - allSRs[index - 1].summary.assists;
							case HistoricDataSets.DamageEfficiency: return sr.damageEfficiency;
							default: return sr.kda;
						}
					}),
				}
			]
		});
	}, [allSRs]);

	const initialChartData = {
		labels: historicServiceRecords.map(sr => sr.matchesPlayed),
		datasets: [
			{
				backgroundColor: ArrowheadTheme.text_secondary,
				borderColor: ArrowheadTheme.text_secondary,
				data: historicServiceRecords.map(sr => sr.winRate)
			}
		]
	};

	useEffect(() => 
	{
		changeDataSet();
	}, [historicServiceRecords]);
	
	return (
		allSRs.length > 2 
			?
			<Box sx={{ backgroundColor: "divider", borderRadius: 3, pt: 2 }}>
				<Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
					<FormControl size="small" sx={{ minWidth: "125px" }}>
						<InputLabel id="data-set-label">Data Set</InputLabel>
						<Select labelId="data-set-label" id="data-set" value={dataSet.current} label="Data Set" onChange={changeDataSet}>
							<MenuItem value={HistoricDataSets.WinRate}>{HistoricDataSets.WinRate}</MenuItem>
							<MenuItem value={HistoricDataSets.KDA}>{HistoricDataSets.KDA}</MenuItem>
							<MenuItem value={HistoricDataSets.KDR}>{HistoricDataSets.KDR}</MenuItem>
							<MenuItem value={HistoricDataSets.Accuracy}>{HistoricDataSets.Accuracy}</MenuItem>
							<MenuItem value={HistoricDataSets.KillsPerGame}>{HistoricDataSets.KillsPerGame}</MenuItem>
							<MenuItem value={HistoricDataSets.DeathsPerGame}>{HistoricDataSets.DeathsPerGame}</MenuItem>
							<MenuItem value={HistoricDataSets.AssistsPerGame}>{HistoricDataSets.AssistsPerGame}</MenuItem>
							<MenuItem value={HistoricDataSets.DamagePerGame}>{HistoricDataSets.DamagePerGame}</MenuItem>
							<MenuItem value={HistoricDataSets.Kills}>{HistoricDataSets.Kills}</MenuItem>
							<MenuItem value={HistoricDataSets.Deaths}>{HistoricDataSets.Deaths}</MenuItem>
							<MenuItem value={HistoricDataSets.Assists}>{HistoricDataSets.Assists}</MenuItem>
							<MenuItem value={HistoricDataSets.DamageEfficiency}>{HistoricDataSets.DamageEfficiency}</MenuItem>
						</Select>
					</FormControl>
				</Box>
				<Box sx={{ height: "300px" }}>
					{dataSet.current === HistoricDataSets.Kills || dataSet.current === HistoricDataSets.Deaths || dataSet.current === HistoricDataSets.Assists
						? <Bar options={options} data={chartData.labels.length === 0 ? initialChartData : chartData} />
						: <Line options={options} data={chartData.labels.length === 0 ? initialChartData : chartData} />
					}
				</Box>
			</Box>
			: 
			<Box sx={{ p: 2, backgroundColor: "divider", borderRadius: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
				<Typography variant="body1">Not enough data to show historic records.</Typography>
			</Box>
	);
}