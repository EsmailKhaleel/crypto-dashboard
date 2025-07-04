import React, { useEffect, useState } from "react";
import { fetchCryptos } from "./cryptoApi.js";
import CryptoCard from "./CryptoCard";
import CustomDropdown from "../Components/CustomDropdown";

const CURRENCY_OPTIONS = [
  { value: "usd", label: "USD" },
  { value: "eur", label: "EUR" },
  { value: "gbp", label: "GBP" },
  { value: "jpy", label: "JPY" },
  { value: "cny", label: "CNY" },
  { value: "inr", label: "INR" },
  { value: "btc", label: "BTC" },
  { value: "eth", label: "ETH" }
];

const CryptoDashBoard = () => {
  const [cryptos, setCryptos] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(8);
  const [total, setTotal] = useState(0);
  const [vsCurrency, setVsCurrency] = useState("usd");
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    const getData = async () => {
      try {
        const data = await fetchCryptos(perPage, page, vsCurrency);
        setCryptos(data);
        setTotal(1000);
      } catch (error) {
        if (error?.response?.status === 429) {
          setError("Too many requests. Please wait a moment and try again.");
        } else {
          setError("An error occurred while fetching data. Please try again later.");
        }
      }
    };
    getData();
  }, [page, perPage, vsCurrency]);

  const totalPages = Math.ceil(total / perPage);
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="coingecko-dashboard">
      <h1>{CURRENCY_OPTIONS.find(opt => opt.value === vsCurrency)?.label || vsCurrency.toUpperCase()} Cryptos</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <CustomDropdown
          options={CURRENCY_OPTIONS}
          selected={vsCurrency}
          onSelect={value => { setVsCurrency(value); setPage(1); }}
          label="Select Currency"
        />
      </div>
      {error ? (
        <div className="error-fallback">{error}</div>
      ) : (
        <>
          <div className="grid-container">
            {cryptos.map((crypto) =>
            (
              <div key={crypto.id} className="crypto-item">
                <CryptoCard crypto={crypto} />
              </div>
            ))}
          </div>
          <div className="pagination-container">
            <button
              className="coingecko-show-more-button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >Previous</button>
            <span className="pagination-label">Page {page} of {totalPages}</span>
            <button
              className="coingecko-show-more-button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CryptoDashBoard;
