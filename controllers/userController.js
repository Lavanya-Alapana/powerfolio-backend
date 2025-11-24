const User = require('../models/User');
const Project = require('../models/Project');

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const projects = await Project.find({ user: req.params.id }).sort({ createdAt: -1 });

        res.json({
            user,
            projects
        });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getUserProfile
};
