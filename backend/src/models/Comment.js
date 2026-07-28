const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    asteroidId: {
        type: String,
        required: [true, 'Asteroid ID is required to link the community comment.'],
        index: true 
    },
    username: {
        type: String,
        required: [true, 'Please provide a username to post.'],
        trim: true 
    },
    text: {
        type: String,
        required: [true, 'Comment content cannot be empty.'],
        maxlength: [500, 'Comments are capped at 500 characters for readability.']
    },
    parentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment', default: null 
    },
    upvotes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Comment', CommentSchema);