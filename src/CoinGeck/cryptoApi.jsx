import axios from "axios";

const API_URL = "https://api.coingecko.com/api/v3";

export const fetchCryptos = async (per_page, page) => {
    try {
        const response = await axios.get(`${API_URL}/coins/markets`, {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: per_page || 8,
            page: page || 1,
          },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const fetchCryptoChart = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/coins/${id}/market_chart`, {
          params: {
            vs_currency: "usd",
            days: "30-12-2017",
          },
        });
        return response.data.prices;
    } catch (error) {
        console.log(error);
    }
};
