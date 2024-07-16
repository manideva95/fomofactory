"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Loading the environment variables from the appropriate environment file. */
const dotenv_1 = require("dotenv");
const path_1 = require("path");
switch (process.env.NODE_ENV) {
    case "local":
        console.log("1.FomoFactory Backend: Environment is 'local'");
        (0, dotenv_1.config)({
            path: (0, path_1.resolve)(__dirname, "../../.env.local"),
        });
        break;
    case "development":
        console.log("1.FomoFactory Backend: Environment is 'development'");
        (0, dotenv_1.config)({
            path: (0, path_1.resolve)(__dirname, "../../.env.development"),
        });
        break;
    case "production":
        console.log("Environment is 'production'");
        (0, dotenv_1.config)({
            path: (0, path_1.resolve)(__dirname, "../../.env.production"),
        });
        break;
    default:
        throw new Error(`'NODE_ENV' ${process.env.NODE_ENV} is not handled!`);
}
//# sourceMappingURL=config.js.map