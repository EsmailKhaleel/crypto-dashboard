import React, { useState, useEffect } from "react";
import { fetchCryptoChart } from "./cryptoApi.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

const CryptoCard = ({ crypto }) => {
    const [showChart, setShowChart] = useState(false);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (!showChart) return;
        const loadChartData = async () => {
            try {
                const prices = await fetchCryptoChart(crypto.id);
                if (!prices) return setChartData(null);
                setChartData(
                    prices.map(entry => ({
                        time: new Date(entry[0]).toLocaleDateString(),
                        price: entry[1]
                    }))
                );
            } catch (error) {
                setChartData(null);
            }
        };
        loadChartData();
    }, [showChart, crypto.id]);

    return (
        <>
        <div className="crypto-card">
            <div className="crypto-header">
                <h3 className="crypto-name">{crypto.name || '-'}</h3>
                <img src={crypto.image || ''} alt={crypto.name || 'crypto'} className="crypto-icon" />
            </div>
            <p className="crypto-price">
                <strong>Price: </strong>&nbsp;{crypto.current_price != null ? `$${crypto.current_price.toLocaleString()}` : 'N/A'}
            </p>
            <p><strong>Market Cap Rank:</strong> {crypto.market_cap_rank != null ? crypto.market_cap_rank : 'N/A'}</p>
            <p><strong>Total Supply:</strong> {crypto.total_supply != null ? crypto.total_supply : 'N/A'}</p>
            <p><strong>Total Volume:</strong> {crypto.total_volume != null ? crypto.total_volume : 'N/A'}</p>
            <p><strong>Market Cap:</strong> <strong className="green">{crypto.market_cap != null ? `$ ${crypto.market_cap.toLocaleString()}` : 'N/A'}</strong></p>
            <p><strong>Price Change (24h):</strong> <span className={crypto.price_change_percentage_24h > 0 ? "green" : "red"}>
                {crypto.price_change_percentage_24h != null ? `${crypto.price_change_percentage_24h.toFixed(2)}%` : 'N/A'}
            </span>
            </p>
            <p><strong>Last Update:</strong> {crypto.last_updated ? formatDate(crypto.last_updated) : 'N/A'}</p>

            <button 
                className="coingecko-details-button" 
                onClick={() => setShowChart(!showChart)}
                >
                {showChart ? "Hide Chart" : "Show Chart"}
            </button>
        </div>
        {showChart && (
            <div className="chart-container">
                {console.log("Chart Data:", chartData)}
                {chartData ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--text-secondary)" />
                            <XAxis
                                dataKey="time"
                                stroke="var(--text-secondary)"
                                tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                                label={{ value: 'Date', position: 'insideBottom', offset: -5, fill: 'var(--text-primary)', fontSize: 13 }}
                            />
                            <YAxis
                                stroke="var(--text-secondary)"
                                tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                                tickFormatter={v => `$${v}`}
                                label={{ value: 'Price (USD)', angle: -90, position: 'insideLeft', fill: 'var(--text-primary)', fontSize: 13 }}
                            />
                            <Tooltip wrapperStyle={{ className: 'coingecko-tooltip' }} formatter={v => `$${v}`} />
                            <Line type="monotone" dataKey="price" stroke="#6C5DD3" strokeWidth={2} dot={false} name="Price (USD)" fillOpacity={0.2} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="loading">Loading chart...</div>
                )}
            </div>
        )}
        </>
    );
};

export default CryptoCard;

function formatDate(dateString) {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleString("en-US", {
        // weekday: "long", // "Monday"
        year: "numeric", // "2025"
        month: "long", // "February"
        day: "numeric", // "3"
        hour: "2-digit", // "10"
        minute: "2-digit", // "50"
        second: "2-digit", // "41"
        hour12: true, // Use 12-hour format
    });
    return formattedDate;
}