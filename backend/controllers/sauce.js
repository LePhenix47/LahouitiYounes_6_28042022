const Sauce = require("../models/Sauce");
const fileSystem = require("fs");

/*
//Controlleur pour récupérer TOUTES les sauces dans la base de données
*/
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      console.log("SUCCESS trying to find sauces! ");
      res.status(200).json(sauces);
    })
    .catch((error) => {
      console.log("Error after trying to fetch all the sauces: " + error);
      res.status(404).json({
        error,
      });
    });
};

/*
//Controlleur pour récupérer une sauce à partir de son ID dans l'URL
*/
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
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

/*
//Controlleur pour créer une sauce
*/
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const newSauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  newSauce
    .save()
    .then(() => {
      console.log("Sauce SUCCESSFULLY created");
      res.status(201).json({ message: "Sauce object SUCCESSFULLY created!" });
    })
    .catch((error) => {
      console.log("Error after creating the sauce object: " + error);
      res.status(400).json({ error });
    });
};

/*
//Controlleur pour modifier une sauce
*/
exports.modifySauce = (req, res, next) => {
  let oldImageUrl = undefined;
  let filename = undefined;

  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    console.log(sauce);
    oldImageUrl = sauce.imageUrl;
    filename = oldImageUrl.split("/images")[1];
    console.log("-------------------Old image URL " + oldImageUrl);

    fileSystem.unlink(`images/${filename}`, () => {
      console.log("OLD Image with url: " + filename + " successfully deleted");
    });
  });
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() =>
      res.status(200).json({ message: "Sauce Object SUCCESSFULLY modified !" })
    )
    .catch((error) => res.status(400).json({ error }));
};

/*
//Controlleur pour supprimer une sauce
*/
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (!sauce) {
      console.log("The sauce is not registered in the database");
      return res.status(404).json({ error: new Error("Sauce not found") });
    }
    if (sauce.userId !== req.auth.userId) {
      console.log("The user IDs do not match");
      return res.status(403).json({ error: new Error("Forbidden request") });
    }

    const filename = sauce.imageUrl.split("/images")[1];
    fileSystem.unlink(`images/${filename}`, () => {
      Sauce.deleteOne(
        { _id: req.params.id },
        { ...req.body, _id: req.params.id }
      )
        .then(() => {
          console.log("Sauce" + sauce + " SUCCESSFULLY deleted");
          res.status(200).json({ message: "Sauce SUCCESSFULLY deleted" });
        })
        .catch((error) => {
          console.log(
            "Error found while attempting to delete the sauce: " + error
          );
          res.status(400).json({ error });
        });
    });
  });
};

/*
//Controlleur pour le like/dislike d'une sauce
*/
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      let userId = sauce.userId;
      let numberOfLikes = sauce.likes;
      let numberOfDislikes = sauce.dislikes;
      let usersLikedArray = sauce.usersLiked;
      let usersDislikedArray = sauce.usersDisliked;

      let userLikedOrDisliked = req.body.like;
      console.log(
        "Number of likes for the sauce : " +
          sauce.name +
          " is = " +
          userLikedOrDisliked +
          " and likes saved in the database: " +
          numberOfLikes
      );

      /*

function findUserIdInArray (array, userId){
 for(cell of array){
   if(cell.userId === userId){
     return true;
   }
 }
 return false;
}


  switch (userLikedOrDisliked){
        case 1: //Où on like

        if(findUserIdInArray(usersLikedArray, userId)){
          console.log("User ID: " + userId + " found in the usersLikedArray → Like cancelled");
        usersLikedArray.removeToSet(userId); //marche comme le pop() sur JS
        numberOfLikes = usersLikedArray.length;
        }else{
        console.log("User ID: " + userId + " has NOT been found in the array of userIDs → Like added");
        usersLikedArray.addToSet(userId); //marche comme le push() sur JS
        numberOfLikes = usersLikedArray.length;
        }
        
    break;

        case -1: //Où on dislike

        if(findUserId(usersDislikedArray, userId)){
        console.log("User ID: " + userId + " found in the usersDislikedArray → Dislike cancelled");
        usersDislikedArray.removeToSet(userId);
        numberOfLikes = usersLikedArray.length;
        }else{
        console.log("User ID: " + userId + " has NOT been found in the array of userIDs → Dislike added");
        usersDislikedArray.addToSet(userId);
        numberOfLikes = usersLikedArray.length;
        }        
    break;

    default 0: //Pas de likes AJOUTÉS par défaut 
    console.log("Error while attempting to like/dislike")
  }
 }
 

 Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  ).then(
    ()=>{
      res.status(200).json({message: "Sauce object SUCCESSFULLY liked/disliked"})
    }
  ).catch(
    (error)=>{
      res.status(500).json({error});
    }
  )
 
 */
    })
    .catch((error) => {
      console.log("Error while attempting to find the sauce: " + error);
      res.status(404).json({ error });
    });
};
