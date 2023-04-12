import { D1Orm, DataTypes, Model } from "d1-orm";

const User = (orm: D1Orm) =>
  new Model(
    {
      D1Orm: orm,
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
    }
  );
