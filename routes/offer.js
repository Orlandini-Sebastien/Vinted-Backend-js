const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const Offer = require( "../models/Offer");
const isAuthenticated = require("../middlewars/isAuthenticated");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

router.post("/offer/publish", isAuthenticated , fileUpload(), async(req,res)=>{
  try {
    const { name, description, price, brand, size, condition, color, city} = req.body;
    // Create new Offer
    const newOffer = new Offer({
        product_name: name,
        product_description: description,
        product_price: price,
        product_details: [
          {MARQUE: brand },
          {TAILLE: size},
          {ÉTAT: condition},
          {COULEUR: color},
          {EMPLACEMENT: city}],
        owner: req.user,
    });
    await newOffer.save();

    // Upload the picture to the request
    const convertedPicture = convertToBase64(req.files.image);
    const uploadResult = await cloudinary.uploader.upload(
        convertedPicture,
        {folder: `/vinted/offers/${newOffer._id}`},
        function(error, result) { console.log(result, error);}
    );
      
    // Save only the secure_url of the picture in cloudinary
    newOffer.product_image = uploadResult.secure_url;
    await newOffer.save();
      
    //Show the newOffer
    res.status(201).json(newOffer);
    } catch (error) {
      res.status(500).json({message : error.message});
    }
});

router.put("/offer/modify", isAuthenticated, fileUpload(), async(req,res)=>{
  try {
    const {product_name, product_description, product_price, product_id} = req.body;

    // Can modify if this is the owner of the offer
    const offer = await Offer.findById(product_id);
    if(!offer.owner.equals(req.user._id)){
      return res.status(401).json({message : "You can't modify ✋"});
    }

    // Modify text 
    offer.product_name = product_name;
    offer.product_description = product_description;
    offer.product_price = product_price;

    // Delete old picture 
    const httpsSplit = offer.product_image.split("/");
    const endOfhttps = httpsSplit[httpsSplit.length-1].split(".");
    const imageToDelete = "vinted/offers/"+product_id+"/"+endOfhttps[0];
    await cloudinary.uploader.destroy(imageToDelete);

    //Save new picture
    const newConvertedPicture = convertToBase64(req.files.product_image);
    const inCloudinary = await cloudinary.uploader.upload(
      newConvertedPicture,
      {folder: `/vinted/offers/${product_id}`}
    );

    offer.product_image = inCloudinary.secure_url;
    await offer.save();
    
    res.status(200).json({message : "Modification registered"})
 
  } catch (error) {
    res.status(500).json({message : error.message});
  }
});

router.delete("/offer/delete/:id", async(req,res)=>{
  try {
    const id = req.params.id;
    const product = await Offer.deleteOne({_id : id});
    res.status(200).json({message : "product is deleted"});
  } catch (error) {
    res.status(500).json({message : error.message});
  }
})

router.get("/offer/:id", async(req,res)=>{
  try {
    const id = req.params.id;
    const product = await Offer.findById(id);
    if(!product){
      return  res.status(404).json({message : "Not found"});
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({message : error.message});
  }
})

module.exports= router;
