import React from "react";
import "./style.css";

const CryptoCard = ({ crypto }) => {
    return (
        <div className="crypto-card">
            <div className="crypto-header">
                <h3 className="crypto-name">{crypto.name}</h3>
                <img src={crypto.image} alt={crypto.name} className="crypto-icon" />
            </div>
            <p className="crypto-price">
                <strong>Price: </strong>&nbsp;${crypto.current_price.toLocaleString()}
            </p>
            <p><strong>Market Cap Rank:</strong> {crypto.market_cap_rank}</p>
            <p><strong>Total Supply:</strong> {crypto.total_supply}</p>
            <p><strong>Total Volume:</strong> {crypto.total_volume}</p>
            <p><strong>Market Cap:</strong> <strong className="green">$ {crypto.market_cap.toLocaleString()}</strong></p>
            <p><strong>Price Change (24h):</strong> <span className={crypto.price_change_percentage_24h > 0 ? "green" : "red"}>
                {crypto.price_change_percentage_24h.toFixed(2)}%
            </span>
            </p>
            <p><strong>Last Update:</strong> {formatDate(crypto.last_updated)}</p>
        </div>
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