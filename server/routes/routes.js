
//routes.js

const express = require("express");
const router = express.Router();
const products = require("../models/products");
const verifyToken = require("../middleware/authMiddleware");

const multer = require('multer');
const path = require('path');



router.get("/all-products", async (req, res) => {
  const details = await products.find({});
  res.json(details);
});

router.get("/all-products/:id", async (req, res) => {
  const productId = req.params.id;
  const details = await products.findOne({ productId: productId }, { _id: 0 });
  res.json(details);
});




router.get("/products", verifyToken, async (req, res) => {
  const details = await products.find({});
  res.json(details);
});

router.get("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const details = await products.findOne({ productId: productId }, { _id: 0 });
  res.json(details);
});


//---------------------------------------------------------------

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the upload folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Save with timestamp and original file extension
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpeg, .jpg, and .png format allowed!"));
    }
  }
});

// POST route to add a product with image upload
router.post("/products", upload.single('image'), async (req, res) => {
  try {
    const { productName, category, description, price } = req.body;
    const imagePath = req.file ? req.file.path : null; // Save file path if uploaded

    const newProduct = new products({
      productId: Date.now().toString(), // Generate unique productId
      productName,
      category,
      description,
      price,
      imagePath // Store image path in database
    });

    const result = await newProduct.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/products/:id", async (req, res) => {
  const data = req.body;
  const productId = data.productId;
  try {
    const result = await products.findOneAndUpdate(
      { productId: productId},
      req.body,
      { new: true, runValidators: true }
    );
    if (!result) {
      return res.status(404).send("Item not found");
    }
    res.send("Item updated successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.delete("/products/:id",verifyToken, async (req, res) => {
  const productId = req.params.id;
  if(req.userType != 'admin'){
    return res
    .status(401)
    .json({ error: "Authentication failed- password doesn't match" });
  }
  try {
    const result = await products.findOneAndDelete({ productId: productId });
    if (!result) {
      return res.status(404).send("Item not found");
    }
    res.send("Item deleted successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});


router.get('/products/:id', async (req, res) => {
  try {
      const product = await products.findById(req.params.id);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});


router.get('/products/category/:category', async (req, res) => {
  const { category } = req.params;
  
  try {
      const filteredProducts = await products.find({ category: category });
      res.json(filteredProducts);
  } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).json({ message: 'Server error' });
  }
});



router.get('/all-products/category/:category', async (req, res) => {
  const { category } = req.params;
  
  try {
      const filteredProducts = await products.find({ category: category });
      res.json(filteredProducts);
  } catch (error) {
      console.error('Error fetching products by category:', error);
      res.status(500).json({ message: 'Server error' });
  }
});


router.post('/products/view-review/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userEmail = req.email; 
  const { reviewText, rating } = req.body; 

  try {
      const updatedProduct = await products.findOneAndUpdate(
          { productId: id },
          { $push: { reviews: { userDetails: userEmail, reviewText, rating } } },
          { new: true }
      );

      if (!updatedProduct) {
          return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json(updatedProduct);
  } catch (err) {
      console.error('Error adding review:', err.message);
      res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/products/view-review/:id', async (req, res) => {
  const productId = req.params.id;
  try {
      const product = await products.findOne({ productId: productId });
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product.reviews);
  } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Server error while fetching reviews' });
  }
});



router.get('/all-products/view-review/:id', async (req, res) => {
  const productId = req.params.id;
  try {
      const product = await products.findOne({ productId: productId });
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product.reviews);
  } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Server error while fetching reviews' });
  }
});

router.put('/products/view-review/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userEmail = req.email; 
  const { reviewText, rating } = req.body;

  try {
    const product = await products.findOne({ productId: id });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const review = product.reviews.find(r => r.userDetails === userEmail);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.reviewText = reviewText || review.reviewText;
    review.rating = rating || review.rating;

    await product.save();
    res.status(200).json(product);
  } catch (err) {
    console.error('Error updating review:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get('/user-home/reviewed-products', verifyToken, async (req, res) => {
  try {
    const userEmail = req.email; 
    const reviewedProducts = await products.find({ 'reviews.userDetails': userEmail });

    
    const filteredProducts = reviewedProducts.map(product => {
      product.reviews = product.reviews.filter(review => review.userDetails === userEmail);
      return product;
    });

    if (filteredProducts.length === 0) return res.status(404).json({ message: 'No reviewed products found' });

    res.json(filteredProducts);
  } catch (error) {
    console.error('Error fetching reviewed products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




router.get('/products/product-reviews/:id', async (req, res) => {
  const productId = req.params.id;
  try {
      const product = await products.findOne({ productId: productId });
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product.reviews);
  } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Server error while fetching reviews' });
  }
});



module.exports = router;

