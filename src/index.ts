import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from "hono/pretty-json";
import * as model from './model';
import { Bindings } from './bindings'

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', prettyJSON());
app.use('*', cors());

app.get('/', async (c) => {
  return c.json({ message: 'Comments API!' });
});

app.get('/comments/:slug', async (c) => {
	const { slug } = c.req.param();

	const comments = await model.getComments(c.env.OPINE, slug);

	if (comments?.length == 0) {
		return c.body(null, 204);
	}
	return c.json(comments);
});

app.post('/comments/:slug', async (c) => {
	const { slug } = c.req.param();
	const param = await c.req.json();
	const newPost = await model.postComment(c.env.OPINE, slug, param as model.CommentParam);
	console.log(newPost);
	if (!newPost) {
		return c.json({ error: 'Can not create new comment', ok: false }, 422);
	  }
	  return c.json({ ok: true }, 201);

});

export default app;
