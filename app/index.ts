import * as redis from "redis";
import { createApp } from "./app";
const port = 3200;
const LIST_KEY = "messages";

const startServer = async () => {
  const client = redis.createClient({ url: "redis://localhost:6379" });
  await client.connect();

  const app = createApp(client);

  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
};

startServer();
