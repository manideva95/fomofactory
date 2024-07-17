require('module-alias/register')
import cors from "cors";
import * as dotenv from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
dotenv.config(); // this line should be executed before importing config
import "./config/config";
import { MongoClient, ServerApiVersion } from "mongodb";
import { CryptoSchema } from "./src/crypto/data/schema";
import { connection } from "./src/crypto/data/connection";
import { router as CryptoManagementRouter } from "./src/crypto/router";
import { CryptoManagement } from "./src/crypto/business";
import './src/exceptions/process';
import http from "http";
import { Server as SocketServer, Socket } from "socket.io";
import WebSocket from 'ws';
import { CryptoPersistor } from "./src/crypto/data/persistor";

const app: Application = express();
const port: number = parseInt(process.env.PORT as string, 10) || 3000;
app.use(express.json());
app.use(cors<cors.CorsRequest>());
app.use(express.urlencoded({ extended: true }));
const server = http.createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: "*", // Allow all origins for Socket.IO connections
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});


// Middleware function for logging the request method and request URL for debugging purpose
const requestLogger = (
    request: Request,
    response: Response,
    next: NextFunction) => {
    console.log(`${request.method} url:: ${request.baseUrl}${request.url}`)
    next()
}
app.use(requestLogger);


// Error handling Middleware function for logging the error message
const errorLogger = (error: Error, request: Request, response: Response, next: NextFunction) => {
    console.log("error ${error.message}")
    next(error) // calling next middleware
}
app.use(errorLogger)

//Registering Schemas
connection.model('crypto', CryptoSchema);

app.use('/', CryptoManagementRouter)

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
    server.listen(port, async () => {
        console.log(`2.App running on port http://localhost:${port}/`)
        await run().catch(console.dir);
    });
} catch (error) {
    console.log("Error occurred: ${error.message}")
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
        console.log("3.Successfully connected to MongoDB!")
        await new CryptoManagement().saveInitialCryptos()
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

io.on("connection", async (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });
    // console.log(io.sockets.sockets)
    if (io.sockets.sockets.size === 1) {
        new CryptoPersistor().watchCollection((data) => {
            // Handle subscription to cryptocurrency updates
            if (data) {
                //TODO: here all the changes in db are sent to client, but only need to send the particular crytpo the client asked for, 
                //For time constraints im sending everything to client
                socket.emit("update", data);
            }
        })
    }
    socket.on("subscribe", async (cryptoId: string) => {
        console.log(`Client-${socket.id} subscribed to updates for: ${cryptoId}`);
        //TODO: need to send only the crypto id the client asked for 
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
        console.log(io.sockets.sockets.size)
        // if (io.sockets.sockets.size === 0) {
        //     new CryptoPersistor().stopWatchingCollection()
        // }
    });
});
