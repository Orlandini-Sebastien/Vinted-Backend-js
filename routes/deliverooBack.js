const express = require("express");
const app = express();
const axios = require("axios");
const token = process.env.TOKEN;
const router = express.Router();

router.get("/deliverooBack", async(req, res) => {
    try {
       const response = await axios.get("https://lereacteur-bootcamp-api.herokuapp.com/api/deliveroo/menu/paris/3eme-temple/sub-arc-subway-rambuteau?day=today&geohash=u09wj8rk5bqr&time=ASAP", {
  headers: {
    'Authorization': `Bearer ${token}` 
  }
});
    res.json(response.data);
    } catch (error) {
        res.json({error : error.message})
    }

});


module.exports= router;