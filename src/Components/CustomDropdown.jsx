import React, { useState, useRef, useEffect } from 'react';

function CustomDropdown({ options, selected, onSelect, label }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setOpen(!open);
    const handleSelect = (value) => {
        onSelect(value);
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
            {label && <div className="custom-dropdown-label">{label}</div>}
            <div className="custom-dropdown-toggle" onClick={toggleDropdown}>
                {options.find(opt => opt.value === selected)?.label || 'Select...'}
                <span className="arrow">{open ? '▲' : '▼'}</span>
            </div>
            {open && (
                <div className="custom-dropdown-menu">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`dropdown-item ${option.value === selected ? 'selected' : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CustomDropdown;
