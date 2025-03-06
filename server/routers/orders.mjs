import express from 'express';
import EmailUser from '../shemas/EmailUser.mjs';
import GoogleUser from '../shemas/GoogleUser.mjs';
import mongoose from 'mongoose';
import Order from '../shemas/Order.mjs';

const router = express.Router();

// Endpoint to add an order
router.post('/addOrder', async (req, res) => {
  const { itemsArray, price, date, phone, street, city, uid, type, id } = req.body;

  // Validate required fields
  if (!uid || !type || !itemsArray || !price || !date || !phone || !street || !city || !id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let user;

    // Find the user based on the type
    if (type === "email") {
      user = await EmailUser.findOne({ uid: uid });
    } else if (type === "google") {
      user = await GoogleUser.findOne({ uid: uid });
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the order
    const newOrder = new Order({
      itemsArray: itemsArray,
      price: price,
      date: date,
      phone: phone,
      street: street,
      city: city,
      uid: uid,
      id: id,
    });

    // Save the order
    await newOrder.save();

    // Add the order to the user's orders array
    user.orders.push(newOrder._id); // Assuming `orders` is an array of order IDs in the user schema
    await user.save();

    // Send success response
    res.status(200).json({ message: 'Order added successfully', order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;