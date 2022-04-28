const express = require("express");

const mongoose = require("mongoose");

const app = express();

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

module.exports = app;
