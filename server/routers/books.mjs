import express from 'express';

const router = express.Router();

import Book from '../shemas/Book.mjs';

router.get("/api/books" , async (req, res) => {
  const books = await Book.find();

  res.json(books);
})

export default router;