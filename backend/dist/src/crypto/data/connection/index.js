"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mongoose_1 = require("mongoose");
exports.connection = (0, mongoose_1.createConnection)(process.env.CRYPTO_DATABASE_PROTOCOL + '://' +
    process.env.CRYPTO_DATABASE_USERNAME + ':' + process.env.CRYPTO_DATABASE_PASSWORD + '@' +
    process.env.CRYPTO_DATABASE_HOST + ':' + process.env.CRYPTO_DATABASE_PORT, {
    dbName: process.env.CRYPTO_DATABASE_NAME
});
//# sourceMappingURL=index.js.map