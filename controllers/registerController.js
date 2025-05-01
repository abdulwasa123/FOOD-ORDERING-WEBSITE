const User = require("../models/userModel"); // Import User model

// Route to render the register page
// const renderRegisterPage = (req, res) => {
//     res.render("RegisterPage.ejs"); // Render the register page
// };

// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.redirect('/?showSignup=1&userExists=1');
                //redirects to the sign up popup and displays 
                //a toast if user already exists. the code that handles the 
                //front end of this is in the bottom of homepage.ejs
            }

        // Create a new user
        const newUser = new User({ name, email, password });
        await newUser.save(); // Save user in the database
        
        // Redirect to login after successful registration
        res.redirect('/?showLogin=1');
        console.log("user registered")
    } catch (err) {
        res.status(500).send("Error registering user.");
        console.log(err);
        
    }
};

module.exports = {
    // renderRegisterPage,   // Render register page
    registerUser,         // Register user route
};