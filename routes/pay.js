const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewars/isAuthenticated");

router.get("/pay",isAuthenticated, (req,res)=>{

} )

module.exports= router;