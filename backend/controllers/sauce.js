const Sauce = require('../models/sauce');
const fs = require('fs');
const jwt = require("jsonwebtoken");

exports.createSauce = (req, res, next) => {  
  if (req.body.userId !== console.log(process.userId))  {
    return res.status(403).json({message : 'Non autorisé'});
  } else{
  const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
    });
    sauce.save().then(
      () => {
        res.status(201).json({
          message: 'Sauce ajoutée!'
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  }
  };
  
  exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
      _id: req.params.id
    }).then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };
  
  exports.modifySauce = (req, res, next) => {
    if (req.body.userId !== console.log(process.userId))  {
      return res.status(403).json({message : 'Non autorisé'});
    } else {
    const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {...req.body }

  Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
      .then(res.status(200).json({ message: "Sauce modifiée" }))
      .catch((error) => res.status(400).json({ error }))
}
  };
   
  exports.deleteSauce = (req, res) => {
    if (req.body.userId !== console.log(process.userId))  {
      return res.status(403).json({message : 'Non autorisé'});
    } else {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {

            const fileName = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${fileName}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "La sauce a été supprimée !" }))
                    .catch((error) => res.status(400).json({ error }));
            });

        })
        .catch((error) => res.status(500).json({ error }))
      }
};
  
  exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
      (sauces) => {
        res.status(200).json(sauces);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

  exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;
    const sauceId = req.params.id;
    if (req.body.userId !== console.log(process.userId))  {
      return res.status(403).json({message : 'Non autorisé'});
    } else  {
    if(like === 1){
        Sauce.updateOne({ _id: sauceId } ,{ $inc: { likes: 1 }, $push: { usersLiked: userId }})
            .then( () => res.status(200).json({ message: 'Like ajouté !' }))
            .catch(error => res.status(400).json({ error }));
    }else if(like === -1){
        Sauce.updateOne({ _id: sauceId } ,{ $inc: { dislikes: 1 }, $push: { usersDisliked: userId }})
            .then( () => res.status(200).json({ message: 'Dislike ajouté !' }))
            .catch(error => res.status(400).json({ error }));
    }else{
        Sauce.findOne({ _id: sauceId })
            .then(sauce => {
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne({ _id: sauceId }, { $inc: { likes: -1 }, $pull: { usersLiked: userId } })
                        .then(() => { res.status(200).json({ message: 'Like supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({ _id: sauceId }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } })
                        .then(() => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
  }
}