const Food = require("../models/food");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

const renderHomePage = async (req, res) => {
    try {
        // Find all posts, sorted by newest, and populate user info for post association
        const foods = await Food.find().sort({ createdAt: -1 }).sort({ createdAt: -1 }); 
        // Render posts on the homepage with user information (added association)
        res.render("HomePage.ejs", { foods: foods, query: req.query, user: req.user }); // Render the home page
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching posts.");
    }
     };


    const renderCartPage = async (req, res) => {
      try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate("items.foodId");

        if (!cart) {
          return res.render("cart.ejs", { cart: { items: [] }, subtotal: 0 });
        }

        const subtotal = cart.items.reduce((acc, item) => acc + item.total, 0);

        res.render("cart.ejs", { cart, subtotal });
      } catch (err) {
        console.error("Error loading cart page:", err);
        res.status(500).send("Server error");
      }
    };


    const renderOrderPage = async (req, res) => {
      try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate("items.foodId");

        if (!cart) {
          return res.render("order.ejs", { cart: { items: [] }, subtotal: 0 });
        }

        const subtotal = cart.items.reduce((acc, item) => acc + item.total, 0);

        res.render("order.ejs", { cart, subtotal });
      } catch (err) {
        console.error("Error loading cart page:", err);
        res.status(500).send("Server error");
      }
    };

    const rendermyOrdersPage = async (req, res) => {
      const orders = await Order
        .find({ user: req.user._id })
        .populate('items.food');   // <-- use .food, not .foodId
      res.render('myOrders.ejs', { orders });
    };
    
    // display images
          const getImages = async (req, res) => {
                try {
                  const food = await Food.findById(req.params.id);
                  if (!food || !food.image) {
                    return res.status(404).send('Image not found');
                  }
              
                  res.set('Content-Type', food.contentType);
                  res.send(food.image); // Send the image buffer as the response
                } catch (err) {
                  res.status(500).send('Error fetching image');
                }
        };      
      
module.exports = {
    renderHomePage,
    renderCartPage,
    renderOrderPage,
    rendermyOrdersPage,
    getImages,  
};