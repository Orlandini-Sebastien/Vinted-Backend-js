const express = require("express");

const stripe = require("stripe")(process.env.SRIPE_SECRET_KEY);
const app = express();
const isAuthenticated = require("../middlewars/isAuthenticated");
const router = express.Router();
app.use(express.json());


router.post("/payment", isAuthenticated ,  async(req,res) => {
    const stripeToken = req.body.stripeToken;
    const response = await stripe.charges.create({
        amount: 2000,
        currency: "eur",
        description: "La description de l'objet acheté",
        // On envoie ici le token
        source: stripeToken,
      });
      console.log(response.status);
      res.json(response.status)
})

module.exports= router;