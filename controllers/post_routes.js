require("dotenv").config();
const router = require('express').Router();
const User = require('../models/User');
const Mood = require('../models/Post');

// Middleware
function isAuthenticated(req, res, next) {
  const isAuthenticated = req.session.user_id;

  if (!isAuthenticated) return res.redirect('/login');

  next();
}



router.post('/entry', async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id);
    const newEntry = req.body.entry;
    const newTitle = req.body.title.toUpperCase();


    Post.create({ userId: user.id, title: newTitle, entry: newEntry});
    // redirect them after the data is obtained
    res.redirect('/');

  }
  catch (err) {
    console.log(err);
  }

});

router.post('/:id', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id, {
      include: Mood
    });

    const moodId = req.params.id;
    const mood = await Mood.findOne({
      where: {
        id: moodId,
        userId: user.id
      }
    });

    if (!mood) {
      return res.status(404).send('Mood not found');
    }

    const moodData = await getMoodData(req.body.entry);
    
    // Update the mood entry with the new values
    mood.set({
      title: req.body.title.toUpperCase(),
      entry: req.body.entry
    });

    await mood.save();

    // Redirect the user to the mood page or display a success message
    res.redirect('/mood');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});


router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id, {
      include: Mood
    });

    const moodId = req.params.id;
    const mood = await Mood.findOne({
      where: {
        id: moodId,
        userId: user.id
      }
    });

    if (!mood) {
      return res.status(404).send('Mood not found');
    }

    // Delete the mood entry from the database
    await mood.destroy();

    // Redirect to the mood page

    res.redirect('/mood');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

module.exports = router;
