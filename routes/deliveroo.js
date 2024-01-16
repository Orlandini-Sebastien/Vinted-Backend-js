const express = require("express");
const app = express();
const axios = require("axios");
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGQxMDRkZTU0ZjdmNTAwMTQ4ZDUyMDgiLCJlbWFpbCI6InNlYmFzdGllbi5vcmxhbmRpbmlAZ21haWwuY29tIiwiZXhwaXJhdGlvbkRhdGUiOiIyMDI0LTA2LTE1VDIzOjAwOjAwLjAwMFoiLCJpc1RyYWluaW5nIjp0cnVlLCJpYXQiOjE3MDUzOTU0NzZ9.g8EarqzCN18ZKkVUzBw19ZW17HrzXZ5RgxQL7fS4AMo";

router.get("/deliveroo", async(req, res) => {
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