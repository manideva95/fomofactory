"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setup = void 0;
const axios_1 = __importDefault(require("axios"));
const persistor_1 = require("../crypto/data/persistor");
const ids = ['bitcoin', 'ethereum', 'tether', 'dogecoin', 'solana'];
class Setup {
    // Function to fetch initial cryptocurrency data from Binance API
    fetchInitialCryptos() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Construct the request URL
                const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(',')}`;
                console.log(url);
                // Make the API request
                const response = yield axios_1.default.get(url);
                const cryptos = response.data.map((cryptoData) => ({
                    symbol: cryptoData.symbol.toUpperCase(), // Assuming symbol is in upper case
                    name: cryptoData.name,
                    image: cryptoData.image,
                    currentPrice: cryptoData.current_price, // Adding current price from CoinGecko API
                }));
                resolve(cryptos);
            }
            catch (error) {
                console.error('Error fetching initial cryptocurrency data:', error);
                reject(error); // Propagate the error
            }
        }));
    }
    // Save initial cryptocurrency data to MongoDB
    saveInitialCryptos() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const initialCryptos = yield this.fetchInitialCryptos();
                yield new persistor_1.CryptoPersistor().persistCryptos(initialCryptos);
                console.log('Initial cryptocurrencies saved to MongoDB');
            }
            catch (error) {
                console.error('Error saving initial cryptocurrencies:', error);
            }
        });
    }
}
exports.Setup = Setup;
//# sourceMappingURL=index.js.map