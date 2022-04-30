const Sauce = require("../models/Sauce");

exports.getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      console.log("Error after trying to fetch all the sauces: " + error);
      res.status(404).json({
        error,
      });
    });
};

exports.getOneSauce = (req, res) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json({ sauce });
    })
    .catch((error) => {
      console.log(
        "Error after trying to fetch the sauce with the Id :" +
          req.body._id +
          " : " +
          error
      );
      res.status(404).json({
        error,
      });
    });
};

exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const thing = new Thing({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  thing
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => {
      console.log("Error after creating the object: " + error);
      res.status(400).json({ error });
    });
};

exports.modifySauce = (req, res) => {
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId === req.auth.userId) {
        console.log("The user IDs do not match");
        return res.status(401).json({ error: new Error("Forbidden request") });
      }
      res.status(200).json({ message: "Sauce SUCCESSFULLY modified" });
    })
    .catch((error) => {
      console.log(
        "Error found while attempting to modify  the sauce: " + error
      );
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (!sauce) {
      console.log("The sauce is not registered in the database");
      return res.status(404).json({ error: new Error("Sauce not found") });
    }
    if (sauce.userId === req.auth.userId) {
      console.log("The user IDs do not match");
      return res.status(401).json({ error: new Error("Forbidden request") });
    }
    Sauce.deleteOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => {
        res.status(200).json({ message: "Sauce SUCCESSFULLY deleted" });
      })
      .catch((error) => {
        console.log(
          "Error found while attempting to delete the sauce: " + error
        );
        res.status(400).json({ error });
      });
  });
};

exports.likeSauce = (req, res) => {};
