import React, { useEffect, useState } from 'react';  
import { useNavigate } from 'react-router-dom';
import { books } from './data/books.js';
import orders from './scripts/orders.js';

export default function OrdersPage() {
  const navigate = useNavigate();

  // Initialize orderList state with orders.ordersArray and set up reactivity
  const [orderList, setOrderList] = useState([]);  // Default to empty array if undefined

  useEffect(() => {
    // Load the orders when the component mounts
    orders.loadOrders();

    // Now that orders are loaded, set orderList state
    setOrderList(orders.ordersArray || []);  // Ensure ordersArray is defined

  }, []);  // Empty dependency array to run only once on component mount

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#ff7f11',
    border: 'none',
    borderRadius: '5px',
    boxShadow: '0 6px 12px rgba(255, 127, 17, 0.4)',
    cursor: 'pointer',
    transition: 'transform 0.3s',
    outline: 'none'
  };

  return (
    <>
      <div className='no-orders'>
        {orderList.length === 0 ? (
          <h1 style={{ marginTop: "100px" }}>No orders yet!</h1>
        ) : (
          orderList.map(order => (
            <div key={order.id} className="order-container">
              <table className="order-table">
                <thead>
                  <tr>
                    <th>Book Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.itemsArray.map(item => {
                    const matchingItem = books.find(book => book.id === item.bookId);
                    return (
                      <tr key={matchingItem.id}>
                        <td>{matchingItem ? matchingItem.name : 'Unknown'}</td>
                        <td>{item.quantity}</td>
                        <td>${(matchingItem ? matchingItem.priceCents : 0) / 100}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <h3>Total Price: ${(order.price).toFixed(2)}</h3>
              <h3>Delivery Date: {order.date}</h3>
              <h3>Order ID: {order.id}</h3>
              <hr />
            </div>
          ))
        )}
        <button style={buttonStyle} onClick={() => navigate('/')}>Home</button>
      </div>
    </>
  );
}
