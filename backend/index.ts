require('module-alias/register')
import cors from "cors";
import * as dotenv from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
dotenv.config(); // this line should be executed before importing config
import "./config/config";
import { MongoClient, ServerApiVersion } from "mongodb";
import { Setup } from "@/setup";
import { CryptoSchema } from "@/crypto/data/schema";
import { connection } from "@/crypto/data/connection";
import { router as CryptoManagementRouter } from "@/crypto/router";

const app: Application = express();
const port: number = parseInt(process.env.PORT as string, 10) || 3000;
app.use(express.json());
app.use(cors<cors.CorsRequest>());
app.use(express.urlencoded({ extended: true }));

app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});


// Middleware function for logging the request method and request URL for debugging purpose
const requestLogger = (
    request: Request,
    response: Response,
    next: NextFunction) => {
    console.log(`${request.method} url:: ${request.baseUrl}${request.url}`);
    next()
}
app.use(requestLogger);


// Error handling Middleware function for logging the error message
const errorLogger = (error: Error, request: Request, response: Response, next: NextFunction) => {
    console.log(`error ${error.message}`)
    next(error) // calling next middleware
}
app.use(errorLogger)

//Registering Schemas
connection.model('crypto', CryptoSchema);

app.use('/v1/', CryptoManagementRouter)

app.get(
    "/",
    async (request: Request, response: Response): Promise<Response> => {
        return response.json({ info: "Crypto Node.js, Express, Mongoose, MongoDb" });
    }
);

// function which sends back the response for invalid paths)
const invalidPathHandler = (request: Request, response: Response, next: NextFunction) => {
    response.status(404)
    response.send('invalid path')
}
app.use(invalidPathHandler)

try {
    app.listen(port, () => {
        console.log(`2.App running on port http://localhost:${port}/`);
    });
} catch (error) {
    console.log(`Error occurred: ${error.message}`)
}

const uri = `${process.env.CRYPTO_DATABASE_PROTOCOL}://${process.env.CRYPTO_DATABASE_HOST}:${process.env.CRYPTO_DATABASE_PORT}/`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("3.Successfully connected to MongoDB!");
        await new Setup().saveInitialCryptos()
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);


