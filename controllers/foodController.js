const renderHomePage = (req, res) => {
         res.render("HomePage.ejs", { query: req.query, user: req.user }); // Render the home page
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
      
module.exports = {
    renderHomePage,
    renderCartPage,
    renderOrderPage,
    rendermyOrdersPage,
};