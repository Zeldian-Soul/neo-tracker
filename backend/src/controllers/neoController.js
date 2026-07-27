const { getAsteroidsFeed } = require('../services/nasaService');
const Comment = require('../models/Comment'); 

const getFeed = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        if (!start_date || !end_date) {
            return res.status(400).json({ error: 'Please provide both start_date and end_date.' });
        }
        const data = await getAsteroidsFeed(start_date, end_date);
        res.status(200).json({ status: 'success', element_count: data.element_count, asteroids: data.near_earth_objects });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch asteroid data from NASA.' });
    }
};

const createComment = async (req, res) => {
    try {
        const { asteroidId, username, text } = req.body;

        if (!asteroidId || !username || !text) {
            return res.status(400).json({ error: 'Please provide asteroidId, username, and comment text.' });
        }

        const newComment = await Comment.create({
            asteroidId,
            username,
            text
        });

        res.status(201).json({ status: 'success', data: newComment });
    } catch (error) {
        console.error('Error creating comment:', error.message);
        res.status(500).json({ error: 'Server error saving community comment.' });
    }
};

const getCommentsByAsteroid = async (req, res) => {
    try {
        const { asteroidId } = req.params;
        const comments = await Comment.find({ asteroidId }).sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            count: comments.length,
            data: comments
        });
    } catch (error) {
        console.error('Error fetching comments:', error.message);
        res.status(500).json({ error: 'Server error retrieving discussion logs.' });
    }
};

module.exports = {
    getFeed,
    createComment,
    getCommentsByAsteroid
};