const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for the User model
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        trim: true, // Trim whitespace from the email
        match: [ // Regular expression to validate email format
            /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please enter a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minLength: [8, 'Password must be 8 characters or longer'],
    },
    photo: {
        type: String, // URL for user's profile photo
        required: [true, 'Please add a photo'],
        default: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106',
    },
    phone: {
        type: String,
        //default: '+1',
    },
    bio: {
        type: String,
        maxLength: [250, 'Bio must not exceed 250 characters'],
    }
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

// Middleware to encrypt password before saving to the database
userSchema.pre('save', async function(next) {
    // Check if the password has been modified
    if (!this.isModified('password')) {
        return next(); // Proceed to the next middleware if not modified
    }

    const salt = await bcrypt.genSalt(10); // Generate salt
    const hashedPassword = await bcrypt.hash(this.password, salt); // Hash the password
    this.password = hashedPassword; // Store the hashed password
    next(); // Proceed to the next middleware
});

const User = mongoose.model('User', userSchema);
module.exports = User;