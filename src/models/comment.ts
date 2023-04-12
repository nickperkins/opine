import { D1Orm, DataTypes, Model } from "d1-orm";
import type { Infer } from "d1-orm";

export type Comment = Infer<typeof comments>;

export const comments = new Model(
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
  DB: D1Database,
  slug: string
): Promise<Comment[]> => {
  const orm = new D1Orm(DB);

  comments.SetOrm(orm);

  const results = await comments.All({
    where: { post_slug: slug },
  });

  if (!results.success) {
    return [];
  }
  return results.results;
};

export const postComment = async (
  DB: D1Database,
  slug: string,
  comment: CommentParam
): Promise<boolean> => {
  if (!slug) return false;

  if (!(comment && comment.author && comment.body)) return false;

  const orm = new D1Orm(DB);
  comments.SetOrm(orm);

  const result = await comments.InsertOne({
    author: comment.author,
    body: comment.body,
    post_slug: slug,
  });

  if (!result.success) return false;
  return true;
};
