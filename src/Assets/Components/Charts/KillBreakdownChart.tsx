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

import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { Box } from "@mui/material";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

export const KillBreakdownChart = (props: { currentSR: ServiceRecord }) =>
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

	const { currentSR } = props;
	
	const options = {
		type: "bar",
		responsive: true,
		indexAxis: "y" as const,
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
				text: "Kills Breakdown",
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
					text: "Kills"
				},
			}
		}
	};
	
	const chartData = {
		labels: [
			"Assassinations", //: " + currentSR.breakdowns.kills.assassinations.toLocaleString(),
			"Fusion Coil", //: " + currentSR.breakdowns.kills.fusionCoil.toLocaleString(),
			"Grenades", //: " + currentSR.breakdowns.kills.grenades.toLocaleString(),
			"Headshots", //: " + currentSR.breakdowns.kills.headshots.toLocaleString(),
			"Melee", //: " + currentSR.breakdowns.kills.melee.toLocaleString(),
			"Power Weapons", //: " + currentSR.breakdowns.kills.powerWeapons.toLocaleString(),
			"Repulsor", //: " + currentSR.breakdowns.kills.repulsor.toLocaleString(),
			"Splatters", //: " + currentSR.breakdowns.kills.splatters.toLocaleString(),
		],
		datasets: [
			{
				backgroundColor: Object.values(CHART_COLORS),
				borderColor: ArrowheadTheme.box,
				data: [
					currentSR.breakdowns.kills.assassinations,
					currentSR.breakdowns.kills.fusionCoil,
					currentSR.breakdowns.kills.grenades,
					currentSR.breakdowns.kills.headshots,
					currentSR.breakdowns.kills.melee,
					currentSR.breakdowns.kills.powerWeapons,
					currentSR.breakdowns.kills.repulsor,
					currentSR.breakdowns.kills.splatters
				]
			}
		]
	};
	
	return (
		<Box sx={{ backgroundColor: "divider", minHeight: "300px" }}>
			<Bar options={options} data={chartData} />
		</Box>
	);
}