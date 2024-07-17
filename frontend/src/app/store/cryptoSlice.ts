import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PriceList {
    price: string,
    time: Date
}
export interface Crypto {
    symbol: string;
    name: string;
    currentPrice: number;
    image: string;
    priceList: PriceList[]
}
interface CryptoState {
    value: number;
    cryptos: Crypto[]
}
const initialState: CryptoState = {
    value: 0,
    cryptos: []
};

const cryptoSlice = createSlice({
    name: 'crypto',
    initialState,
    reducers: {
        saveCrypto: (state, action: PayloadAction<Crypto>) => {
            let cryptos = [...state.cryptos]
            let foundIndex = cryptos.findIndex((el) => el.symbol == action.payload.symbol)
            if (foundIndex >= 0) {
                cryptos[foundIndex] = action.payload
                state.cryptos = [...cryptos]
            } else {
                cryptos.push(action.payload)
                state.cryptos = [...cryptos]
            }
        },
    },
});

export const { saveCrypto } = cryptoSlice.actions;

export default cryptoSlice.reducer;
