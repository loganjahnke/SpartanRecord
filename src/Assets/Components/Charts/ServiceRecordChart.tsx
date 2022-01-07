import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
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
	KillsPerGame = "Kills / Game",
	DeathsPerGame = "Deaths / Game",
	AssistsPerGame = "Assists / Game"
}

export const ServiceRecordChart = (props: { historicServiceRecords: ServiceRecord[] }) =>
{
	ChartJS.defaults.font.family = "Roboto";
	ChartJS.defaults.font.weight = "100";
	ChartJS.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Legend
	);

	const { historicServiceRecords } = props;
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
	function changeDataSet(event: SelectChangeEvent): void
	{
		const newDataSet = event.target.value as HistoricDataSets;
		if (dataSet.current === newDataSet) { return; }
		dataSet.current = newDataSet;

		setOptions({
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

		setChartData({
			labels: historicServiceRecords.map(sr => sr.matchesPlayed),
			datasets: [
				{
					backgroundColor: ArrowheadTheme.text_secondary,
					borderColor: ArrowheadTheme.text_secondary,
					data: historicServiceRecords.map(sr => 
					{
						switch (dataSet.current)
						{
							case HistoricDataSets.WinRate: return sr.winRate;
							case HistoricDataSets.KDA: return sr.kda;
							case HistoricDataSets.KDR: return sr.kdr;
							case HistoricDataSets.KillsPerGame: return sr.summary.kills / sr.matchesPlayed;
							case HistoricDataSets.DeathsPerGame: return sr.summary.deaths / sr.matchesPlayed;
							case HistoricDataSets.AssistsPerGame: return sr.summary.assists / sr.matchesPlayed;
						}
					}),
				}
			]
		});
	}

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
	
	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, pt: 2 }}>
			<Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
				<FormControl size="small" sx={{ minWidth: "125px" }}>
					<InputLabel id="data-set-label">Data Set</InputLabel>
					<Select labelId="data-set-label" id="data-set" value={dataSet.current} label="Data Set" onChange={changeDataSet}>
						<MenuItem value={HistoricDataSets.WinRate}>{HistoricDataSets.WinRate}</MenuItem>
						<MenuItem value={HistoricDataSets.KDA}>{HistoricDataSets.KDA}</MenuItem>
						<MenuItem value={HistoricDataSets.KDR}>{HistoricDataSets.KDR}</MenuItem>
						<MenuItem value={HistoricDataSets.KillsPerGame}>{HistoricDataSets.KillsPerGame}</MenuItem>
						<MenuItem value={HistoricDataSets.DeathsPerGame}>{HistoricDataSets.DeathsPerGame}</MenuItem>
						<MenuItem value={HistoricDataSets.AssistsPerGame}>{HistoricDataSets.AssistsPerGame}</MenuItem>
					</Select>
				</FormControl>
			</Box>
			<Line options={options} data={chartData.labels.length === 0 ? initialChartData : chartData} />
		</Box>
	);
}