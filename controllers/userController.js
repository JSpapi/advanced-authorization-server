import UserModel from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import userModel from "../model/user.model.js";
import otpgenerator from "otp-generator";
// !POST METHODS http://localhost:4080/api/user/register

export const register = async (req, res) => {
  const { username, password, profile, email } = req.body;

  try {
    if (!username || !password || !email) {
      return res.status(400).json({ message: "пожалуйста заполните поля" });
    }

    const existingUsername = await UserModel.findOne({
      username,
    }).exec();

    if (existingUsername) {
      return res
        .status(409)
        .json({ message: "Пользователь с таким именем уже существует" });
    }

    const existingEmail = await UserModel.findOne({
      email,
    }).exec();

    if (existingEmail) {
      return res
        .status(409)
        .json({ message: "Пользователь с таким имейлом уже существует" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
      profile: profile || "",
      email,
    });

    const secret = process.env.JWT_SECRET;
    if (secret && newUser) {
      res.status(201).json({
        id: newUser._id,
        email: newUser.email,
        username,
        profile,
        token: jwt.sign({ id: newUser._id }, secret, { expiresIn: "24h" }),
      });
    } else {
      return res.status(400).json("не удалось создать пользователя");
    }
  } catch (err) {
    return res.status(500).json({ message: "не известная ошибка" });
  }
};

// !POST METHODS http://localhost:4080/api/user/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "пожалуйста заполните поля" });
    }

    const user = await UserModel.findOne({ email }).exec();

    const isPasswordCorrect =
      user && (await bcrypt.compare(password, user.password));

    const secret = process.env.JWT_SECRET;

    if (user && secret && isPasswordCorrect) {
      res.status(200).json({
        id: user.id,
        email,
        username: user.username,
        profile: user.profile,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "24h" }),
      });
    } else {
      return res.status(400).json({ message: "неверный email или пароль" });
    }
  } catch (err) {
    return res.status(500).json({ message: "не известная ошибка" });
  }
};

// !GET METHODS http://localhost:4080/api/user/:id
export const getUser = async (req, res) => {
  const { _id } = req.user;

  try {
    const user = await UserModel.findOne({ _id });

    // ? РАЗДЕЛИТЬ ПАРОЛЬ ПОЛЬЗОВАТЕЛЯ ОТ ДРУГИХ ДАННЫХ  ПОМОЩЬЮ OBJECT ASSIGN
    const { password, ...others } = Object.assign({}, user.toJSON());
    res.status(200).json(others);
  } catch (err) {
    return res.status(404).json({ message: "не удалось найти пользователя" });
  }
};
// !PUT METHODS http://localhost:4080/api/user/updateuser/:id
export const updateUser = async (req, res) => {
  const data = req.body;
  const { _id } = req.user;

  try {
    if (!_id) {
      return res.status(440).json({ message: "время токена истек" });
    }
    const user = await UserModel.findOne({ _id: _id });
    if (user) {
      const updatedUser = await UserModel.updateOne({ _id: _id }, data);
      return res
        .status(201)
        .json({ message: "Пользователь успешно редактирован" });
    } else {
      return res.status(404).json({ message: "Не удалось найти пользователя" });
    }
  } catch (err) {
    res.status(401).json({ message: "не удалось редактировать пользователя" });
  }
};
// !GET METHODS http://localhost:4080/api/user/generateOTP
export const generateOTP = async (req, res) => {
  req.app.locals.OTP = otpgenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const { email } = req.user;

  return res.status(201).send({ code: req.app.locals.OTP, email });
};
// !GET METHODS http://localhost:4080/api/user/verifyOTP
export const verifyOTP = async (req, res) => {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null;
    req.app.locals.ressetSession = true;
    return res
      .status(201)
      .json({ message: "Есть доступ для изменения пароля" });
  }
  return res.status(400).json({ message: "Неверный ОТП" });
};

// !GET METHODS http://localhost:4080/api/user/createResetSession
export const createResetSession = async (req, res) => {
  if (req.app.locals.ressetSession) {
    return res.status(201).json({ flag: req.app.locals.ressetSession });
  }
  return res.status(440).json({ message: "Сеанс истек" });
};
// !PUT METHODS http://localhost:4080/api/user/
export const resetPassword = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!req.app.locals.ressetSession) {
      return res.status(440).json({ message: "Сеанс истек" });
    }

    const user = await userModel.findOne({ username }).exec();

    if (user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      if (hashedPassword) {
        const updatePassword = await userModel.updateOne(
          { email: user.email },
          { password: hashedPassword }
        );
        req.app.locals.ressetSession = false;
        return res.status(201).json({ message: "Пароль обнавлен" });
      } else {
        return res.status(500).json({ message: "проблемы с шифорованием" });
      }
    } else {
      return res
        .status(404)
        .json({ message: "пользователь с таким Именим не существует" });
    }
  } catch (err) {
    return res.status(500).json({ message: "не известная ошибка" });
  }
};
