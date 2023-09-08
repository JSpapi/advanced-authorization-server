import jwt from "jsonwebtoken";
import userModel from "../model/user.model.js";
export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ _id: decoded.id });
    if (!user)
      return res.status(404).json({ message: "Не удалось найти пользователя" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "не авторизован" });
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const { username } = req.query;
    let isExist = await userModel.findOne({ username });
    if (!isExist)
      return res
        .status(404)
        .json({ message: "Пользователь с таким Именим не существует" });
    req.user = isExist;
    next();
  } catch (err) {
    res.status(400).json({ message: "Ошибка с входом в аккаунт" });
  }
};

export const localVariables = async (req, res, next) => {
  req.app.locals = {
    OTP: null,
    ressetSession: false,
  };
  req.user = req.user;
  next();
};
