const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  longDescription: {
    type: String,
    required: [true, 'Please add a detailed description']
  },
  images: {
    type: [String],
    default: []
  },
  liveUrl: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  githubUrl: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Machine Learning',
      'Other'
    ]
  },
  tags: {
    type: [String],
    default: []
  },
  projectType: {
    type: String,
    default: 'Personal'
  },
  duration: {
    type: String
  },
  completionDate: {
    type: Date
  },
  demoVideo: {
    type: String // URL or file path
  },
  technologies: {
    type: [String],
    default: []
  },
  customTechnologies: {
    type: String
  },
  teamMembers: {
    type: [String],
    default: []
  },
  contactName: {
    type: String
  },
  contactEmail: {
    type: String
  },
  contactImage: {
    type: String // URL or file path
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

// Create a compound index for text search
ProjectSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Project', ProjectSchema);
