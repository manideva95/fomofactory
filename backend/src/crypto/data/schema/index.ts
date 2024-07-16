import { Schema } from "mongoose";

export let CryptoSchema = new Schema({
    symbol: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    image: { type: String, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })