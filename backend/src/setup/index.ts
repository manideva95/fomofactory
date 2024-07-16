import axios from "axios";
import { Crypto } from "../crypto/entity";
import { CryptoPersistor } from "../crypto/data/persistor";

const ids = ['bitcoin', 'ethereum', 'tether', 'dogecoin', 'solana'];

export class Setup {
    // Function to fetch initial cryptocurrency data from Binance API
    fetchInitialCryptos() {
        return new Promise<Crypto[]>(async (resolve, reject) => {
            try {
                // Construct the request URL
                const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(',')}`;
                console.log(url)
                // Make the API request
                const response = await axios.get(url);
                const cryptos: Crypto[] = response.data.map((cryptoData: any) => ({
                    symbol: cryptoData.symbol.toUpperCase(), // Assuming symbol is in upper case
                    name: cryptoData.name,
                    image: cryptoData.image,
                    currentPrice: cryptoData.current_price, // Adding current price from CoinGecko API
                }));

                resolve(cryptos);
            } catch (error) {
                console.error('Error fetching initial cryptocurrency data:', error);
                reject(error); // Propagate the error
            }
        })
    }



    // Save initial cryptocurrency data to MongoDB
    async saveInitialCryptos() {
        try {
            const initialCryptos = await this.fetchInitialCryptos();
            await new CryptoPersistor().persistCryptos(initialCryptos)
            console.log('Initial cryptocurrencies saved to MongoDB');
        } catch (error) {
            console.error('Error saving initial cryptocurrencies:', error);
        }
    }
}