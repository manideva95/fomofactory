export interface PriceList {
    price: string;
    time: Date;
}
export interface Crypto {
    symbol: string;
    name: string;
    currentPrice: number;
    cryptoId: string;
    priceList: PriceList[]
}