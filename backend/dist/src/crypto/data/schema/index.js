"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CryptoSchema = new mongoose_1.Schema({
    symbol: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    image: { type: String, required: true },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
//# sourceMappingURL=index.js.map