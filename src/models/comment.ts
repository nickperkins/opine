import { D1Orm, DataTypes, Model } from "d1-orm";
import type { Infer } from "d1-orm";
import { Context } from "hono";

export type CommentType = Infer<typeof CommentsTable>;

export const CommentsTable = new Model(
  {
    tableName: "comments",
    primaryKeys: "id",
    autoIncrement: "id",
  },
  {
    id: {
      type: DataTypes.INTEGER,
      notNull: true,
    },
    author: {
      type: DataTypes.STRING,
      notNull: true,
    },
    body: {
      type: DataTypes.STRING,
      notNull: true,
    },
    post_slug: {
      type: DataTypes.STRING,
      notNull: true,
    },
  }
);

export type CommentParam = {
  author: string;
  body: string;
};

export const getComments = async (
  c: Context,
  slug: string
): Promise<CommentType[] | undefined> => {
  const orm = new D1Orm(c.env.OPINE);

  CommentsTable.SetOrm(orm);

  const results = await CommentsTable.All({
    where: { post_slug: slug },
  });

  return results.results;
};

export const postComment = async (
  c: Context,
  slug: string,
  comment: CommentParam
): Promise<boolean> => {
  if (!slug) return false;

  if (!(comment && comment.author && comment.body)) return false;

  const orm = new D1Orm(c.env.OPINE);
  CommentsTable.SetOrm(orm);

  const result = await CommentsTable.InsertOne({
    author: comment.author,
    body: comment.body,
    post_slug: slug,
  });

  if (!result.success) return false;
  return true;
};
