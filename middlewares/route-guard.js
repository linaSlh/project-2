// middleware/route-guard.js
const isAdmin = (req, res, next) => {
  console.log('isAdmin middleware executed');
  if (req.session.currentUser && req.session.currentUser.role === 'admin') {
      next();
  } else {
      res.redirect('/'); // Redirect to home or login page for non-admin users
  }
};
// checks if the user is logged in when trying to access a specific page
const isLoggedIn = (req, res, next) => {
  
    if (!req.session.currentUser) {
      
      return res.redirect('/login');
    }
    next();

};

   
  // if an already logged in user tries to access the login page it
  // redirects the user to the home page
  const isLoggedOut = (req, res, next) => {
    console.log('isloggedOUT middleware executed');
    console.log(req.session);
    if (req.session.currentUser) {
      return res.redirect('/');
    }
    next();
  };

  // User model
//   {
//     username,
//     email,
//     password,
//     role: ['Super Admin','Admin', 'Regular']
//   }

// isAdmin
// if(req.session.currentUser && req.session.currentUser.role === 'Admin'){}
// route-guard.js






module.exports = {
    isLoggedIn,
    isAdmin,
    isLoggedOut 
  };