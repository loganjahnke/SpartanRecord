import '../Assets/FontAwesome/css/all.css';
import '../Assets/Styles/Tiles/Tile.css';
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

interface TileProps
{
    /** The name of the description */
    description: string;
    /** Previous data */
    data: number[];
}

const ChartTile = (props: TileProps) =>
{
    const { description, data } = props;

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

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: "top" as const,
            },
            title: {
                display: false,
                text: description,
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
                display: false
            },
            yAxis: {
                grid: {
                    display: false,
                    drawTicks: false,
                    drawBorder: false
                },
                ticks: {
                    padding: 15
                }
            }
        }
    };

    const chartData = {
        labels: data.map(d => ""),
        datasets: [
            {
                backgroundColor: '#4D424D',
                borderColor: '#4D424D',
                data: data,
            }
        ]
    };

	return (
        <div className={`chartTile`}>
            <div className="chartTitle">{description}</div>
            <Line options={options} data={chartData} />
        </div>
    );
}

export default ChartTile;