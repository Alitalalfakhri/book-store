import express from 'express';

const router = express.Router();

router.post('/addOrder', async(req, res) => {
  console.log(req.body)
  res.send("order post")
})

export default router;