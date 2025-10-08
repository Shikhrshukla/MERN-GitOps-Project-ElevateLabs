
//products schema

const { Schema } = require('mongoose');
const { model } = require('mongoose');


const reviewSchema = new Schema({
   userDetails: { type: String, required: true },
   reviewText: { type: String, default: null },
   rating: { type: Number, min: 1, max: 5, default:null },
   createdAt: { type: Date, default: Date.now }
});


const productSchema = new Schema({
   productId: { type: String, required: true,unique:true },
   productName: { type: String, required: true },
   category: { type: String, required: true },
   description: { type: String, required: true },
   price: { type: String, required: true },
   imagePath: { type: String, default: null }, // Field to store the image path
    reviews: [reviewSchema]  

   
});

const products = model('item',productSchema );

module.exports = products;





