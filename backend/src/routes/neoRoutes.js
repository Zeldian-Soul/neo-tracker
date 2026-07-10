const express = require('express');
const router = express.Router();
const { getFeed } = require('../controllers/neoController');

// Define the GET route for our asteroid feed
router.get('/feed', getFeed);

module.exports = router;