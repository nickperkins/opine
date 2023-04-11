export interface Comment {
    id: string
    author: string
    body: string
}

export type CommentParam = {
    author: string
    body: string
}

export const getComments = async (DB: D1Database, slug: string): Promise<Comment[]> => {
    const comments: Comment[] = [];

    const { results } = await DB.prepare(`
    SELECT * FROM comments where post_slug = (?)
    `).bind(slug).all();

    results.forEach((comment: Comment) => {
        comments.push(comment);
    });

    return comments;
}

export const postComment = async (DB: D1Database, slug: string, comment: CommentParam): Promise<boolean> => {
    if (!slug) return false;
    console.log(comment);
    if (!(comment && comment.author && comment.body)) return false;

    const { success } = await DB.prepare(`
		INSERT INTO comments (author, body, post_slug) VALUES (?, ?, ?)
	`).bind(comment.author, comment.body, slug).run();

    if (!success) return false;
    return true;
}