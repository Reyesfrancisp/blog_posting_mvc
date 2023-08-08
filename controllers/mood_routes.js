require("dotenv").config();
const axios = require("axios");
const router = require('express').Router();
const encodedParams = new URLSearchParams();
const User = require('../models/User');
const Mood = require('../models/Mood');

// Middleware
function isAuthenticated(req, res, next) {
  const isAuthenticated = req.session.user_id;

  if (!isAuthenticated) return res.redirect('/login');

  next();
}

async function getMoodData(dataText) {
  encodedParams.set('text', dataText);

  const options = {
    method: 'POST',
    url: 'https://twinword-emotion-analysis-v1.p.rapidapi.com/analyze/',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': process.env.API_KEY,
      'X-RapidAPI-Host': 'twinword-emotion-analysis-v1.p.rapidapi.com'
    },
    data: encodedParams,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }

}

function percentage(num) {
  return parseFloat(num * 100);
}


router.post('/entry', async (req, res) => {
  try {
    const user = await User.findByPk(req.session.user_id);
    const newEntry = req.body.entry;
    const newTitle = req.body.title.toUpperCase();
    const moodData = await getMoodData(newEntry);
    //console.log(moodData.emotions_normalized);
    const surpriseData = percentage(moodData.emotions_normalized.surprise);
    const joyData = percentage(moodData.emotions_normalized.joy);
    const sadnessData = percentage(moodData.emotions_normalized.sadness);
    const disgustData = percentage(moodData.emotions_normalized.disgust);
    const fearData = percentage(moodData.emotions_normalized.fear);
    const angerData = percentage(moodData.emotions_normalized.anger);

    console.log("Data to be stored: Surprise: ", surpriseData, "Joy: ", joyData,
    "Sadness: ", sadnessData, "Disgust: ", disgustData, "Fear", fearData, "Anger", angerData);


    Mood.create({ userId: user.id, title: newTitle, entry: newEntry, joy: joyData, surprise: surpriseData, sadness: sadnessData, disgust: disgustData, anger: angerData, fear: fearData });
    // redirect them after the data is obtained
    res.redirect('/mood');

  }
  catch (err) {
    console.log(err);
  }

});

router.post('/mood/:id', isAuthenticated, async (req, res) => {
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
    const { joy, surprise, sadness, disgust, fear, anger } = moodData.emotions_normalized;
    
    // Update the mood entry with the new values
    mood.set({
      title: req.body.title.toUpperCase(),
      entry: req.body.entry,
      joy: percentage(joy),
      surprise: percentage(surprise),
      sadness: percentage(sadness),
      disgust: percentage(disgust),
      fear: percentage(fear),
      anger: percentage(anger)
    });

    await mood.save();

    // Redirect the user to the mood page or display a success message
    res.redirect('/mood');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});


router.delete('/mood/:id', isAuthenticated, async (req, res) => {
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

    console.log("Got into the delete route");
    // Redirect to the mood page
    console.log('Response status:', res.statusCode);
    console.log('Response headers:', res.getHeaders());

    res.redirect('/mood');

    console.log("redirect?");
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

module.exports = router;
