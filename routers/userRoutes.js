import express from "express";

const routes = express.Router();

import * as userController from "../controllers/userController.js";
import { auth, localVariables, verifyUser } from "../middleware/auth.js";
import { registerMail } from "../controllers/mailController.js";
// !POST METHODS
routes.post("/register", userController.register); // !REGISTER USER
routes.post("/registerEmail", registerMail); // !send the email
// routes.post("/authenticate", (req, res) => res.end()); // !authenticate USER
routes.post("/login", userController.login); // !REGISTER USER

// !GET methods

routes.get("/current", auth, userController.getUser); // !user with name
routes.get(
  "/generateOTP",
  verifyUser,
  localVariables,
  userController.generateOTP
); // !random otp
routes.get("/verifyOTP", verifyUser, userController.verifyOTP); // !verify generated otp
routes.get("/createResetSession", userController.createResetSession); // !reset variables

// !PUT methods

routes.put("/updateuser", auth, userController.updateUser); // !updated user
routes.put("/resetPassword", userController.resetPassword); // !reset passwords
export default routes;
