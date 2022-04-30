const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const dotEnv = require("dotenv");
const path = require("path");

const bodyParser = require("body-parser");
dotEnv.config();

const app = express();

mongoose
  .connect(process.env.DB_CONNEXION_URL_LINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connexion réussie!!");
  })
  .catch((error) => {
    console.log("Connexion ÉCHOUÉE!!" + " \nErreur: " + error);
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(helmet());

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

app.use("/api/auth", userRoutes);
app.use("api/sauce", sauceRoutes);

app.use("images", express.static(path.join(__dirname, "images")));

module.exports = app;
