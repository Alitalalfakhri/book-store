import { books } from "./data/books.js";
import { useNavigate } from "react-router-dom";
import "./styles/detail-book.css";
;
import { useState, usetEffect, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import cart from "./scripts/cart.js";
function DetailBook(props) {

  
  
  const navigate = useNavigate();
  const book = books.find((book) => book.id === props.bookId);

  const dialogRef = useRef(null);

  const [bookName, setBookName] = useState("");

  const showDialog = (bookName) => {
    setBookName(bookName);
    dialogRef.current.showModal(); 
    setTimeout(() => {
      dialogRef.current.close();
    }, 1500);
  };

  function backHome() {
    navigate("/");
  }
  function buy(id) {
    cart.addToCart(id);
  }
  function updateCart() {
    props.updateCart();
  }
  if (books.length === 0 || books === undefined){
    return (
      <div style={{
       marginTop:"120px"
      }} className="detail-book-empty">
       <p style={
       {
         color: "red",
         fontSize: "30px",
         fontWeight: "bold",
         textAlign: "center",
       }
       }>error getting the data </p>
        <button onClick={() => {backHome()}}>back home</button>
      </div>
    );
  }
  if (book) {
    return (
      <div className="page-container">
        <div className="details-head">
          <div className="image">
            <img src={book.image} alt={book.name} />
          </div>
          <div className="titel">
            <h2>{book.name}</h2>
          </div>
        </div>

        <div className="description-box">
          <p className="description">{book.description}</p>
        </div>

        <div className="price-rating">
          <p>Price: ${(book.priceCents / 100).toFixed(2)}</p>
          <p>
            Rating: {book.rating.stars}/10 ({book.rating.count} reviews)
          </p>
        </div>

        <button
          onClick={() => {
            backHome();
          }}
          className="back-home-button"
        >
          Back Home
        </button>
        <button
          onClick={() => {
            buy(book.id);
            updateCart();
            showDialog(book.name)
          }}
          className="back-home-button"
        >
          buy
        </button>
        <dialog ref={dialogRef} className="add-dialog">
          <FaCheckCircle />

          <p>Added: {bookName}</p>
        </dialog>
      </div>
    );
  } else {
    return (
      <>
        <h1>Unknown error</h1>
        <button
          onClick={() => {
            backHome();
          }}
          className="back-home-button"
        >
          Back Home
        </button>
      </>
    );
  }
}

export default DetailBook;
