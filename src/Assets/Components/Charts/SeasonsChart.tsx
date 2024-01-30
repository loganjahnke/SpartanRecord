import { Bar } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
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
import { HaloDotAPISeason } from "../../../Database/Schemas/AutocodeMetadata";

enum SeasonsDataSets
{
	Matches = "Matches",
	WinRate = "Win Rate",
	KDA = "KDA",
	KDR = "KDR",
	Accuracy = "Accuracy",
	KillsPerGame = "Kills / Game",
	DeathsPerGame = "Deaths / Game",
	AssistsPerGame = "Assists / Game",
}

export const SeasonsChart = (props: { seasons: HaloDotAPISeason[], historicServiceRecords: ServiceRecord[] }) =>
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
		Legend,
		ChartDataLabels
	);

	const { seasons, historicServiceRecords } = props;
	const dataSet = useRef<SeasonsDataSets>(SeasonsDataSets.Matches);
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
			},
			datalabels: {
				color: "#000000"
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
					text: "Season"
				}
			},
			yAxis: {
				grid: {
					display: true,
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
		labels: historicServiceRecords.map((_sr, index) => "Season " + (index + 1)),
		datasets: [
			{
				backgroundColor: ArrowheadTheme.text_secondary,
				borderColor: ArrowheadTheme.text_secondary,
				data: historicServiceRecords.map(sr => sr.matchesPlayed)
			}
		]
	});

	/**
	 * Changes the data set
	 * @param event the event containing the new data set
	 */
	const changeDataSet = useCallback((event?: SelectChangeEvent): void =>
	{
		const newDataSet = event?.target.value as SeasonsDataSets ?? SeasonsDataSets.Matches;
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
				},
				datalabels: {
					color: "#FFFFFF",
					font: {
						family: "Industry",
						weight: "600"
					},
					formatter: function(value: number) {
						// if (newDataSet === SeasonsDataSets.DamageEfficiency) { return (Math.round(value * 10000) / 100) + "%"; }
						return (Math.round(value * 100) / 100) + 
							(newDataSet === SeasonsDataSets.WinRate || newDataSet === SeasonsDataSets.Accuracy
								? "%" : "");
					}
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
						text: "Season"
					}
				},
				yAxis: {
					grid: {
						display: true,
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

		// Sort the SRs
		const historic = [];
		const labels = [];
		for (let i = 0; i < seasons.length; i++)
		{
			labels.push(seasons[i].season_name);
			for (let j = 0; j < historicServiceRecords.length; j++)
			{
				if (historicServiceRecords[j].season !== seasons[i].properties.identifier) { continue; }
				historic.push(historicServiceRecords[j]);
			}
		}

		setChartData({
			labels: seasons.map((season) => season.season_name),
			datasets: [
				{
					backgroundColor: ArrowheadTheme.good,
					borderColor: ArrowheadTheme.good,
					borderRadius: 5,
					data: historic.map(sr => 
					{
						switch (dataSet.current)
						{
							case SeasonsDataSets.Matches: return sr.matchesPlayed;
							// case SeasonsDataSets.Wins: return sr.breakdowns.matches.wins;
							// case SeasonsDataSets.Losses: return sr.breakdowns.matches.losses;
							case SeasonsDataSets.WinRate: return sr.winRate;
							// case SeasonsDataSets.Kills: return sr.summary.kills;
							// case SeasonsDataSets.Deaths: return sr.summary.deaths;
							// case SeasonsDataSets.Assists: return sr.summary.assists;
							case SeasonsDataSets.KDA: return sr.kda;
							case SeasonsDataSets.KDR: return sr.kdr;
							case SeasonsDataSets.Accuracy: return sr.shots.accuracy;
							case SeasonsDataSets.KillsPerGame: return sr.summary.kills / sr.matchesPlayed;
							case SeasonsDataSets.DeathsPerGame: return sr.summary.deaths / sr.matchesPlayed;
							case SeasonsDataSets.AssistsPerGame: return sr.summary.assists / sr.matchesPlayed;
							// case SeasonsDataSets.DamagePerGame: return sr.damage.dealt / sr.matchesPlayed;
							// case SeasonsDataSets.DamageEfficiency: return sr.damageEfficiency;
							default: return sr.matchesPlayed;
						}
					}),
				}
			]
		});
	}, [historicServiceRecords, seasons]);

	const initialChartData = {
		labels: historicServiceRecords.map((_sr, index) => "Season " + (index + 1)),
		datasets: [
			{
				backgroundColor: ArrowheadTheme.good,
				borderColor: ArrowheadTheme.good,
				data: historicServiceRecords.map(sr => sr.matchesPlayed)
			}
		]
	};

	useEffect(() => 
	{
		changeDataSet();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [historicServiceRecords]);
	
	return (
		historicServiceRecords.length > 1
			?
			<Box sx={{ backgroundColor: "divider", borderRadius: 3, pt: 2 }}>
				<Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
					<FormControl size="small" sx={{ minWidth: "125px" }}>
						<InputLabel id="data-set-label">Data Set</InputLabel>
						<Select labelId="data-set-label" id="data-set" value={dataSet.current} label="Data Set" onChange={changeDataSet}>
							{Object.entries(SeasonsDataSets).map(e => <MenuItem value={e[1]} key={e[0]}>{e[1]}</MenuItem>)}
						</Select>
					</FormControl>
				</Box>
				<Box sx={{ height: "300px" }}>
					<Bar options={options} data={chartData.labels.length === 0 ? initialChartData : chartData} />
				</Box>
			</Box>
			: 
			<Box sx={{ p: 2, backgroundColor: "divider", borderRadius: 3, display: "flex", justifyContent: "center", alignItems: "center" }}>
				<Typography variant="body1">Not enough data to show historic records.</Typography>
			</Box>
	);
}