import express, { NextFunction, Request, Response } from "express";
import { RedisClientType } from "redis";
const LIST_KEY = "messages";
export type ReidsClient = RedisClientType<any, any, any>;

export const createApp = (client: ReidsClient) => {
  const app = express();

  app.use(express.json());

  app.get("/", (req: Request, res: Response, n: NextFunction) => {
    res.status(200).json({
      success: true,
      message: "hello! from express",
      code: 200,
    });
  });

  app.post("/messages", async (request: Request, response: Response) => {
    const { message } = request.body;

    if (!message) {
      throw new Error("Message is required");
    }

    console.log("Received message:", message);
    await client.lPush(LIST_KEY, message);

    response.status(200).send("Message added successfully");
  });

  app.get("/messages", async (req: Request, res: Response, n: NextFunction) => {
    const messages = await client.lRange(LIST_KEY, 0, -1);
    console.log("ready?");
    res.status(200).send(messages);
  });

  return app;
};
