const express = require("express");
const router = express.Router();
const User = require( "../models/User");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const fileUpload = require("express-fileupload");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });

const convertToBase64 = (file) => {
return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

router.post("/user/signup", fileUpload(), async(req,res)=>{
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const newsletter = req.body.newsletter;



       
        if(username === undefined){
            return res.status(400).json({message: "Users must enter a username"});
        }

        const salt = uid2(16);
        const hash = SHA256(password + salt).toString(encBase64);
        const token = uid2(16);

        const emailAlreadyExist = await User.find({email : req.body.email});
        if(emailAlreadyExist[0] !== undefined){
            return res.status(400).json({message : "Email already exist"});
        }

        const newUser = new User( {
            email: email,
            account: {
              username: username,
              avatar: Object, 
            },
            newsletter: newsletter,
            token: token,
            hash: hash,
            salt: salt,
          });

        // Upload avatar to the request
        if(req.files?.avatar) {
            const convertedPicture = convertToBase64(req.files.avatar);
            const uploadResult = await cloudinary.uploader.upload(
                convertedPicture,
                {folder: `/vinted/users/${newUser._id}`},
                function(error, result) { console.log(result, error);}
        );
        
        // Save the picture in cloudinary
        newUser.account.avatar = uploadResult;
        }

        await newUser.save();
        
        res.status(200).json({
            "_id":newUser._id,
            "token" : newUser.token,
            "account" : newUser.account
        });
    } catch (error) {
        res.status(500).json({message : error.message});
    }
});     

router.post("/user/login", async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({email : email});
        if(!user){
            return res.status(401).json({message : "Email dosn't exist"});
        }

        const salt = user.salt;
        const hash = SHA256(password + salt).toString(encBase64);
        if(hash === user.hash){
           res.status(200).json({
            "_id" : user._id,
            "token": user.token,
            "account" : user.account
            }); 
        } else {
            res.status(401).json({message : "Password do not match"})
        }
    } catch (error) {
        res.status(500).json({message : error.message});
    }
});

module.exports= router;