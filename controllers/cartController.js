const Food = require("../models/food");
const Cart = require("../models/cartModel");

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

// create checkout session (integrate stripe)

const createCheckoutSession = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate("items.foodId");

  if (!cart || cart.items.length === 0) {
    return res.status(400).send("Cart is empty.");
  }

  const lineItems = cart.items.map(item => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.foodId.title,
      },
      unit_amount: item.price * 100, // Stripe uses cents
    },
    quantity: item.quantity,
  }));

  lineItems.push({
    price_data: {
      currency: "usd",
      product_data: {
        name: "Delivery Fee",
      },
      unit_amount: 300, // $3 delivery fee
    },
    quantity: 1,
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    success_url: "http://localhost:5000/myOrders",
    cancel_url: "http://localhost:5000/cart",
    customer_email: req.user.email,
  });

  res.redirect(303, session.url);
};

module.exports = {
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    deleteFromCart,
    createCheckoutSession,
};