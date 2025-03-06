import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    itemsArray:{
      type:Array,
      required:true
    },
    price: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    phone:{
      type:number,
      required:true
    },
    street:{
      
      required:true
    },
    city:{
      type:String,
      required:true
    },
    uid:{
      type:String,
      required:true,
      uniqe:true
    },
    orderId:{
      type:String,
      required:true,
      unique:true
    }
    
  }
)

const Order = mongoose.model("Order", orderSchema);
/*{
  itemsArray: [ { bookId: 'e1f2g3h4i5j6k7l8m9n0', quantity: 1 } ],
  price: 21.988999999999997,
  date: 'Friday Mar 14 2025',
  phone: '07700667597',
  street: '7 days (Free)',
  city: '383',
  uid: 'YgnoGbyfb8cZnSoZAYYsSlotD112',
  id: '3608957951'
}*/
