const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')

const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

const { catchError } = require('../../helpers/catchError')

const OBJECT_TYPE = 'Post'

// @route   GET api/posts
// @desc    Create a post
// @access  Private
router.post(
	'/',
	[auth, [check('text', 'Text is required').not().isEmpty()]],
	async (req, res) => {
		errors = validationResult(req)
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() })

		try {
			const user = await User.findById(req.user.id).select('-password')

			const newPost = new Post({
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			})

			const post = await newPost.save()
			res.json(post)
		} catch (err) {
			catchError(err, res)
		}
	}
)

// @route   GET api/posts
// @desc    Get all post
// @access  Private
router.get('/', auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 })

		res.json(posts)
	} catch (err) {
		catchError(err, res)
	}
})

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		if (!post) return postNotFound(res)

		res.json(post)
	} catch (err) {
		catchError(err, res, OBJECT_TYPE)
	}
})

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		if (!post) postNotFound(res)

		if (post.user.toString() !== req.user.id)
			return res.status(401).json({ msg: 'User not authorized' })

		await post.remove()

		res.json({ msg: 'Post removed' })
	} catch (err) {
		catchError(err, res, OBJECT_TYPE)
	}
})

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		// Check if post already has been liked by this user
		if (
			post.likes.filter(like => like.user.toString() === req.user.id).length > 0
		) {
			return res.status(400).json({ msg: 'Post already liked' })
		}

		post.likes.unshift({ user: req.user.id })

		await post.save()
		return res.json(post.likes)
	} catch (err) {
		catchError(err)
	}
})

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)

		// Check if post already has been liked by this user
		if (
			post.likes.filter(like => like.user.toString() === req.user.id).length ===
			0
		) {
			return res.status(400).json({ msg: 'Post has not yet been liked' })
		}

		const removeIndex = post.likes
			.map(like => like.user.toString())
			.indexOf(req.user.id)

		post.likes.splice(removeIndex, 1)

		await post.save()
		return res.json(post.likes)
	} catch (err) {
		catchError(err)
	}
})

module.exports = router

function postNotFound(res) {
	return res.status(404).json({ msg: 'Post not found' })
}
