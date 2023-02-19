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

import { ServiceRecord } from "../../../Objects/Model/ServiceRecord";
import { Box } from "@mui/material";
import { ArrowheadTheme } from "../../Theme/ArrowheadTheme";

export const KillBreakdownChart = (props: { currentSR: ServiceRecord }) =>
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

	const { currentSR } = props;
	
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
				text: "Kills Breakdown",
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
					text: "Kills"
				},
			}
		}
	};
	
	const chartData = {
		labels: [
			//"Assassinations", //: " + currentSR.breakdowns.kills.assassinations.toLocaleString(),
			//"Fusion Coil", //: " + currentSR.breakdowns.kills.fusionCoil.toLocaleString(),
			"Grenades", //: " + currentSR.breakdowns.kills.grenades.toLocaleString(),
			"Headshots", //: " + currentSR.breakdowns.kills.headshots.toLocaleString(),
			"Melee", //: " + currentSR.breakdowns.kills.melee.toLocaleString(),
			"Power Weapons", //: " + currentSR.breakdowns.kills.powerWeapons.toLocaleString(),
			//"Repulsor", //: " + currentSR.breakdowns.kills.repulsor.toLocaleString(),
			//"Splatters", //: " + currentSR.breakdowns.kills.splatters.toLocaleString(),
		],
		datasets: [
			{
				backgroundColor: ArrowheadTheme.halo_colors, //Object.values(CHART_COLORS),
				borderColor: ArrowheadTheme.box,
				data: [
					//currentSR.breakdowns.kills.assassinations,
					//currentSR.breakdowns.kills.fusionCoil,
					currentSR.breakdowns.kills.grenades,
					currentSR.breakdowns.kills.headshots,
					currentSR.breakdowns.kills.melee,
					currentSR.breakdowns.kills.powerWeapons,
					//currentSR.breakdowns.kills.repulsor,
					//currentSR.breakdowns.kills.splatters
				]
			}
		]
	};
	
	return (
		<Box sx={{ backgroundColor: "divider", minHeight: "300px" }}>
			<Doughnut options={options} data={chartData} />
		</Box>
	);
}