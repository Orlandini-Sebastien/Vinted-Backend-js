require('dotenv').config();

const express = require('express');


const app = express();

const cors = require("cors");
app.use(cors());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', ['https://thriving-medovik-6bc46e.netlify.app' ]);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
  });

const mongoose = require("mongoose");
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI);



const userRoutes = require("./routes/user");
app.use(userRoutes);
const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

const offersRoutes = require("./routes/offers");
app.use(offersRoutes);

const paymentRoutes = require("./routes/payment");
app.use(paymentRoutes);

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