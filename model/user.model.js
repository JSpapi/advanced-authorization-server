import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Пожалуйста, укажите уникальное имя пользователя"],
    unique: [true, "Пользователь с таким именим уже существует"],
  },
  password: {
    type: String,
    required: [true, "Пожалуйста, укажите пароль"],
    unique: false,
  },
  email: {
    type: String,
    required: [true, "Пожалуйста, укажите уникальное email"],
    unique: true,
  },
  firstName: { type: String },
  lastName: { type: String },
  mobile: { type: String },
  address: { type: String },
  profile: { type: String },
});

export default mongoose.model.Users || mongoose.model("User", UserSchema);
