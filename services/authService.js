const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../config/config');

// Helper to generate token
const generateToken = (user) => {
    const payload = {
        user: {
            id: user.id,
            role: user.role
        }
    };

    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            config.jwtSecret,
            { expiresIn: config.jwtExpire },
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    });
};

const registerUser = async ({ name, email, password }) => {
    let user = await User.findOne({ email });

    if (user) {
        throw new Error('User already exists');
    }

    user = new User({
        name,
        email,
        password
    });

    await user.save();
    const token = await generateToken(user);

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    };
};

const loginUser = async ({ email, password }) => {
    let user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = await generateToken(user);

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        }
    };
};

const getUser = async (userId) => {
    const user = await User.findById(userId).select('-password');
    return user;
};

module.exports = {
    registerUser,
    loginUser,
    getUser
};
