import mongoose from "mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";

export const userSchema = async () => {
  const mongod = await MongoMemoryServer.create();
  const getUri = mongod.getUri();

  mongoose.set("strictQuery", true);
  // TODO TEMP FAKE MONGOSE DATABASE
  // const db = await mongoose.connect(getUri);
  // !REAL DB CONNECTION IS HERE
  const db = await mongoose.connect(process.env.MONGO_CONNECT_STR);
  console.log("db is connected");
  return db;
};
