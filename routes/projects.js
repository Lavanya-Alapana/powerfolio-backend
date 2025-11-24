const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const projectController = require('../controllers/projectController');


router.get('/', projectController.getAll);


router.get('/my-projects', auth, projectController.getMyProjects);

router.get('/:id', projectController.getById);

router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty()
    ]
  ],
  projectController.create
);

router.put('/:id', auth, projectController.update);


router.delete('/:id', auth, projectController.remove);

// @route   POST api/projects/comment/:id
// @desc    Comment on a project
// @access  Private
router.post(
  '/comment/:id',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  projectController.addComment
);

// @route   PUT api/projects/like/:id
// @desc    Like a project
// @access  Private
router.put('/like/:id', auth, projectController.like);

module.exports = router;
