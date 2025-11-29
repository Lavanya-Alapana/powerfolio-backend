const Project = require('../models/Project');

const getAllProjects = async () => {
    const projects = await Project.find({ status: 'approved' }).sort({ createdAt: -1 }).populate('user', 'name');
    return projects;
};

const getUserProjects = async (userId) => {
    const projects = await Project.find({ user: userId }).sort({ createdAt: -1 });
    return projects;
};

const getProjectById = async (projectId) => {
    const project = await Project.findById(projectId).populate('user', 'name').populate('comments.user', 'name');
    if (!project) {
        throw new Error('Project not found');
    }
    return project;
};

const createProject = async (userId, projectData) => {
    const {
        title,
        description,
        longDescription,
        images,
        liveUrl,
        githubUrl,
        category,
        tags,
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
    } = projectData;

    const newProject = new Project({
        user: userId,
        title,
        description,
        longDescription,
        images: Array.isArray(images) ? images : [],
        liveUrl,
        githubUrl,
        category,
        tags: Array.isArray(tags) ? tags : [],
        projectType,
        duration,
        completionDate,
        demoVideo,
        technologies: Array.isArray(technologies) ? technologies : [],
        customTechnologies,
        teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
        contactName,
        contactName,
        contactEmail,
        contactImage
    });

    const project = await newProject.save();
    return project;
};

const updateProject = async (userId, projectId, projectData) => {
    let project = await Project.findById(projectId);

    if (!project) {
        throw new Error('Project not found');
    }

    // Make sure user owns project
    if (project.user.toString() !== userId) {
        throw new Error('User not authorized');
    }

    const {
        title,
        description,
        longDescription,
        images,
        liveUrl,
        githubUrl,
        category,
        tags,
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
    } = projectData;

    // Build project object
    const projectFields = {};
    if (title) projectFields.title = title;
    if (description) projectFields.description = description;
    if (longDescription) projectFields.longDescription = longDescription;
    if (images) projectFields.images = Array.isArray(images) ? images : [];
    if (liveUrl) projectFields.liveUrl = liveUrl;
    if (githubUrl) projectFields.githubUrl = githubUrl;
    if (category) projectFields.category = category;
    if (tags) projectFields.tags = Array.isArray(tags) ? tags : [];
    if (projectType) projectFields.projectType = projectType;
    if (duration) projectFields.duration = duration;
    if (completionDate) projectFields.completionDate = completionDate;
    if (demoVideo) projectFields.demoVideo = demoVideo;
    if (technologies) projectFields.technologies = Array.isArray(technologies) ? technologies : [];
    if (customTechnologies) projectFields.customTechnologies = customTechnologies;
    if (teamMembers) projectFields.teamMembers = Array.isArray(teamMembers) ? teamMembers : [];
    if (contactName) projectFields.contactName = contactName;
    if (contactName) projectFields.contactName = contactName;
    if (contactEmail) projectFields.contactEmail = contactEmail;
    if (contactImage) projectFields.contactImage = contactImage;

    project = await Project.findByIdAndUpdate(
        projectId,
        { $set: projectFields },
        { new: true }
    );

    return project;
};

const deleteProject = async (userId, projectId) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new Error('Project not found');
    }

    // Make sure user owns project
    if (project.user.toString() !== userId) {
        throw new Error('User not authorized');
    }

    await project.deleteOne();
    return { msg: 'Project removed' };
};

const addComment = async (userId, projectId, commentData) => {
    const project = await Project.findById(projectId);
    if (!project) {
        throw new Error('Project not found');
    }

    const user = await require('../models/User').findById(userId);

    const newComment = {
        user: userId,
        text: commentData.text,
        name: user.name,
        avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
    };

    project.comments.unshift(newComment);
    await project.save();
    return project.comments;
};

module.exports = {
    getAllProjects,
    getUserProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addComment,
    likeProject: async (userId, projectId) => {
        const project = await Project.findById(projectId);
        if (!project) {
            throw new Error('Project not found');
        }

        // Check if project has already been liked
        if (project.likes.filter(like => like.user.toString() === userId).length > 0) {
            // Get remove index
            const removeIndex = project.likes.map(like => like.user.toString()).indexOf(userId);
            project.likes.splice(removeIndex, 1);
        } else {
            project.likes.unshift({ user: userId });
        }

        await project.save();
        return project.likes;
    }
};
