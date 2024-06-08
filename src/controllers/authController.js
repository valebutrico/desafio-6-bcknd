import bcrypt from "bcrypt";
import User from "../models/user.js";

const getUsernameFromEmail = (email) => {
  return email.split("@")[0];
};

export const register = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword, role: "user" });

  await newUser.save();
  res.redirect("/login");
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.session.user = {
      email,
      role: "admin",
      username: getUsernameFromEmail(email),
    };
    return res.redirect("/products");
  }

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.redirect("/login");
  }

  req.session.user = {
    email: user.email,
    role: user.role,
    username: getUsernameFromEmail(user.email),
  };
  res.redirect("/products");
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.redirect("/products");
    res.redirect("/login");
  });
};