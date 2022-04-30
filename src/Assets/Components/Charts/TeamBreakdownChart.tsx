import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	BarController,
	BarElement,
	CategoryScale,
	LinearScale
  } from 'chart.js';

import { Box } from "@mui/material";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";
import { MatchPlayer } from "../../../Objects/Pieces/MatchPlayer";

export const TeamBreakdownChart = (props: { players: MatchPlayer[], blue?: boolean }) =>
{
	ChartJS.defaults.color = "#DDDDDD";
	ChartJS.defaults.font.family = "Roboto";
	ChartJS.defaults.font.weight = "100";
	ChartJS.register(
		BarController,
		Title,
		Tooltip,
		Legend,
		BarElement,
		CategoryScale,
		LinearScale
	);

	const { players, blue } = props;

	const CHART_COLORS = blue ? {
		o1: "#028e9c",
		o2: "#023e8a",
		o3: "#0077b6",
		o4: "#0096c7",
		o5: "#00b4d8",
		o6: "#48cae4",
		o7: "#90e0ef",
		o8: "#ade8f4",
		o9: "#caf0f8"
	} : {
		o1: "#7a1600",
		o2: "#8e1900",
		o3: "#a31d00",
		o4: "#b72100",
		o5: ArrowheadTheme.cobra,
		o6: "#d13a19",
		o7: "#d65032",
		o8: "#db664c",
		o9: "#e07c66"
	};
	
	const options = {
		type: "bar",
		responsive: true,
		indexAxis: "x" as const,
		// minBarLength: 5,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
				position: "top" as const,
				color: "#FFFFFF"
			},
			title: {
				display: true,
				text: "Points",
			}
		},
		elements: {
			bar: {
				// padding: 5
			},
		},
		layout: {
			padding: 5
		},
		scales: {
			yAxis: {
				display: true,
				grid: {
					display: false,
					drawTicks: false,
					drawBorder: false
				},
				title: {
					display: false,
				}
			},
			xAxis: {
				grid: {
					display: true,
					drawTicks: true,
					drawBorder: true
				},
				ticks: {
					padding: 5
				},
				title: {
					display: true,
					text: "Points"
				},
			}
		}
	};
	
	const chartData = {
		labels: players.map(player => player.gamertag),
		datasets: [
			{
				backgroundColor: Object.values(CHART_COLORS),
				borderColor: ArrowheadTheme.box,
				data: players.map(player => player.stats.totalPoints)
			}
		]
	};
	
	return (
		<Box sx={{ backgroundColor: "divider", width: "100%", minHeight: "300px" }}>
			<Bar options={options} data={chartData} />
		</Box>
	);
}