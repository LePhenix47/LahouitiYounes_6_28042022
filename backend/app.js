const express = require("express");
const mongoose = require("mongoose");

const app = express();
const userRoutes = require("./routes/user");

mongoose
  .connect(
    "mongodb+srv://YounesLahouiti2:DeezNuts420@clusterdb-projet-exo.6onu6.mongodb.net/DBsauce?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connexion réussie!!");
  })
  .catch(() => {
    console.log("Connexion ÉCHOUÉE!!");
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

app.use("api/auth", userRoutes);

module.exports = app;
