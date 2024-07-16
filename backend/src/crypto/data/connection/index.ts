import mongoose from 'mongoose';
import { createConnection } from "mongoose";

export let connection = createConnection(
    process.env.CRYPTO_DATABASE_PROTOCOL + '://' +
    process.env.CRYPTO_DATABASE_USERNAME + ':' + process.env.CRYPTO_DATABASE_PASSWORD + '@' +
    process.env.CRYPTO_DATABASE_HOST + ':' + process.env.CRYPTO_DATABASE_PORT,
    {
        dbName: process.env.CRYPTO_DATABASE_NAME
    }
);
