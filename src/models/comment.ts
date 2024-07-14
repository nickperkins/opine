import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { Result } from "../types/Result";
import { Comment } from "../types/Comment";

export type CommentParam = {
  author: string;
  body: string;
};

export const getComments = async (
  DB: D1Database,
  slug: string
): Promise<Comment[] | undefined> => {
  const adapter = new PrismaD1(DB);
  const prisma = new PrismaClient({ adapter });

  const result = await prisma.comments.findMany({ where: { post_slug: slug } });
  return result;
};

export const postComment = async (
  DB: D1Database,
  slug: string,
  comment: CommentParam
): Promise<Result | Comment> => {
  if (!slug) return { result: false, message: "No slug provided" };

  if (!(comment && comment.author && comment.body))
    return { result: false, message: "Invalid comment" };

  const adapter = new PrismaD1(DB);
  const prisma = new PrismaClient({ adapter });

  const result = await prisma.comments.create({
    data: {
      author: comment.author,
      body: comment.body,
      post_slug: slug,
    },
  });
  return result;
};
