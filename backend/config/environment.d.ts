/* A way to declare global variables in TypeScript. */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "local" | "development" | "production";
      DB_HOST: string;
      PORT: string;
      DB_USER: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      DB_PORT: string;
      DB_DRIVER: string;
      JWT_SECRET: string;
      MAIL: string;
      MAIL_PASSWORD: string;
      BASE_URL: string;
      ADMIN_MAIL: string;
      ADMIN_PASSWORD: string;
    }
  }
}
export { };
