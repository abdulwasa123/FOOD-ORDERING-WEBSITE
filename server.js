const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cookies = require("cookie-parser");
const authMiddleware = require("./middleware/authMiddleware");
const session = require('express-session');

dotenv.config();

const PORT = process.env.PORT;

// ✅ Connect DB before routes
connectDB();

app.use(session({
  secret: 'kdkdjdjjdhscjc8uuc8wu8cujwij8x8q', // change this to something strong
  resave: false,
  saveUninitialized: true
}));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ Now you can use bodyParser and other middleware
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.use(cookies());
app.use(authMiddleware);

// ✅ All other routes
app.use("/", require("./routes/foodRoute"));
app.use("/", require("./routes/registerRoute"));
app.use("/", require("./routes/loginRoute"));
app.use("/", require("./routes/cartRoute"));
app.use("/", require("./routes/orderRoute"));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).render('404.ejs', { title: 'Page Not Found' });
});


// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
