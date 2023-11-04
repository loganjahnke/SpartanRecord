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

export const PlaylistOddsChart = (props: { odds: Map<string, number> }) =>
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

	const { odds } = props;
	
	const options = {
		type: "bar",
		responsive: true,
		indexAxis: "y" as const,
		// minBarLength: 5,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: true,
				position: "top" as const,
				color: "#FFFFFF"
			},
			title: {
				display: false,
				text: "Odds",
			},
			datalabels: {
				display: false
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
					text: "Odds"
				},
			}
		}
	};
	
	const chartData = {
		labels: Array.from(odds.keys()),
		datasets: [
			{
				backgroundColor: ArrowheadTheme.halo_colors, //Object.values(CHART_COLORS),
				borderColor: ArrowheadTheme.box,
				data: Array.from(odds.values())
			}
		]
	};
	
	return (
		<Box sx={{ backgroundColor: "divider", minHeight: "300px", borderRadius: 5, mt: 2 }}>
			<Doughnut options={options} data={chartData} />
		</Box>
	);
}