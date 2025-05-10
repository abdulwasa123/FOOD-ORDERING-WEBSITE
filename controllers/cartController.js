const Food = require("../models/food");
const Cart = require("../models/cartModel");

const addToCart = async (req, res) => {
    const { foodId, quantity } = req.body;
    const userId = req.user._id;
  
    // Fetch food details (image, title, price) from DB
    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ error: "Food not found" });
  
    // Update or insert item in user's cart
    const updatedCart = await Cart.findOneAndUpdate(
      { userId, "items.foodId": foodId },
      {
        $set: {
          "items.$.quantity": quantity,
          "items.$.total": quantity * food.price
        }
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("items.foodId");
  
    res.json(updatedCart);
  };

module.exports = {
    addToCart,
};