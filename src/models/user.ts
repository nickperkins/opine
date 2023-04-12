import { D1Orm, DataTypes, Model } from "d1-orm";
import type { Infer } from "d1-orm";
import { bcrypt } from "bcrypt";
import { jwt } from "jsonwebtoken";
import { Context } from "hono";

export type UserType = Infer<typeof User>;

export const User = new Model(
  {
    tableName: "users",
    primaryKeys: "id",
    autoIncrement: "id",
    uniqueKeys: [["email"]],
  },
  {
    id: {
      type: DataTypes.INTEGER,
      notNull: true,
    },
    name: {
      type: DataTypes.STRING,
      notNull: true,
    },
    email: {
      type: DataTypes.STRING,
      notNull: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING,
    },
  }
);

export const registerUser = async (
  c: Context,
  userParam: UserType
) => {
  const { name, email, password } = userParam;

  if (!(email && password && name)) {
    return { error: true, message: "All fields must be set" };
  }

  //Encrypt user password
  const encryptedUserPassword = await bcrypt.hash(password, 10);

  const orm = new D1Orm(c.env.OPINE);

  User.SetOrm(orm);

  const result = await User.InsertOne({
    name: name,
    email: email,
    password: encryptedUserPassword,
  });

  const user = result.results[0];

  const token = jwt.sign({ user_id: user.id, email }, c.env.TOKEN_KEY, {
    expiresIn: "5h",
  });
  // save user token
  user.token = token;

  const result2 = await User.Update({
    where: { id: user.id },
    data: { token: user.token },
  });

  if (!result2.success) {
    return { error: true, message: "Unable to create new user" };
  }

  return { error: false, user: user };
};
