import axios from "axios";
import { CryptoPersistor } from "../data/persistor";
import { Crypto, PriceList } from "../entity";
import ApiError from "../../exceptions/apierror";
import { StatusCodes } from "http-status-codes";
import { coinGeckoAxiosInstance } from "../../axios/coingeckoinstance";

const ids = ['bitcoin', 'ethereum', 'tether', 'dogecoin', 'solana'];

export class CryptoManagement {
    fetchInitialCryptos() {
        return new Promise<Crypto[]>(async (resolve, reject) => {
            try {
                // Construct the request URL
                const url = `/coins/markets?vs_currency=usd&ids=${ids.join(',')}`;
                // Make the API request
                const response = await coinGeckoAxiosInstance.get(url);
                const cryptos: Crypto[] = response.data.map((cryptoData: any) => ({
                    cryptoId: cryptoData.id,
                    symbol: cryptoData.symbol.toUpperCase(), // Assuming symbol is in upper case
                    name: cryptoData.name,
                    image: cryptoData.image,
                    currentPrice: cryptoData.current_price,
                }));
                resolve(cryptos);
            } catch (error) {
                console.error('Error fetching initial cryptocurrency data:', error);
                reject(error);
            }
        })
    }



    // Save initial cryptocurrency data to MongoDB
    async saveInitialCryptos() {
        try {
            const initialCryptos = await this.fetchInitialCryptos();
            await new CryptoPersistor().persistCryptos(initialCryptos)
            setInterval(async () => {
                await this.fetchLivePrices()
            }, Number(process.env.PRICE_UPDATE_INTERVAL))
            console.log('4.Initial cryptocurrencies saved to MongoDB');
        } catch (error) {
            console.error('Error saving initial cryptocurrencies:', error);
        }
    }


    async fetchLivePrices() {
        try {
            const url = `/simple/price?vs_currencies=usd&ids=${ids.join(',')}`
            const response = await coinGeckoAxiosInstance.get(url);
            const price = response.data
            for await (const id of ids) {
                if (price[id]) {
                    await new CryptoPersistor().updatePriceList(id, Number(price[id].usd))
                }
            }
            return price;
        } catch (error) {
            console.log(error)
        }
    };


    async cryptos(): Promise<Crypto[]> {
        return new Promise<Crypto[]>(async (resolve, reject) => {
            try {
                let cryptos = await new CryptoPersistor().cryptos()
                if (cryptos?.length > 0) {
                    resolve(cryptos)
                } else {
                    return reject(new ApiError("Cryptos Not Found", StatusCodes.NOT_FOUND));
                }
            } catch (error) {
                reject(error)
            }
        })
    }
}