import React, { useState } from "react";
import "./styles/signUpPage.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDh1UQ92aWOpYJsCTaYEn66J7V9Pdqvfd4",
  authDomain: "sumbook-ali.firebaseapp.com",
  projectId: "sumbook-ali",
  storageBucket: "sumbook-ali.firebasestorage.app",
  messagingSenderId: "255469526663",
  appId: "1:255469526663:web:60650ecfe8a63c592b2222",
  measurementId: "G-5PDNMHYS02",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
auth.useDeviceLanguage();
const provider = new GoogleAuthProvider();





axios.defaults.withCredentials = true;


const SignUpPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  console.log(user)
  const backendUrl = useSelector((state) => state.url.url);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signedUp, setSignedUp] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://c322ae04-db91-4608-8031-e5257a3ff16c-00-3hoqmrkh6ralv.pike.replit.dev/sign-up-email",
        { email, password , type:'email'},
      );

      if (response.status === 200) {
        setSignedUp(true);
        setError(null);
      } else {
        setSignedUp(false);
        setError("Failed to sign up");
      }
    } catch (err) {
      console.log(err);
      setError("An error occurred. Please try again.");
      setSignedUp(false);
    } finally {
      setLoading(false);
    }

    const checkAuth = async () =>{
      const res = await axios.get("https://c322ae04-db91-4608-8031-e5257a3ff16c-00-3hoqmrkh6ralv.pike.replit.dev/auth/status")

      console.log(res.data)
      if(res.data.loggedIn){
        dispatch(login({uid:res.data.userId , type:res.data.type}))

        navigate('/')
      }
    }
    checkAuth()
   
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken; // token for API access if needed
      const user = result.user;

      // Ensure backendUrl is available before making the request
      if (!backendUrl) {
        setError("Backend URL is not defined.");
        return;
      }

      const response = await axios.post(`${backendUrl}/sign-up-google`, {
        displayName : user.displayName,
        email : user.email,
        uid: user.uid,
        type:'google',
      });

      console.log(response); // Logs the response from your backend

    } catch (error) {
      // Handle errors from the sign-in process
      console.log("Error during Google Sign In:", error.message);
      setError("Google sign-in failed. Please try again.");
    }
    const checkAuth = async () =>{
      const res = await axios.get("https://c322ae04-db91-4608-8031-e5257a3ff16c-00-3hoqmrkh6ralv.pike.replit.dev/auth/status")

      console.log(res.data)
      if(res.data.loggedIn){
        dispatch(login({uid:res.data.userId , type:res.data.type}))

        navigate('/')
      }
    }
    checkAuth()
  };

  
  


  return (
    <div className="signup-container">
      <h2 className="signup-title">Create an Account</h2>

      <form className="signup-form">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {loading ? (
          <button type="button" className="signup-btn" disabled>
            Loading...
          </button>
        ) : (
          <button type="button" className="signup-btn" onClick={handleSignUp}>
            Sign Up
          </button>
        )}

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleSignIn}
        >
          Sign in with Google
        </button>
       

        <div className="signin-link">
          <p>
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </form>
     

      {signedUp && <p className="success-message">Successfully signed up!</p>}
      {error && <p className="error-message">{error}</p>}
      
    </div>
    
  );
};

export default SignUpPage;
