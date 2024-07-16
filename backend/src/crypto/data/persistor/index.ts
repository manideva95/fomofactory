import { Crypto } from "../../entity"
import { connection } from "../connection";

export class CryptoPersistor {
    async persistCryptos(cryptos: Crypto[]) {
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

}