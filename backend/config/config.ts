/* Loading the environment variables from the appropriate environment file. */
import { config as configDotenv } from "dotenv";
import { resolve } from "path";

switch (process.env.NODE_ENV) {
  case "local":
    console.log("1.FomoFactory Backend: Environment is 'local'");
    configDotenv({
      path: resolve(__dirname, "../../.env.local"),
    });
    break;
  case "development":
    console.log("1.FomoFactory Backend: Environment is 'development'");
    configDotenv({
      path: resolve(__dirname, "../../.env.development"),
    });
    break;
  case "production":
    console.log("Environment is 'production'");
    configDotenv({
      path: resolve(__dirname, "../../.env.production"),
    });
    break;
  default:
    throw new Error(`'NODE_ENV' ${process.env.NODE_ENV} is not handled!`);
}
