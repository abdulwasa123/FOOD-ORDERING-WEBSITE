const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Food = require('../models/food');

exports.checkout = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Save delivery info temporarily
    req.session.deliveryInfo = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      zipcode: req.body.zipcode,
      country: req.body.country,
      phone: req.body.phone
    };

    // 2. Find cart and build line items
    const cart = await Cart.findOne({ userId }).populate('items.foodId');
    if (!cart || cart.items.length === 0) return res.redirect('/cart');

    const lineItems = cart.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.foodId.title },
        unit_amount: Math.round(item.foodId.price * 100)
      },
      quantity: item.quantity
    }));

    // Add $3 delivery fee
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: 'Delivery Fee' },
        unit_amount: 300
      },
      quantity: 1
    });

    // 3. Create new Stripe checkout session every time
    const sessionStripe = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: "http://localhost:5000/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5000/cart",
      customer_email: req.body.email,
      metadata: {
        userId: userId.toString()
      }
    });

    // 4. Redirect user to Stripe checkout URL
    res.redirect(303, sessionStripe.url);
  } catch (err) {
    console.error('checkout error:', err);
    res.redirect('/cart');
  }
};

exports.orderSuccess = async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    if (!sessionId) return res.redirect('/cart');

    // Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Validate session and payment status
    if (!session || session.payment_status !== 'paid') {
      return res.redirect('/cart');
    }

    // Verify customer email matches logged-in user email for safety
    if (session.customer_email !== req.user.email) {
      return res.status(403).send('Unauthorized session access.');
    }

    // Check if order for this session already exists (prevent duplicates)
    let existingOrder = await Order.findOne({ sessionId });
    if (existingOrder) {
      // Render success page with existing order (already processed)
      return res.render('success.ejs', { order: existingOrder });
    }

    // Find user cart and validate
    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.foodId');
    if (!cart || cart.items.length === 0) return res.redirect('/cart');

    // Save new order
    const order = new Order({
      user: req.user._id,
      items: cart.items.map(it => ({
        food: it.foodId._id,
        quantity: it.quantity,
        price: it.foodId.price
      })),
      totalAmount: session.amount_total / 100,
      deliveryInfo: req.session.deliveryInfo || {},
      status: 'Food Processing',
      sessionId  // save session id to prevent duplicate orders
    });
    await order.save();

    // Clear cart and session delivery info
    await Cart.deleteOne({ userId: req.user._id });
    req.session.deliveryInfo = null;

    // Render success page
    res.render('success.ejs', { order });
  } catch (err) {
    console.error('orderSuccess error:', err);
    res.redirect('/cart');
  }
};