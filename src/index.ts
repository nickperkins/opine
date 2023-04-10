import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
	OPINE: D1Database;
	ACCESS_CONTROL_ALLOWED_ORIGIN: string;
}

const app = new Hono<{ Bindings: Bindings }>().basePath('/api/comments');
app.use('*', async (c, next) => {
	const cores = cors({
		origin: c.env.ACCESS_CONTROL_ALLOWED_ORIGIN,
		//allowMethods: ['POST', 'GET', 'DELETE', 'OPTIONS'],
		exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
		maxAge: 600,
		credentials: true,
	});
	return cores(c, next);
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

app.post(':slug', (c) => {
	const { slug } = c.req.param();
	c.status(201);
	return c.text(`Posting to: ${slug}`);
});

app.delete(':slug/:comment', (c) => {
	const { slug, comment } = c.req.param();
	return c.text(`Deleting: ${comment} from ${slug}`);
});

export default app;