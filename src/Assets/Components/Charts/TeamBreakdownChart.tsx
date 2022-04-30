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

export const TeamBreakdownChart = (props: { players: MatchPlayer[] }) =>
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

	const CHART_COLORS = {
		red: "rgb(255, 99, 132)",
		orange: "rgb(255, 159, 64)",
		yellow: "rgb(255, 205, 86)",
		green: "rgb(75, 192, 192)",
		blue: "rgb(54, 162, 235)",
		purple: "rgb(153, 102, 255)",
		grey: "rgb(201, 203, 207)",
		theme: ArrowheadTheme.cobra
	};

	const { players } = props;
	
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