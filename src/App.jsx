import React, { useState, useEffect } from 'react'
import Dashboard from './Components/Dashboard'
import CryptoDashBoard from './CoinGeck/CryptoDashBoard'

function App() {
  const [activeTab, setActiveTab] = useState('coinbase');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Crypto Dashboard</h1>
          <button 
            className="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle theme"
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </header>
      <div className="tab-container">
        <button 
          className={`tab-button ${activeTab === 'coinbase' ? 'active' : ''}`}
          onClick={() => setActiveTab('coinbase')}
        >
          Coinbase Live Trading
        </button>
        <button 
          className={`tab-button ${activeTab === 'coingecko' ? 'active' : ''}`}
          onClick={() => setActiveTab('coingecko')}
        >
          CoinGecko Market Overview
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'coinbase' && <Dashboard />}
        {activeTab === 'coingecko' && <CryptoDashBoard />}
      </div>
    </div>
  )
}

export default App
