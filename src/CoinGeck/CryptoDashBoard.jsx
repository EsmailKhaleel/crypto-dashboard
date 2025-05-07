import React, { useEffect, useState } from "react";
import { fetchCryptos } from "./cryptoApi";
import CryptoCard from "./CryptoCard";
import "./style.css";
import CryptoChart from "./CryptoChart";

const CryptoDashBoard = () => {
  const [cryptos, setCryptos] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8); 


  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchCryptos(perPage, page); // Wait for the data to be fetched
        setCryptos(data); // Update state
        console.log(data); // Should now log actual data
      } catch (error) {
        console.error("Error fetching cryptos:", error);
      }
    };

    getData();

  }, []); // Fetch data when page or perPage changes

  async function showMoreClick() {
    const newCryptos = await fetchCryptos(perPage, page + 1);
    if (!newCryptos || newCryptos.length === 0) return;
    setPage((prevPage) => prevPage + 1);
    // setPerPage((prevPerPage) => prevPerPage + 8);
    setCryptos((prevCryptos) => [...prevCryptos, ...newCryptos]);
  }

  return (
    <div className="dashboard">
      <h1>USD Cryptos</h1>
      <div className="grid-container">
        {cryptos.map((crypto) =>
        (
          <div key={crypto.id} className="crypto-item">
            <CryptoCard crypto={crypto} />
          </div>
        ))}
        {/* {cryptos.length > 1 && <CryptoChart id={cryptos[1].id} />} */}
      </div>
        <button
          onClick={showMoreClick}
          className="show-more-button"
        >Show More</button>
    </div>
  );
};

export default CryptoDashBoard;
