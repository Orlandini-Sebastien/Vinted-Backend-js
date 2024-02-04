
const express = require('express');
const cors = require("cors");

const creatStripe = require ("stripe")
const stripe = createStripe(process.env.SRIPE_SECRET_KEY)

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://thriving-medovik-6bc46e.netlify.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
  });

const app = express();
app.use(express.json());
app.use(cors());
require('dotenv').config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);


const userRoutes = require("./routes/user");
app.use(userRoutes);
const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

const offersRoutes = require("./routes/offers");
app.use(offersRoutes);

app.post("/payment", async (req, res) => {
  // Réception du token créer via l'API Stripe depuis le Frontend
  const stripeToken = req.body.stripeToken;
  // Créer la transaction
  const response = await stripe.charges.create({
    amount: 2000,
    currency: "eur",
    description: "La description de l'objet acheté",
    // On envoie ici le token
    source: stripeToken,
  });
  console.log(response.status);

  // TODO
  // Sauvegarder la transaction dans une BDD MongoDB

  res.json(response);
});




const deliverooRoutes = require("./routes/deliveroo");
app.use(deliverooRoutes);

const deliverooBackRoutes = require("./routes/deliverooBack");
app.use(deliverooBackRoutes);



app.all("*", (req,res)=>{
    res.status(404).json({message: "😞 Not found 😞"});
})

app.listen(process.env.PORT, (req,res)=>{
  console.log("🚀🚀 Server has started 🚀🚀");
} );