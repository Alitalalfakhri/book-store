import { configureStore } from '@reduxjs/toolkit';  
import userReducer from '../features/user/userSlice';  
import urlReducer from '../features/generals/urlSlice';  
const store = configureStore({
  reducer: {
    user: userReducer,  
    url: urlReducer,
  },
});

export default store;
