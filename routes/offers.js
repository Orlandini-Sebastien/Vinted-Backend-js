const express = require("express");
const router = express.Router();
const Offer = require( "../models/Offer");


router.get("/offers", async(req,res)=>{
    try {
        const filters = {};
        let offers={};
        const limit =5;

        // Condition in limit() and skip()
        let page = Number(req.query.page);
        if(!page){page=1;}

        // Condition in the sort
        const sortPrice = req.query.sort;
        let obj={ product_price: sortPrice };
        if(!sortPrice) obj=null;

        // Condition in the find
        const {priceMin, priceMax, product_name} = req.query;
        if(priceMax ||priceMin || product_name ){
            if(priceMax) {
                filters.product_price = {};
                filters.product_price.$lte = priceMax;}
            if(priceMin) {
                filters.product_price = {};
                filters.product_price.$gte = priceMin;}
            if(product_name) filters.product_name =  new RegExp(product_name, "i") ;
            offers = await Offer.find(filters).sort(obj).limit(page*limit).skip((page-1)*limit).populate("owner" , { account: 1 });;
        } else {
            offers = await Offer.find().sort(obj).limit(page*limit).skip((page-1)*limit).populate("owner", { account: 1 });
        }
        res.status(200).json(offers);
    } catch (error) {
        res.status(500).json({message : error.message});
    }
}); 

module.exports= router;