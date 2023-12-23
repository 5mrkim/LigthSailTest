import { createApp, ReidsClient } from "./app";
import request, { Response } from "supertest";
import * as redis from "redis";
const LIST_KEY = "messages";
let app: Express.Application;
let client: ReidsClient;
beforeAll(async () => {
  client = redis.createClient({ url: "redis://localhost:6379" });
  await client.connect();
  app = await createApp(client);
});

beforeEach(async () => {
  await client.flushDb();
});

afterAll(async () => {
  await client.flushDb();
  await client.quit();
});

describe("POST /messages", () => {
  it("responds with a success message", async () => {
    const response: Response = await request(app as any)
      .post("/messages")
      .send({ message: "testing jest with redis" });

    // 예상 응답 메시지 또는 기타 검증을 추가할 수 있습니다.
    expect(response.status).toBe(200);
    expect(response.text).toBe("Message added successfully");
  });
});

describe("GET /messages", () => {
  it("responds with all messages", async () => {
    await client.lPush(LIST_KEY, ["msg1", "msg2"]);
    const response = await request(app as any).get("/messages");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(["msg2", "msg1"]);
  });
});
