import { Doughnut } from "react-chartjs-2";
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	DoughnutController,
	ArcElement,
	LinearScale,
	CategoryScale
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
		DoughnutController,
		Title,
		Tooltip,
		Legend,
		ArcElement,
		LinearScale,
		CategoryScale
	);

	const { players, blue } = props;

	const CHART_COLORS = blue ? {
		red: "rgb(255, 99, 132)",
		blue: "rgb(54, 162, 235)",
		orange: "rgb(255, 159, 64)",
		grey: "rgb(201, 203, 207)",
		yellow: "rgb(255, 205, 86)",
		green: "rgb(75, 192, 192)",
		purple: "rgb(153, 102, 255)",
		theme: ArrowheadTheme.cobra
	} : {
		theme: ArrowheadTheme.cobra,
		purple: "rgb(153, 102, 255)",
		green: "rgb(75, 192, 192)",
		yellow: "rgb(255, 205, 86)",
		grey: "rgb(201, 203, 207)",
		orange: "rgb(255, 159, 64)",
		blue: "rgb(54, 162, 235)",
		red: "rgb(255, 99, 132)"
	};
	
	const options = {
		type: "bar",
		responsive: true,
		indexAxis: "x" as const,
		// minBarLength: 5,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: true,
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
				display: false,
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
				display: false,
				grid: {
					display: false,
					drawTicks: false,
					drawBorder: false
				},
				ticks: {
					padding: 5
				},
				title: {
					display: false,
					text: "Kills"
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
				data: players.map(player => player.stats.summary.kills)
			}
		]
	};
	
	return (
		<Box sx={{ backgroundColor: "divider", width: "100%", minHeight: "300px" }}>
			<Doughnut options={options} data={chartData} />
		</Box>
	);
}