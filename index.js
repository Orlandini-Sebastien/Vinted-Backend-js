
const express = require('express');
const cors = require("cors");
const app = express();
app.use(express.json());

require('dotenv').config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

// For Vinted payment
const corsOptions = {
  origin: 'https://thriving-medovik-6bc46e.netlify.app',
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.options('*', cors());

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