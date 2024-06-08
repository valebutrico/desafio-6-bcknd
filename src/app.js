import express from "express";
import { create } from "express-handlebars";
import { connectMongoDB } from "./config/database.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import viewRoutes from "./routes/viewRoutes.js";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";

const app = express();

connectMongoDB();

const hbs = create({
  extname: "hbs",
  defaultLayout: "main",
  partialsDir: ["src/views/partials"],
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./src/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

app.use("/", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/", requireAuth, viewRoutes);

app.get("/products", requireAuth, (req, res) => {
  res.render("products", { user: req.session.user, products: [] });
});

app.get('/', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.redirect('/products');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
