import express from 'express';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { body } from 'express-validator';
import { validationResult } from 'express-validator';
import EmailUser from '../shemas/EmailUser.mjs';
import GoogleUser from '../shemas/GoogleUser.mjs';
import passport from 'passport';





const router = express.Router();
const firebaseConfig = {
  apiKey: "AIzaSyDh1UQ92aWOpYJsCTaYEn66J7V9Pdqvfd4",
  authDomain: "sumbook-ali.firebaseapp.com",
  projectId: "sumbook-ali",
  storageBucket: "sumbook-ali.firebasestorage.app",
  messagingSenderId: "255469526663",
  appId: "1:255469526663:web:60650ecfe8a63c592b2222",
  measurementId: "G-5PDNMHYS02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
router.get('/test', async (req, res) => {
  res.json({
    message: "Hello from auth"
  })
})





// POST route for sign-up
router.post('/sign-up-email',
  // Validation middleware
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  async (req, res) => {

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Send validation errors to the client
    }

    const { email, password, type } = req.body;

    try {





      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // User successfully created, store user data in session
      const user = userCredential.user;




      const newUser = new EmailUser({
        uid: user.uid,
        email: email,
        password: password,
        type: type,
        orders: []
      })

      await newUser.save()

      req.session.trySession = true;
      req.session.createdAt = new Date();
      req.session.userId = user.uid;
      req.session.type = type;





      res.status(200).json({
        message: 'User created successfully!',
        user: {
          uid: user.uid,
          email: user.email,
        },
      });

    } catch (error) {
      // Handle Firebase authentication errors
      const errorCode = error.code;
      const errorMessage = error.message;

      // Send error response to the client
      res.status(500).json({
        errorCode,
        errorMessage,
      });
    }
  }
);

router.post('/sign-up-google', async (req, res) => {
  const { displayName, email, uid, type } = req.body

  if (displayName && email && uid) {
    try {
      const newUser = new GoogleUser({
        uid: uid,
        email: email,
        type: type,
        displayName: displayName,
      })
      await newUser.save()
      req.session.trySession = true;
      req.session.createdAt = new Date();
      req.session.userId = uid;
      req.session.type = type;
      res.status(200).send("User created successfully")
    } catch (err) {
      res.send(err)
    }
  }
})


router.get("/auth/status", async (req, res) => {
  console.log("Session data:", req.session);

  if (req.session.trySession) {
    console.log("User authenticated:", {
      userId: req.session.userId,
      type: req.session.type
    });

    return res.status(200).json({
      loggedIn: true,
      userId: req.session.userId,
      type: req.session.type,
    });
  } else {
    console.log("No active session found");
    return res.status(401).json({
      success: false,
      message: 'No active session found'
    });
  }
});

router.post('/login-google',
  body("uid").trim().notEmpty().isString(), async (req, res) => {
    const { uid } = req.body;

    try {
      const user = await GoogleUser.findOne({ uid: uid });

      if (user) {
        req.session.trySession = true;
        req.session.createdAt = new Date();
        req.session.userId = user.uid;
        req.session.type = user.type;
        res.status(200).json({
          message: "User logged in successfully",
          user: {
            uid: user.uid,
            email: user.email,
          },
        });
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'there is no acount'
      })
    }


  })

router.post('/login-email',
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  async (req, res) => {

    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Send validation errors to the client
    }

    const { email, password } = req.body;

    try {
      const user = await EmailUser.findOne({ email: email, password: password });

      if (user) {

        req.session.trySession = true;
        req.session.createdAt = new Date();
        req.session.userId = user.uid;
        req.session.type = user.type;
        res.status(200).json({
          message: "User logged in successfully",
          user: {
            uid: user.uid,
            email: user.email,
          },
        });


      } else {
        res.status(404).json({
          message: "User not found",
        })
      }

    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'username or pasword incoorect'
      })
    }

  })




export default router;