import React, { useEffect, useRef, useState } from 'react'
import ChartComponent from './ChartComponent';
import CardComponent from './CardComponent';
import CustomDropdown from './CustomDropdown';

function Dashboard() {
    const [currencies, setCurrencies] = useState([]);
    const [pair, setPair] = useState('');
    const [price, setPrice] = useState('0.00');
    const [historicalData, setHistoricalData] = useState([]);
    const ws = useRef(null);


    const first = useRef(false);
    const url = 'https://api.exchange.coinbase.com';

    useEffect(() => {
        ws.current = new WebSocket("wss://ws-feed.exchange.coinbase.com");

        ws.current.onopen = async () => {
            const response = await fetch(url + "/products");
            const data = await response.json();
            const filtered = data
                .sort((a, b) =>
                    a.base_currency > b.base_currency ? 1 : a.base_currency < b.base_currency ? -1 : 0
                );

            setCurrencies(filtered);
            setPair(filtered[0]?.id || '');
        };

        return () => {
            ws.current.close();
        };
    }, []);


    useEffect(() => {
        if (!pair) return;

        const subscribe = () => {
            if (ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(JSON.stringify({
                    type: "subscribe",
                    product_ids: [pair],
                    channels: ["ticker"]
                }));
            } else {
                setTimeout(subscribe, 500);
            }
        };
        subscribe();

        console.log("Pair changed to:", pair);

        if (pair) {
            let hisDataUrl = `${url}/products/${pair}/candles?granularity=86400`;
            const fetchHisData = async () => {
                try {
                    let response = await fetch(hisDataUrl);
                    let hisData = await response.json();
                    if (response.ok) {
                        let formattedData = hisData.map((d) => ({
                            time: new Date(d[0] * 1000).toLocaleDateString(), // Convert timestamp
                            price: d[4], // Closing price
                        })).reverse(); // Reverse to show latest data first

                        setHistoricalData(formattedData);
                    } else {
                        console.error("Error fetching historical data:", hisData.message);
                    }
                } catch (error) {
                    console.error("Fetch error:", error);
                }
            };

            fetchHisData();

        } else {
            console.log("Invalid or empty pair selected");
        }

        ws.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === "ticker" && data.product_id === pair && data.price) {
                setPrice(data.price);
            }
        };

        // Clean-Up
        return () => {
            if (ws.current.readyState === WebSocket.OPEN) {
                ws.current.send(
                    JSON.stringify({
                        type: "unsubscribe",
                        product_ids: [pair],
                        channels: ["ticker"],
                    })
                );
            }
        };

    }, [pair]);

    useEffect(() => {
        if (currencies.length > 0) {
            first.current = true;
        }
    }, [currencies]);



    const scrollToTop = () => {
        window.scrollTo({
            top: 200,
            behavior: "smooth",
        });
    };
    const groupedCurrencies = currencies.reduce((groups, pair) => {
        const quote = pair.quote_currency;
        if (!groups[quote]) groups[quote] = [];
        groups[quote].push(pair);
        return groups;
    }, {});
    function getRandomLightColor(opacity = 0.6) {
        const r = Math.floor(200 + Math.random() * 55); // Range: 200–255
        const g = Math.floor(200 + Math.random() * 55);
        const b = Math.floor(200 + Math.random() * 55);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    return (
        <div className="dashboard">
            {/* Currency Pair Dropdown */}
            <CustomDropdown
                groupedCurrencies={groupedCurrencies}
                selectedPair={pair}
                onSelectPair={setPair}
            />

            {/* Selected Pair Details */}
            {pair && (
                <div >
                    <div className="selected-pair-details">
                        <h3 style={{ color: "rgb(246, 117, 157)" }}>Selected Pair: <strong style={{ color: "#ec752b" }}>{pair}</strong></h3>
                    </div>
                    <h3 className="current-price">Current Price: ${price}</h3>
                </div>
            )}
            {/* Chart Container */}
            <div className="chart-container">
                <ChartComponent pair={pair} historicalData={historicalData} />
            </div>

            {/* Currency Pair Cards */}
            {/* <div className="currency-cards">
                {currencies.map((currency) => (
                    <CardComponent currency={currency} scrollToTop={scrollToTop} key={currency.id} setPair={setPair} />
                ))}
            </div> */}
        </div>
    );
}

export default Dashboard