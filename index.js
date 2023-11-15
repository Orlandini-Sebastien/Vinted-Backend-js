const express = require('express');
const app = express();

const mongoose = require("mongoose");
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/Vinted");

const userRoutes = require("./routes/user");
app.use(userRoutes);
const offerRoutes = require("./routes/offer");
app.use(offerRoutes);
const offersRoutes = require("./routes/offers");
app.use(offersRoutes);

app.all("*", (req,res)=>{
    res.status(404).json({message: "Not found"});
})

app.listen(3000, (req,res)=>{
  console.log("Server has started");
} );