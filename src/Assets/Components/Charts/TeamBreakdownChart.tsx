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

export const TeamBreakdownChart = (props: { players: MatchPlayer[] }) =>
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

	const { players } = props;
	
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
				text: "Kills",
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
				backgroundColor: ArrowheadTheme.halo_colors, //Object.values(CHART_COLORS),
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