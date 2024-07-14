import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import * as comments from "./models/comment";
import { Bindings } from "./global";

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", prettyJSON());
app.use("*", cors());

app.get("/", async (c) => {
  return c.json({ message: "Comments API!" });
});

app.get("/comments/:slug", async (c) => {
  const { slug } = c.req.param();

  const result = await comments.getComments(c.env.OPINE, slug);
  console.log(result);
  // if (result?.length == 0) {
  //     return c.json({});
  // }
  return c.json(result);
});

app.post("/comments/:slug", async (c) => {
  const { slug } = c.req.param();
  const param = await c.req.json();
  const result = await comments.postComment(
    c.env.OPINE,
    slug,
    param as comments.CommentParam
  );
  return c.json(result);
});

export default app;
