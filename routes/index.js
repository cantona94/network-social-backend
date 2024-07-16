const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  UserController,
  PostController,
  CommentController,
} = require('../controllers');
const { authenticateToken } = require('../middleware/auth');

const uploadDestination = 'uploads';

const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage: storage });

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/user/:id', authenticateToken, UserController.getUserById);
router.put('/user/:id', authenticateToken, UserController.updateUser);
router.get('/current', authenticateToken, UserController.current);

router.post('/post', authenticateToken, PostController.createPost);
router.get('/post', authenticateToken, PostController.getAllPosts);
router.get('/post/:id', authenticateToken, PostController.getPostById);
router.delete('/post/:id', authenticateToken, PostController.deletePost);

router.post('/comment', authenticateToken, CommentController.createComment);
router.delete(
  '/comment/:id',
  authenticateToken,
  CommentController.deleteComment
);

module.exports = router;
