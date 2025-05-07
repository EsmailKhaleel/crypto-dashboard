import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { fetchCryptoChart } from "./cryptoApi";
import "./style.css";

const CryptoChart = ({ id }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const loadChartData = async () => {
      const dataPrices = await fetchCryptoChart(id);
      if (!dataPrices) return;

      setChartData({
        labels: dataPrices.map((entry) => new Date(entry[0]).toLocaleDateString()),
        datasets: [
          {
            label: "Price (USD)",
            data: dataPrices.map((entry) => entry[1]),
            borderColor: "#6C5DD3",
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, "rgba(108, 93, 211, 0.4)");
              gradient.addColorStop(1, "rgba(108, 93, 211, 0)");
              return gradient;
            },
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: "#8E7FF0",
            pointHoverBorderColor: "#ffffff",
            pointHoverBorderWidth: 2,
          },
        ],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                color: "#A5A5A5",
                font: {
                  size: 12,
                  family: "'Inter', sans-serif",
                  weight: 500
                }
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: "rgba(30, 27, 46, 0.9)",
              titleColor: "#fff",
              bodyColor: "#A5A5A5",
              borderColor: "rgba(108, 93, 211, 0.2)",
              borderWidth: 1,
              padding: 12,
              displayColors: false,
              callbacks: {
                label: function(context) {
                  return `$${context.parsed.y.toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: "#A5A5A5",
                font: {
                  size: 11,
                  family: "'Inter', sans-serif"
                }
              }
            },
            y: {
              grid: {
                color: "rgba(255, 255, 255, 0.05)",
                drawBorder: false
              },
              ticks: {
                color: "#A5A5A5",
                font: {
                  size: 11,
                  family: "'Inter', sans-serif"
                },
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          }
        }
      });
    };

    loadChartData();
  }, [id]);

  return (
    <div className="chart-container">
      {chartData ? (
        <Line 
          data={chartData} 
          options={chartData.options}
          height={300}
        />
      ) : (
        <div className="loading">Loading chart...</div>
      )}
    </div>
  );
};

export default CryptoChart;
