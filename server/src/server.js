import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Post from './models/Post.js';
import Like from './models/Like.js';

const app = express();
app.use(cors());
app.use(express.json());

// Create a post
app.post('/posts', async (req, res) => {
  const { post_str_id, content } = req.body;
  try {
    const post = new Post({ post_str_id, content });
    await post.save();
    res.json({ post_str_id, status: 'created' });
  } catch (err) {
    res.status(400).json({ error: 'Post creation failed' });
  }
});

// Like a post
app.post('/posts/:post_str_id/like', async (req, res) => {
  const { user_id_str } = req.body;
  const { post_str_id } = req.params;
  const post = await Post.findOne({ post_str_id });
  if (!post) return res.status(404).json({ error: 'Post not found' });

  try {
    const like = new Like({ post_str_id, user_id_str });
    await like.save();
    res.json({ status: 'liked' });
  } catch (err) {
    if (err.code === 11000) {
      res.json({ status: 'already_liked' });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
});

// Get like count of a post
app.get('/posts/:post_str_id/likes', async (req, res) => {
  const { post_str_id } = req.params;
  const post = await Post.findOne({ post_str_id });
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const count = await Like.countDocuments({ post_str_id });
  res.json({ post_str_id, like_count: count });
});

// Unlike a post
app.delete('/posts/:post_str_id/like', async (req, res) => {
  const { user_id_str } = req.body;
  const { post_str_id } = req.params;

  const result = await Like.findOneAndDelete({ post_str_id, user_id_str });
  if (result) res.json({ status: 'unliked' });
  else res.json({ status: 'not_liked_previously' });
});

// Get top N liked posts
app.get('/posts/top', async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const topPosts = await Like.aggregate([
    { $group: { _id: "$post_str_id", like_count: { $sum: 1 } } },
    { $sort: { like_count: -1 } },
    { $limit: limit },
    { $project: { _id: 0, post_str_id: "$_id", like_count: 1 } }
  ]);
  res.json(topPosts);
});

//Get posts liked by a user
app.get('/users/:user_id_str/liked-posts', async (req, res) => {
  const { user_id_str } = req.params;
  const likes = await Like.find({ user_id_str }).select('post_str_id -_id');
  const likedPosts = likes.map(like => like.post_str_id);
  res.json(likedPosts);
});

//Start the server
const PORT = 5000;
mongoose.connect('mongodb://127.0.0.1:27017/social_likes')
  .then(() => {
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch(err => console.error('MongoDB connection failed:', err));
