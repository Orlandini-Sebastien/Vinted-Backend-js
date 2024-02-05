const express = require("express");
const router = express.Router();

const stripe  = require ("stripe")(process.env.SRIPE_SECRET_KEY)
const isAuthenticated = require("../middlewars/isAuthenticated");

// For Vinted payment
const corsOptions = {
    origin: 'https://thriving-medovik-6bc46e.netlify.app/payment',
    optionsSuccessStatus: 200
  }
 

router.post("/payment", isAuthenticated, cors(corsOptions),  async (req, res) => {
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
