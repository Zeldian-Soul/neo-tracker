const express = require('express');
const router = express.Router();
const { getFeed, createComment, getCommentsByAsteroid } = require('../controllers/neoController');

router.get('/feed', getFeed);
router.post('/comments', createComment);                  
router.get('/comments/:asteroidId', getCommentsByAsteroid); 

module.exports = router;