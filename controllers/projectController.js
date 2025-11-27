const { validationResult } = require('express-validator');
const projectService = require('../services/projectService');

const getAll = async (req, res) => {
    try {
        const projects = await projectService.getAllProjects();
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getMyProjects = async (req, res) => {
    try {
        const projects = await projectService.getUserProjects(req.user.id);
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getById = async (req, res) => {
    try {
        const project = await projectService.getProjectById(req.params.id);
        res.json(project);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId' || err.message === 'Project not found') {
            return res.status(404).json({ msg: 'Project not found' });
        }
        res.status(500).send('Server Error');
    }
};

const create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {
            title,
            description,
            longDescription,
            githubUrl,
            liveUrl,
            tags,
            images,
            category,
            projectType,
            duration,
            completionDate,
            demoVideo,
            technologies,
            customTechnologies,
            teamMembers,
            contactName,
            contactEmail,
            contactImage
        } = req.body;

        const projectData = {
            title,
            description,
            longDescription,
            githubUrl,
            liveUrl,
            tags,
            images,
            category,
            projectType,
            duration,
            completionDate,
            demoVideo,
            technologies,
            customTechnologies,
            teamMembers,
            contactName,
            contactEmail,
            contactImage
        };
        const project = await projectService.createProject(req.user.id, projectData);
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const update = async (req, res) => {
    try {
        const project = await projectService.updateProject(req.user.id, req.params.id, req.body);
        res.json(project);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId' || err.message === 'Project not found') {
            return res.status(404).json({ msg: 'Project not found' });
        }
        if (err.message === 'User not authorized') {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        res.status(500).send('Server Error');
    }
};

const remove = async (req, res) => {
    try {
        const result = await projectService.deleteProject(req.user.id, req.params.id);
        res.json(result);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId' || err.message === 'Project not found') {
            return res.status(404).json({ msg: 'Project not found' });
        }
        if (err.message === 'User not authorized') {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        res.status(500).send('Server Error');
    }
};

const addComment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const comments = await projectService.addComment(req.user.id, req.params.id, req.body);
        res.json(comments);
    } catch (err) {
        console.error(err.message);
        if (err.message === 'Project not found') {
            return res.status(404).json({ msg: 'Project not found' });
        }
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getAll,
    getMyProjects,
    getById,
    create,
    update,
    remove,
    addComment,
    like: async (req, res) => {
        try {
            const likes = await projectService.likeProject(req.user.id, req.params.id);
            res.json(likes);
        } catch (err) {
            console.error(err.message);
            if (err.message === 'Project not found') {
                return res.status(404).json({ msg: 'Project not found' });
            }
            res.status(500).send('Server Error');
        }
    }
};
