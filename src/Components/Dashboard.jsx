import React, { useEffect, useRef, useState } from 'react'
import ChartComponent from './ChartComponent';
import CardComponent from './CardComponent';
import CustomDropdown from './CustomDropdown';

function Dashboard() {
    const [currencies, setCurrencies] = useState([]);
    const [selectedQuote, setSelectedQuote] = useState('');
    const [pair, setPair] = useState('');
    const [price, setPrice] = useState('0.00');
    const [historicalData, setHistoricalData] = useState([]);
    const [error, setError] = useState(null);
    const ws = useRef(null);
    const latestPair = useRef(pair);
    const url = 'https://api.exchange.coinbase.com';

    useEffect(() => {
        setError(null); // Reset error on dependency change
        ws.current = new WebSocket("wss://ws-feed.exchange.coinbase.com");
        ws.current.onopen = async () => {
            try {
                const response = await fetch(url + "/products");
                if (!response.ok) throw response;
                const data = await response.json();
                const filtered = data
                    .sort((a, b) =>
                        a.base_currency > b.base_currency ? 1 : a.base_currency < b.base_currency ? -1 : 0
                    );

                setCurrencies(filtered);
                // Set default selected quote and pair
                if (filtered[0]?.quote_currency && !selectedQuote) {
                    setSelectedQuote(filtered[0].quote_currency);
                }
                if (filtered[0]?.id && filtered[0]?.id !== pair) {
                    setPair(filtered[0].id);
                }
            } catch (err) {
                if (err.status === 429) {
                    setError("Too many requests. Please wait a moment and try again.");
                } else {
                    setError("An error occurred while fetching data. Please try again later.");
                }
            }
        };
        ws.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === "ticker" && data.product_id === latestPair.current && data.price) {
                setPrice(Number(data.price).toFixed(4));
            }
        };
        return () => {
            ws.current.close();
        };
    }, []);

    useEffect(() => {
        if (!pair || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;
        // Unsubscribe from all previous pairs
        ws.current.send(JSON.stringify({
            type: "unsubscribe",
            product_ids: [latestPair.current],
            channels: ["ticker"]
        }));
        // Subscribe to new pair
        ws.current.send(JSON.stringify({
            type: "subscribe",
            product_ids: [pair],
            channels: ["ticker"]
        }));
        // Fetch historical data
        const hisDataUrl = `${url}/products/${pair}/candles?granularity=86400`;
        const fetchHisData = async () => {
            try {
                let response = await fetch(hisDataUrl);
                if (!response.ok) throw response;
                let hisData = await response.json();
                if (response.ok) {
                    let formattedData = hisData.map((d) => ({
                        time: new Date(d[0] * 1000).toLocaleDateString(), // Convert timestamp
                        price: d[4], // Closing price
                    })).reverse(); // Reverse to show latest data first

                    setHistoricalData(formattedData);
                } else {
                    setError("An error occurred while fetching chart data. Please try again later.");
                }
            } catch (err) {
                if (err.status === 429) {
                    setError("Too many requests. Please wait a moment and try again.");
                } else {
                    setError("An error occurred while fetching chart data. Please try again later.");
                }
            }
        };

        fetchHisData();

        // Clean-Up
        return () => {
            if (ws.current && ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({
                    type: "unsubscribe",
                    product_ids: [pair],
                    channels: ["ticker"],
                }));
            }
        };

    }, [pair, url]);

    // Extract unique quote currencies for the first dropdown
    const quoteCurrencies = Array.from(new Set(currencies.map(c => c.quote_currency)));
    const quoteOptions = quoteCurrencies.map(q => ({ value: q, label: q }));

    // Filter pairs for the selected quote currency
    const filteredPairs = currencies.filter(c => c.quote_currency === selectedQuote);
    const pairOptions = filteredPairs.map(c => ({ value: c.id, label: c.display_name }));

    // If selected pair is not in filteredPairs, reset it
    useEffect(() => {
        if (filteredPairs.length > 0 && !filteredPairs.some(c => c.id === pair)) {
            setPair(filteredPairs[0].id);
        }
    }, [selectedQuote, currencies]);

    if (error) {
        return <div className="error-fallback">{error}</div>;
    }

    return (
        <div className="dashboard">
            {/* Quote Currency Dropdown */}
            <div className="dropdown-container">
            <CustomDropdown
                options={quoteOptions}
                selected={selectedQuote}
                onSelect={setSelectedQuote}
                label="Select Quote Currency"
            />
            {/* Pair Dropdown */}
            <CustomDropdown
                options={pairOptions}
                selected={pair}
                onSelect={setPair}
                label="Select Pair"
                />
                </div>
            {/* Selected Pair Details */}
            {pair && (
                <div >
                    <div className="selected-pair-details">
                        <h3 className="selected-pair-label">Selected Pair: <strong className="selected-pair-value">{pair}</strong></h3>
                    </div>
                    <h3 className="current-price">Current Price: ${price}</h3>
                </div>
            )}
            {/* Chart Container */}
            {historicalData.length > 0 ?
                <ChartComponent pair={pair} historicalData={historicalData} />
                :
                <p>Loading chart...</p>}

            {/* Currency Pair Cards */}
            {/* <div className="currency-cards">
                {currencies.map((currency) => (
                    <CardComponent currency={currency} setPair={setPair} />
                ))}
            </div> */}
        </div>
    );
}

export default Dashboard