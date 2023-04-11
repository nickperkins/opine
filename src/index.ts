import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON} from "hono/pretty-json";

type Bindings = {
	OPINE: D1Database;
	ACCESS_CONTROL_ALLOWED_ORIGIN: string;
}

const app = new Hono<{ Bindings: Bindings }>().basePath('/api/comments/');
app.use('*', prettyJSON());
app.use('*', async (c, next) => {
	const cors_headers = cors({
		origin: c.env.ACCESS_CONTROL_ALLOWED_ORIGIN,
		allowMethods: ['POST', 'GET', 'DELETE', 'OPTIONS'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true,
	});
	await cors_headers(c, next);
}

)

app.get(':slug', async (c) => {
	const { slug } = c.req.param();

	const { results }  = await c.env.OPINE.prepare(`
		SELECT * FROM comments where post_slug = (?)
	`).bind(slug).all();

	if (results?.length == 0) {
		c.status(204);
		return c.text('');
	}
	return c.json(results);
});

app.post(':slug', async (c) => {
	const { slug } = c.req.param();
	const { author, body } = await c.req.json();

	if (!author || !body) {
		c.status(500);
		const response = {
			"Error": "Required value missing"
		}
		return c.json(response);
	}

	const { success } = await c.env.OPINE.prepare(`
		INSERT INTO comments (author, body, post_slug) VALUES (?, ?, ?)
	`).bind(author, body, slug).run();

	if (!success) {
		c.status(500);
		return c.text('Unable to save this comment!');
		}

	c.status(201);
	return c.text(`Posted to: ${slug}`);
});

export default app;