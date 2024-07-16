import axios from "axios";

export const coinGeckoAxiosInstance = axios.create({
    baseURL: "https://api.coingecko.com/api/v3",
    headers: {
        "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
    },
});
