import React, { useState, useRef, useEffect } from 'react';

function CustomDropdown({ groupedCurrencies, selectedPair, onSelectPair }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setOpen(!open);
    const handleSelect = (pairId) => {
        onSelectPair(pairId);
        setOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="custom-dropdown" ref={dropdownRef}>
            <div className="custom-dropdown-toggle" onClick={toggleDropdown}>
                {selectedPair || 'Select a currency pair'}
                <span className="arrow">{open ? '▲' : '▼'}</span>
            </div>
            {open && (
                <div className="custom-dropdown-menu">
                    {Object.entries(groupedCurrencies).map(([quote, pairs]) => (
                        <div key={quote} className="dropdown-group">
                            <div className="group-label">{quote}</div>
                            {pairs.map((currency) => (
                                <div
                                    key={currency.id}
                                    className={`dropdown-item ${currency.id === selectedPair ? 'selected' : ''}`}
                                    onClick={() => handleSelect(currency.id)}
                                >
                                    {currency.display_name}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CustomDropdown;
