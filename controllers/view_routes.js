const router = require('express').Router();
const User = require('../models/User');
const Mood = require('../models/Post');
const attachColor = require('../functions/color');
// Middleware
function isAuthenticated(req, res, next) {
  const isAuthenticated = req.session.user_id;

  if (!isAuthenticated) return res.redirect('/login');

  next();
}

// Login page
router.get('/login', (req, res) => {
  if (req.session.user_id) return res.redirect('/mood');

  res.render('login', {
    isLogin: true
  });
});

// Homepage
router.get('/', (req, res) => {

  res.render('index', {
    isHome: true,
    isLoggedIn: req.session.user_id
  });
});

// Register Page
router.get('/register', (req, res) => {
  res.render('register', {
    isRegister: true
  });
});

//display all posts
router.get('/mood', isAuthenticated, async (req, res) => {
  console.log("Got into the get route");
  try {
  
    res.render("mood", {
      email: user.email,
      entry: moods // Pass the moods data
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).send("An error occurred");
  }
});


// specific mood page
router.get('/mood/:id', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id, {
      include: Mood
    });

    const moodId = req.params.id; // Get the mood ID from the URL parameter
    const mood = await Mood.findOne({
      where: {
        id: moodId,
        userId: user.id
      },
      raw: true
    });

    if (!mood) {
      // Handle the case if the mood is not found
      return res.redirect("/mood");
    }

    res.render('display', {
      id: mood.id,
      email: user.email,

    });

  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

router.get('/entry', isAuthenticated, async (req, res) => {
  const user = await User.findByPk(req.session.user_id);

  res.render('entry', {
    email: user.email
  });
});

module.exports = router;