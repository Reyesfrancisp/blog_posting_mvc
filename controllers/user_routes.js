const router = require('express').Router();
const User = require('../models/User');


router.post('/login', async (req, res) => {
  try {
    const formIdentifier = req.body.email; // The name of the input field is email in handlebars
    const formPassword = req.body.password;

    // Check if the identifier is an email format
    const isEmailFormat = /\S+@\S+\.\S+/.test(formIdentifier);
    let user;

    if (isEmailFormat) {
      // If the input is in email format, search by email
      user = await User.findOne({
        where: {
          email: formIdentifier
        }
      });
    } else {
      // Otherwise, assume it's a username and search by username
      user = await User.findOne({
        where: {
          username: formIdentifier
        }
      });
    }

    // Handle user not found
    if (!user) {
      console.log("user not found")
      return res.redirect('/register');
    }

    // Password match
    const isValidPass = await user.validatePass(formPassword);

    // Handle invalid password
    if (!isValidPass) {
      console.log("password invalid")
      return res.redirect('/login');
    }

    // User has been validated, create a session
    req.session.user_id = user.id;

    res.redirect('/mood');

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});




router.post('/register', async (req, res) => {
  try {
    // ValidatePasswords function
    const password = req.body.password;
    const verifyPassword = req.body.verifyPassword;

    // Log the passwords to the console
    console.log("Password:", req.body.password);
    console.log("Verify Password:", req.body.verifyPassword);

    if (password !== verifyPassword) {
      // If passwords don't match, stop the registration process
      return res.redirect('/register');
    }

    // Check if the email is already taken
    const existingEmail = await User.findOne({ where: { email: req.body.email } });
    if (existingEmail) {
      // Email is already taken, send a error message to the front end
      // res.send('Email is already taken.' );
      return res.redirect('/register');
    }

    // Check if the username is already taken
    const existingUsername = await User.findOne({ where: { username: req.body.username } });
    if (existingUsername) {
      // Username is already taken, send a error message to the front end
      // res.send('Username is already taken.' );
      return res.redirect('/register');

    }

    // Passwords match, and email/username are available, proceed with user creation
    const newUser = await User.create(req.body);
    req.session.user_id = newUser.id;
    console.log('Created ID');
    res.redirect('/mood');

  } catch (err) {
    // Log the error message to the console
    console.error(err);

    // Handle other errors
    return res.status(500).json('Internal Server Error');
  }
});




//log out user
router.get('/logout', (req, res) => {
  req.session.destroy();

  res.redirect('/');
});

module.exports = router;