const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const dotEnv = require("dotenv");
dotEnv.config();

const app = express();
const userRoutes = require("./routes/user");

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

app.use(express.json());

app.use(helmet());

app.use("api/auth", userRoutes);

module.exports = app;
