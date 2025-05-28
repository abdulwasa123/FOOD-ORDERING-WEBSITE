const Cart = require("../models/cartModel");

// POST /add-to-cart
const addToCart = async (req, res) => {
  console.log("✅ /add-to-cart called", req.body);

  const { foodId, title, price, quantity } = req.body;
  const userId = req.user._id;

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(i => i.foodId.toString() === foodId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
    cart.items[itemIndex].total = cart.items[itemIndex].quantity * price;
  } else {
    cart.items.push({ foodId, title, price, quantity, total: price * quantity });
  }

  await cart.save();
  res.json(cart);
};

// Increase quantity by 1
const increaseQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { foodId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const item = cart.items.find(i => i.foodId.toString() === foodId);
    if (!item) return res.status(404).json({ error: "Item not in cart" });

    // increment
    item.quantity += 1;
    // recalc total
    item.total = item.quantity * item.price;

    await cart.save();
    await cart.populate("items.foodId");
    res.json(cart);
  } catch (err) {
    console.error("Error in increaseQuantity:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Decrease quantity by 1 (and remove if 0)
const decreaseQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { foodId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const itemIndex = cart.items.findIndex(i => i.foodId.toString() === foodId);
    if (itemIndex === -1) return res.status(404).json({ error: "Item not in cart" });

    const item = cart.items[itemIndex];
    item.quantity -= 1;

    if (item.quantity <= 0) {
      // remove entirely
      cart.items.splice(itemIndex, 1);
    } else {
      // update total
      item.total = item.quantity * item.price;
    }

    await cart.save();
    await cart.populate("items.foodId");
    res.json(cart);
  } catch (err) {
    console.error("Error in decreaseQuantity:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const foodId = req.params.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).send("Cart not found");

    // Filter out the item
    cart.items = cart.items.filter(item => item.foodId.toString() !== foodId);

    await cart.save();
    console.log("item removed from cart");
    res.redirect("/cart?productDeleted=1");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting food.");
  }
};

module.exports = {
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    deleteFromCart,
    // createCheckoutSession,
};