const express = require("express");
const router = express.Router();

const methods = require("../services/methods");

const fs = require('fs');

router.get(`/:id`, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await methods.getUser(userId);
    console.log("get User Id endpoint");
    console.log(user);
    res.status(200).json({
        user:user
    })
  }catch(err){
    res.status(400).json({
        errorMsg: err
      });
  }
});

router.get(`/:id/avatar`, async (req, res) => {
  const userId = req.params.id;
  console.log(userId);

  try {
    let path = `./images/${userId}.png`;
    const user = await methods.getUser(userId);
    let base64String = '';
    if (fs.existsSync(`./images/${userId}.png`)) {
      console.log("---AVATAR EXISTS-----");
      let sameUrl = await methods.checkUrl(userId, user.data.avatar);
      console.log('same URLLL:  '+ sameUrl)
      if (sameUrl == true) { //same url file uploaded
        console.log('a same url');
        base64String = await methods.returnBase64(path);
        res.status(200).json({
          base64String: base64String
        });
      } else { //different url file uploaded
        console.log('a new url')
         methods.saveAvatar(user.data.avatar, userId);
         base64String = await methods.returnBase64(path);
         res.status(200).json({
            base64String: base64String
          });
      }
    } else {
      console.log("---AVATAR NOT EXISTS-----");
        methods.avatarNotExist(user.data.avatar, userId, path)
        res.status(200).json({
            base64String: base64String
          });
      
    }
  } catch (err) {
    console.error(err);
  }
});



router.delete(`/:id/avatar`, async (req, res) => {
  try{
    const userId = req.params.id;
    methods.deleteFile(userId);
    res.status(200).json({
        msg: ' Avatar Deleted!!'
    })
  }catch(err) {
    res.status(404).json({
        err: err
    })
  }
});




module.exports = router;
