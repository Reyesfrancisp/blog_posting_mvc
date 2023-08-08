const router = require('express').Router();
const User = require('../models/User');
const Mood = require('../models/Mood');
const attachColor = require('../functions/color');
// Middleware
function isAuthenticated(req, res, next) {
  const isAuthenticated = req.session.user_id;

  if (!isAuthenticated) return res.redirect('/login');

  next();
}

//The provided function findMaxProperty takes two arguments: objectData (an object) and objectProperties (an array of strings). The function aims to find the property with the maximum numeric value in the objectData that matches the properties listed in the objectProperties array.

function findMaxProperty(objectData, objectProperties) {
  console.log("Object data being passed is: ", objectData, "Object properties being passed are: ", objectProperties);

  const { property, rating } = objectProperties.reduce((max, prop) => {
      if (parseFloat(objectData[prop]) >= parseFloat(max.rating)) {
        max.property = prop;
        max.rating = parseFloat(objectData[prop]);
      }
    console.log("This is inside the findMaxProperty function: outputting: ", max)
    return max;
  }, { property: "joy", rating: 0 });

  console.log("Returning property:", property, "Returning rating of:", rating);
  return { property, rating };
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

router.get('/mood', isAuthenticated, async (req, res) => {
  console.log("Got into the get route");
  try {
    const user = await User.findByPk(req.session.user_id, {
      include: Mood
    });
    console.log("This is the user in the /mood route: ", user);
    console.log("This is user.moods: ", user.moods);
    const moods = user.moods.map(mood => {
      const plainMood = mood.get({ plain: true });
      console.log("This is the plainMood variable: ", plainMood);
      const moodDisplay = returnResult(plainMood);
      console.log("The data being passed to attachColor is: ", moodDisplay);
      const color = attachColor(moodDisplay);
      return { ...plainMood, color };
    });

    console.log("this is the mood: ", moods);
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

    const moodProperties = ['anger', 'joy', 'disgust', 'sadness', 'fear', 'surprise'];

    const moodColors = moodProperties.map(property => {
      return {
        property,
        rating: mood[property],
        color: attachColor({ property, rating: mood[property] })
      };
    });


    const moodWithColors = moodProperties.reduce((moodWithColors, property) => {
      const colorProp = `${property}Color`;
      moodWithColors[colorProp] = moodColors.find(color => color.property === property).color;
      return moodWithColors;
    }, { ...mood });

    res.render('display', {
      id: mood.id,
      email: user.email,
      title: mood.title,
      entry: mood.entry,
      anger: moodWithColors.anger,
      fear: moodWithColors.fear,
      sadness: moodWithColors.sadness,
      disgust: moodWithColors.disgust,
      surprise: moodWithColors.surprise,
      joy: moodWithColors.joy,
      angerColor: moodWithColors.angerColor,
      fearColor: moodWithColors.fearColor,
      sadnessColor: moodWithColors.sadnessColor,
      disgustColor: moodWithColors.disgustColor,
      surpriseColor: moodWithColors.surpriseColor,
      joyColor: moodWithColors.joyColor
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

function returnResult(data) {
  console.log("In the return restult: ", data);
  const searchCriteria = ['joy', 'sadness', 'fear', 'anger', 'surprise', 'disgust'];
  const maxResult = findMaxProperty(data, searchCriteria);
  console.log("The max result being passed is: ", maxResult);
  return maxResult;
}

module.exports = router;