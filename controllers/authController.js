const { validationResult } = require('express-validator');
const authService = require('../services/authService');

const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        const result = await authService.registerUser({ name, email, password });
        res.json(result);
    } catch (err) {
        if (err.message === 'User already exists') {
            return res.status(400).json({ errors: [{ msg: err.message }] });
        }
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const result = await authService.loginUser({ email, password });
        res.json(result);
    } catch (err) {
        if (err.message === 'Invalid credentials') {
            return res.status(400).json({ errors: [{ msg: err.message }] });
        }
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getMe = async (req, res) => {
    try {
        const user = await authService.getUser(req.user.id);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    register,
    login,
    getMe
};
