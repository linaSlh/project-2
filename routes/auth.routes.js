const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require("../models/User.model");
const {isLoggedIn, isLoggedOut} = require('../middlewares/route-guard');


/* GET signup page */
router.get("/signup", (req, res, next) => {
    //ADD isLoggedOut//
    console.log("req.session Signup", req.session)
  res.render("auth/signup", { error: null });
});
//post signup//
router.post("/signup", async (req, res, next) => {
   //ADD isLoggedOut //
  const { username, password, email } = req.body;

  try {
    // Check if the username is already taken
    const existingUsernameUser = await User.findOne({ username });
    if (existingUsernameUser) {
        console.log('This username already exists.');
    const error = "Username is already taken. Choose another one.";
    return res.render("auth/signup", { error });
  }

    // Check if the email is already registered
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res.render("auth/signup", { error: "Email is already registered. Choose another one." });
    }

    // Hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({ username, email, password: hashedPassword });

    // Redirect to profile page upon successful signup
    res.redirect('/profile');
    
  } catch (error) {
    console.error(error);
    res.render("auth/signup", { error: "An error occurred. Please try again." });
  }
});

// Get profile page
router.get("/profile", (req, res, next) => {
  res.render("auth/profile");
});

//get login page//
router.get("/login",(req, res, next)=> {
    //add is logged out
    
    res.render("auth/login");
});

router.post("/login", async(req, res)=>{
   
const { email, password } = req.body;

if (email === '' || password === '') {
    return res.render('auth/login', {
        errorMessage: 'Please enter both, email and password to login.'
    })
}

try {
    const user = await User.findOne({ email });
    if (!user) {
        console.log("Email not registered. ");
        return res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
        // req.session.currentUser = user;
        res.render('auth/profile', user);
    } else {
        console.log("Incorrect password. ");
        res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
    }
} catch (err) {
    console.error(err);
    res.status(500).render('auth/login', { errorMessage: 'An error occurred. Please try again.' });
}

});

router.post('/logout', isLoggedIn, (req, res, next) => {
req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
});
});

/* GET Profile page */
router.get("/profile", isLoggedIn, (req, res, next) => {
console.log("req.session", req.session);
res.render("auth/profile");
});


module.exports = router;
