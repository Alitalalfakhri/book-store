import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./Hero.jsx";
import Row from "./Row.jsx";
import DetailBook from "./detail-book.jsx";
import Checkout from "./checkout.jsx";
import Order from "./order.jsx";
import Header from "./Header.jsx";
import cart from "./scripts/cart.js";
import orders from "./scripts/orders.js";
import OrdersPage from "./OrdersPage.jsx";
import SignUpPage from  './Sign-up.jsx';
import User from './features/user/User.jsx'
import axios from "axios";
import {useDispatch , useSelector} from "react-redux";
import {login} from './features/user/userSlice'
import Login from './Login.jsx'


export default function App() {

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const booksState = useSelector(state => state.books);

  const [bookId, setBookId] = useState();
  const [cartQuantity, setCartQuantity] = useState(0);

  // Function to update cart quantity
  function updateCart() {

    // Use reduce to sum the quantities of all items in the cart
    const totalQuantity = cart.cartArray.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    // Set the total quantity in the state
    setCartQuantity(totalQuantity);
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("https://c322ae04-db91-4608-8031-e5257a3ff16c-00-3hoqmrkh6ralv.pike.replit.dev/auth/status")
        
        if (res.data.loggedIn) {
          dispatch(login({
            uid: res.data.userId,
            type: res.data.type
          }));
        }
      } catch (error) {
      
      }

    
      if(res.data.loggedIn){
        dispatch(login({uid:res.data.userId}))
      }
    }
    checkAuth()
  } , [])

 

  // Optionally use useEffect to update cart quantity when cart changes
  useEffect(() => {
    updateCart();
  }, [cart.cartArray]); // This effect will run whenever cart.cartArray changes

  function zeroCart() {
    setCartQuantity(0);
  }

 

  const Headercomponent = <Header cartLength={cartQuantity} />;


 
  return (
    <>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {Headercomponent}
                <Hero />
                <User />
                <Row updateCart={updateCart} getId={(id) => setBookId(id)} />
              </>
            }
          />
          <Route
            path="/detail"
            element={
              <>
                {Headercomponent}
                <DetailBook updateCart={updateCart} bookId={bookId} />
              </>
            }
          />
          <Route
            path="/checkout"
            element={
              <>
                {Headercomponent}
                <Checkout />
              </>
            }
          />
          <Route
            path="/order"
            element={
              <>
                {Headercomponent}
                <Order
                  saveOrder={(array, price, date , phone , street , city ) => {
                    orders.addOrder(array, price, date , phone , street ,city, user.uid , user.type);
                  }}
                  zeroCart={zeroCart}
                />
              </>
            }
          />
          <Route
            path="/orders"
            element={
              <>
                {Headercomponent}
                <OrdersPage />
              </>
            }
          />
          <Route 
            path= "/signup"
            element={
              <>
                {Headercomponent}
                <SignUpPage />
              </>
            }
            />
          <Route
            path="/login"
            element={
              <>

                <Login />
              </>
            }/>
        </Routes>
      </Router>
    </>
  );
}
