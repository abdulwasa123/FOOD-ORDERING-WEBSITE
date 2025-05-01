const renderHomePage = (req, res) => {
         res.render("HomePage.ejs", { query: req.query, user: req.user }); // Render the home page
     };

     const renderLoggedinPage = (req, res) => {
        res.render("LoggedinPage.ejs", { query: req.query, user: req.user }); // Render the loggedin page
    };
      
module.exports = {
    renderHomePage,
    renderLoggedinPage,
};