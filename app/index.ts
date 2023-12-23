import dotenv from "dotenv";
import * as redis from "redis";
import { createApp } from "./app";
dotenv.config();
const { PORT, REDIS_URL } = process.env;
if (!PORT || REDIS_URL) throw new Error("PORT or REDIS_URL is required");
const startServer = async () => {
  const client = redis.createClient({ url: REDIS_URL });
  await client.connect();

  const app = createApp(client);

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};

startServer();
