const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

exports.checkout = async (req, res) => {
  const userId = req.user._id;

  /* ---------- 1. save delivery info temporarily ---------- */
  req.session.deliveryInfo = {
    firstName: req.body.firstName,
    lastName : req.body.lastName,
    email    : req.body.email,
    street   : req.body.street,
    city     : req.body.city,
    state    : req.body.state,
    zipcode  : req.body.zipcode,
    country  : req.body.country,
    phone    : req.body.phone
  };

  /* ---------- 2. build Stripe session ---------- */
  const cart = await Cart.findOne({ userId }).populate('items.foodId');
  if (!cart || cart.items.length === 0) return res.redirect('/cart');

  const lineItems = cart.items.map(item => ({
    price_data: {
      currency   : 'usd',
      product_data: { name: item.foodId.title },
      unit_amount: Math.round(item.foodId.price * 100)
    },
    quantity: item.quantity
  }));

  // $3 delivery fee
  lineItems.push({
    price_data: {
      currency   : 'usd',
      product_data: { name: 'Delivery Fee' },
      unit_amount: 300
    },
    quantity: 1
  });

  const sessionStripe = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items : lineItems,
    mode       : 'payment',
    success_url: "http://localhost:5000/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url : "http://localhost:5000/cart",
    customer_email: req.body.email
  });

  res.redirect(303, sessionStripe.url);
};

exports.orderSuccess = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    if (!session || session.payment_status !== 'paid') return res.redirect('/cart');

    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.foodId');
    if (!cart || cart.items.length === 0) return res.redirect('/cart');

    /* ---------- save order with delivery info ---------- */
    const order = new Order({
      user : req.user._id,
      items: cart.items.map(it => ({
      food : it.foodId._id,
      quantity : it.quantity,
      price: it.foodId.price
      })),
      totalAmount : session.amount_total / 100,
      deliveryInfo: req.session.deliveryInfo,   // <-- here
      status : 'Food Processing',
      sessionId: session.id,
    });
    await order.save();

    await Cart.deleteOne({ userId: req.user._id });
    req.session.deliveryInfo = null;  // clear temp data

    res.render('success.ejs', { order });
  } catch (err) {
    console.error('orderSuccess error:', err);
    res.redirect('/cart');
  }
};