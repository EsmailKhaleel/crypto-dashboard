import React from 'react'

function CardComponent({currency, setPair}) {
    return (
        <div
            className="currency-card"
            onClick={() => setPair(currency.id)} // Set pair on click
        >
            <h3>{currency.display_name}</h3>
            <h5 className={currency.status == 'online' ? 'online' : ''}>{currency.status}</h5>
            <button className="details-button">Show Details</button>
        </div>
    )
}

export default CardComponent