import { Schema } from "mongoose";

export let CryptoSchema = new Schema({
    symbol: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    image: { type: String, required: true },
    cryptoId: { type: String, required: true },
    priceList: [{
        price: String,
        time: { type: Date, default: Date.now }
    }],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })