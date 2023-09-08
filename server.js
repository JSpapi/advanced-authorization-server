import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import userRoutes from "./routers/userRoutes.js";
import { userSchema } from "./database/db.js";

const app = express();

// ? MIDDLEWARE
app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb" }));
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.status(200).json("HOME GET REQUESTed");
});

// !AUTHORIZATION ROUTES STARTS HERE
app.use("/api/user", userRoutes);

// !SERVER STARTS HERE

userSchema()
  .then(() => {
    console.log("mongoose is connected");
    app.listen(process.env.PORT, () => {
      console.log("server connected to the port:" + process.env.PORT);
    });
  })
  .catch((err) => console.log(err));
