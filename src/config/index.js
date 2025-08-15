import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  BASE_URL: process.env.BASE_URL + (process.env.PORT ? `:${process.env.PORT}` : ""),
  STATIC_PATH: "/public",
};

export default config;
