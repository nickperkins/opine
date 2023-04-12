import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import * as comment from "./models/comment";
import * as User from "./models/user";
import { Database } from "./models/db";
import { D1Dialect } from "kysely-d1";
import { Kysely } from "kysely";

export interface Env {
	OPINE: D1Database;
}

const app = new Hono();

app.use("*", prettyJSON());
app.use("*", cors());
// add db connection to context
app.use('*', async (c, next) => {
	const connection = new Kysely<Database>({
		dialect: new D1Dialect({ database: c.env.OPINE }),
	});

	c.set('db', await connection);
	return await next();
});

app.get("/", async (c) => {
  return c.json({ message: "Comments API!" });
});

app.get("/comments/:slug", async (c) => {
  const { slug } = c.req.param();

  const result = await comment.getComments(c, slug);

  if (result?.length == 0) {
    return c.body(null, 204);
  }
  return c.json(result);
});

app.post("/comments/:slug", async (c) => {
  const { slug } = c.req.param();
  const param = await c.req.json();
  const result = await comment.postComment(
    c,
    slug,
    param as comment.CommentParam
  );
  if (!result) {
    return c.json({ error: "Can not create new comment", ok: false }, 422);
  }
  return c.json({ ok: true }, 201);
});

app.post("/register", async (c) => {
  const user: User.UserType = await c.req.json();
  const result = await User.registerUser(c, user);
  if (!result) {
    return c.json({ error: "Can not create new comment", ok: false }, 422);
  }
  return c.json({ ok: true }, 201);
});

export default app;
