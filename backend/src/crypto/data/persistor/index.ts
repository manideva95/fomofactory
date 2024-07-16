import { ChangeStream } from "mongodb";
import { Crypto, PriceList } from "../../entity"
import { connection } from "../connection";

export class CryptoPersistor {
    private changeStream: ChangeStream<Document> | null = null;

    persistCryptos(cryptos: Crypto[]) {
        return new Promise<Crypto[]>(async (resolve, reject) => {
            try {
                const CryptoModel = connection.model("crypto");
                await CryptoModel.deleteMany()
                let cryptosRecords = await CryptoModel.insertMany(cryptos)
                resolve(cryptosRecords)
            } catch (error) {
                reject(error);
            }
        })
    }

    cryptos() {
        return new Promise<Crypto[]>(async (resolve, reject) => {
            try {
                var CryptoModel = connection.model("crypto");
                let cryptoRecord = await CryptoModel.find({})
                resolve(cryptoRecord);
            } catch (error) {
                reject(error);
            }
        });
    }

    async updatePriceList(cryptoId: string, newPrice: number) {
        try {
            var CryptoModel = connection.model("crypto");
            const crypto = await CryptoModel.findOne({ cryptoId });
            const newPriceEntry: PriceList = {
                price: newPrice.toFixed(2),
                time: new Date()
            };
            // Add newPriceEntry to the start of the array
            crypto.priceList.unshift(newPriceEntry);
            // Ensure priceList array length does not exceed 20
            if (crypto.priceList.length > 20) {
                crypto.priceList = crypto.priceList.slice(0, 20);
            }
            await crypto.save();
            // console.log(`Updated priceList for ${crypto.cryptoId} successfully.`);
        } catch (error) {
            console.error('Error updating priceList:', error);
            throw error;
        }
    };
    watchCollection(callback: (data: any) => void) {
        this.changeStream = connection.watch();
        this.changeStream.on('change', next => {
            callback(next);
        });
    }

    stopWatchingCollection() {
        if (this.changeStream) {
            this.changeStream.close();
            this.changeStream = null;
            console.log("Change stream stopped.");
        } else {
            console.log("No active change stream to stop.");
        }
    }
}