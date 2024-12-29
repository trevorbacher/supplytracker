const mongoose = require('mongoose');

// Define the schema for the Token model
const tokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the user associated with the token
        ref: 'user', // Reference to the User model
        required: true,
    },
    token: {
        type: String, // The token string
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;