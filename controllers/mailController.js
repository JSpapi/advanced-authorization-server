import nodemailer from "nodemailer";
import Mailgen from "mailgen";

const nodeConfig = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};

const transporter = nodemailer.createTransport(nodeConfig);

const mailGenert = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});

export const registerMail = async (req, res) => {
  const { username, email, text, subject } = req.body;

  const response = {
    body: {
      name: username,
      intro:
        text ||
        "Поздравляю вы успешно создали аккаунт. Забирайтесь на борт, пора взлетать!",
      outro: "Нужна помощь или есть вопросы? Лучше звоните Солу ",
    },
  };

  const emailBody = mailGenert.generate(response);

  const message = {
    from: process.env.EMAIL,
    to: email,
    subject: subject || "Поздравления от AK.Code",
    html: emailBody,
  };

  try {
    await transporter.sendMail(message);
    res.status(200).json({ message: "На ваш email был отправлен сообщение." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "электронная почта недействительна!" });
  }
};
