const express = require("express");
const router = express.Router();

const stripe  = require ("stripe")(process.env.SRIPE_SECRET_KEY)
const isAuthenticated = require("../middlewars/isAuthenticated");


 

router.post("/payment", isAuthenticated,  async (req, res) => {
  res.set('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', "https://thriving-medovik-6bc46e.netlify.app");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    const stripeToken = req.body.stripeToken;
    const response = await stripe.charges.create({
      amount: 2000,
      currency: "eur",
      description: "La description de l'objet acheté",
 
      source: stripeToken,
    });
    console.log(response.status);
  
  
    res.json(response);
  });
  
  module.exports= router;
