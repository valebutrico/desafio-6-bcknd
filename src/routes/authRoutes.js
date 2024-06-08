import { Router } from "express";
import { register, login, logout } from "../controllers/authController.js";

const router = Router();

router.get("/login", (req, res) => res.render("login"));
router.post("/login", login);
router.get("/register", (req, res) => res.render("register"));
router.post("/register", register);
router.post("/logout", logout);

export default router;