"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('module-alias/register');
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv.config(); // this line should be executed before importing config
require("./config/config");
const mongodb_1 = require("mongodb");
const setup_1 = require("@/setup");
const schema_1 = require("@/crypto/data/schema");
const connection_1 = require("@/crypto/data/connection");
const router_1 = require("@/crypto/router");
const app = (0, express_1.default)();
const port = parseInt(process.env.PORT, 10) || 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
// Middleware function for logging the request method and request URL for debugging purpose
const requestLogger = (request, response, next) => {
    console.log(`${request.method} url:: ${request.baseUrl}${request.url}`);
    next();
};
app.use(requestLogger);
// Error handling Middleware function for logging the error message
const errorLogger = (error, request, response, next) => {
    console.log(`error ${error.message}`);
    next(error); // calling next middleware
};
app.use(errorLogger);
//Registering Schemas
connection_1.connection.model('crypto', schema_1.CryptoSchema);
app.use('/v1/', router_1.router);
app.get("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    return response.json({ info: "Crypto Node.js, Express, Mongoose, MongoDb" });
}));
// function which sends back the response for invalid paths)
const invalidPathHandler = (request, response, next) => {
    response.status(404);
    response.send('invalid path');
};
app.use(invalidPathHandler);
try {
    app.listen(port, () => {
        console.log(`2.App running on port http://localhost:${port}/`);
    });
}
catch (error) {
    console.log(`Error occurred: ${error.message}`);
}
const uri = `${process.env.CRYPTO_DATABASE_PROTOCOL}://${process.env.CRYPTO_DATABASE_HOST}:${process.env.CRYPTO_DATABASE_PORT}/`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect the client to the server	(optional starting in v4.7)
            yield client.connect();
            // Send a ping to confirm a successful connection
            yield client.db("admin").command({ ping: 1 });
            console.log("3.Successfully connected to MongoDB!");
            yield new setup_1.Setup().saveInitialCryptos();
        }
        finally {
            // Ensures that the client will close when you finish/error
            yield client.close();
        }
    });
}
run().catch(console.dir);
//# sourceMappingURL=index.js.map