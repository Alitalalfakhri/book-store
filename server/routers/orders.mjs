import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/addOrder', async(req, res) => {
  const {itemsArray , price , date , phone , street , city , uid , id} = req.body;

  console.log(req.body)
  res.send("order post")
})

export default router;