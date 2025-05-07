import React from 'react';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale,Filler  } from "chart.js";

// Register the necessary Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale,Filler );

function ChartComponent({ pair, historicalData }) {
    // Prepare data for Chart.js
    const chartData = {
        labels: historicalData.map((d) => d.time),
        datasets: [
            {
                label: `${pair} Price (USD)`,
                data: historicalData.map((d) => d.price),
                borderColor: "rgb(236, 159, 183)",
                borderWidth: 2,
                tension: 0.4, // Makes the line smooth
                fill: true,
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, "rgba(236, 159, 183, 0.4)");
                    gradient.addColorStop(1, "rgba(236, 159, 183, 0)");
                    return gradient;
                },
            },
        ],
    };

    // Chart.js options for styling
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "top",
                labels: {
                    color: "#fff", // White text for legend
                },
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark background for tooltips
                titleColor: "#fff",
                bodyColor: "#fff",
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Date",
                    color: "#fff", // White text for x-axis
                },
                grid: {
                    color: "#444", // Dark grid lines
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Price (USD)",
                    color: "#fff", // White text for y-axis
                },
                grid: {
                    color: "#444", // Dark grid lines
                },
            },
        },
    };

    return (
        
        <div>
            {historicalData.length > 0 ? (
                <div className='chart-wrapper'>
                    <Line data={chartData} options={chartOptions} />
                </div>
            ) : (
                <p style={{ color: "#fff" }}>Loading chart...</p>
            )}
        </div>

        
    );
}

export default ChartComponent;
