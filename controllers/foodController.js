const Food = require("../models/food");
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

     const renderCartPage = (req, res) => {
        res.render("cart.ejs", { query: req.query, user: req.user }); // Render the cart page
    };

    const renderOrderPage = (req, res) => {
        res.render("order.ejs", { query: req.query, user: req.user }); // Render the order page
    };

    const rendermyOrdersPage = (req, res) => {
        res.render("myOrders.ejs", { query: req.query, user: req.user }); // Render the myOrders page
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