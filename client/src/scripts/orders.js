import axios from 'axios';



function generateRandomId(length) {
  const charcters = "0123456789";

  let final = "";
  for (let i = 0; i < length; i++) {
    final += charcters[Math.floor(Math.random() * charcters.length)];
  }
  return final
}

const orders = {
  ordersArray: [],

  // Initialize ordersArray from localStorage if it exists
  loadOrders() {
    const savedOrders = localStorage.getItem("ordersArray");
    if (savedOrders) {
      this.ordersArray = JSON.parse(savedOrders); // Parse the saved data from localStorage
    }
  },

  // Add new order to the ordersArray
  async addOrder(array, price, date , phone , street,city , uid) {
    const newOrder = {
      itemsArray: array,
      price: price,
      date: date,
      phone: phone,
      street: street,
      city: city,
      uid: uid,
      id:  generateRandomId(10),
    };

    this.ordersArray.push(newOrder);

    // Save the updated ordersArray to localStorage
    localStorage.setItem("ordersArray", JSON.stringify(this.ordersArray));
    console.log("Updated orders:", newOrder);

    const response = await axios.post("https://c322ae04-db91-4608-8031-e5257a3ff16c-00-3hoqmrkh6ralv.pike.replit.dev/addOrder" , newOrder)

    console.log(response.data)

    
  },

  
 
};

// Initialize orders when the application starts
orders.loadOrders();

export default orders;
