const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create Post Model
const Post = mongoose.model('Post', postSchema);

// Export Post model
module.exports = Post;