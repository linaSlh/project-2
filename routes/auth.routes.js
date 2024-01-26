const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const router = express.Router();
const Session = require("../models/session.model");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require("../models/User.model");
const {isLoggedIn, isLoggedOut,isAdmin} = require('../middlewares/route-guard');



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
    res.redirect('/login');
    
  } catch (error) {
    console.error(error);
    res.render("auth/signup", { error: "An error occurred. Please try again." });
  }
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
        req.session.currentUser = user;
        console.log(req.session.currentUser);
      
        
        res.redirect(`/profile/${user._id}`);
    } else {
        console.log("Incorrect password. ");
        res.render('auth/login', { errorMessage: 'User not found and/or incorrect password.' });
    }
} catch (err) {
    console.error(err);
    res.status(500).render('auth/login', { errorMessage: 'An error occurred. Please try again.' });
}

});

router.post('/logout', (req, res, next) => {
req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
});
});

// Define a dynamic route for viewing profiles by user ID
router.get("/profile/:userId", async (req, res, next) => {
  try {
      // Extract the user ID from the request parameters
      const userId = req.params.userId;

      // Find the user associated with the provided ID
      const user = await User.findById(userId);

      if (!user) {
          // If the user is not found, return a 404 status
          return res.status(404).json({ message: 'User not found' });
      }//added//
      if (!user) {
        // If the user is not found, return a 404 status
        return res.status(404).json({ message: 'User not found' });
    }
      // Find sessions associated with the user
      const userSessions = await Session.find({ client: userId });

      // Render the profile page with user information and their sessions
      res.render("auth/profile", { user: user, sessions: userSessions });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

//delete events 

// Route to remove a session from the user's profile
router.post('/remove-session/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;

        // Find the session by ID and update its client field to null
        const removedSession = await Session.findByIdAndUpdate(
            sessionId,
            { client: null, isAvailable: true }, // Reset client to null and set isAvailable to true
            { new: true }
        );

        res.redirect('/profile/' + req.session.currentUser._id); // Redirect back to the user's profile
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;






router.get("/create-event",isAdmin, (req, res, next) => {
  
  res.render("../views/event/create-event",{isAdmin: true} );
  
});


    
  router.post('/create-event', async (req, res) => {
    try {
      // Check if the user is an admin
      if (req.session.currentUser && req.session.currentUser.role === 'admin') {
        const { theme } = req.body; // Extract theme from request body
  
        if (!theme) {
          // If theme is not provided in the request body
          return res.status(400).json({ message: 'Theme is required' });
        }
  
        // Create a new session with the current user as the owner
        const newSession = await Session.create({ owner: req.session.currentUser._id, theme: theme });
  
        // Redirect to the page displaying all events after creating the session
        res.redirect('/all-events');
      } else {
        // If the user is not an admin
        return res.status(403).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  //display all sessions//
  router.get("/all-events", async (req, res) => {
    try {
      // Fetch all sessions from the database
      const sessions = await Session.find({}).populate('owner').populate('client');
      res.render("../views/event/all-events", { sessions: sessions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  


//routes for user to select sessions //
router.get('/select-session/:sessionId', async (req, res) => {
    try {
      // Check if the user is a normal user
      if (req.session.currentUser && req.session.currentUser.role === 'visitor') {
        const { sessionId } = req.params;
  
// Find the session and update its client field with the current user
        const selectedSession = await Session.findByIdAndUpdate(
          sessionId,
          { client: req.session.currentUser._id, isAvailable: false },
          { new: true }
        );
  
        res.json(selectedSession);
      } else {
        res.status(403).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

//END OF REQUEST//
module.exports = router;
