const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate('user', ['name', 'avatar'])

		if (!profile) {
			return res.status(400).json({ msg: 'There is no profile for this user' })
		}

		res.json(profile)
	} catch (err) {
		catchError(err, res)
	}
})

// @route   POST api/profile
// @desc    Create or update a user profile
// @access  Private
router.post(
	'/',
	[
		auth,
		[
			check('status', 'Status is required').not().isEmpty(),
			check('skills', 'Skills is required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const {
			company,
			website,
			location,
			bio,
			status,
			githubUsername,
			skills,
			youtube,
			facebook,
			twitter,
			instagram,
			linkedin,
		} = req.body

		// Build profile Object
		const profileFields = {}
		profileFields.user = req.user.id

		if (company) profileFields.company = company
		if (website) profileFields.website = website
		if (location) profileFields.location = location
		if (bio) profileFields.bio = bio
		if (status) profileFields.status = status
		if (githubUsername) profileFields.githubUsername = githubUsername
		if (skills) {
			profileFields.skills = skills.split(',').map(skill => skill.trim())
		}

		// Build social object
		profileFields.social = {}
		if (youtube) profileFields.social.youtube = youtube
		if (twitter) profileFields.social.twitter = twitter
		if (facebook) profileFields.social.facebook = facebook
		if (linkedin) profileFields.social.linkedin = linkedin
		if (instagram) profileFields.social.instagram = instagram

		try {
			const user = req.user.id
			let profile = await Profile.findOne({ user })

			// Update profile if already exists
			if (profile) {
				await Profile.findOneAndUpdate(
					{ user: user },
					{ $set: profileFields },
					{ new: true }
				)
				return res.json({ profile })
			}

			// Create profile if it doesn't exist already
			profile = new Profile(profileFields)
			await profile.save()
			res.json(profile)
		} catch (err) {
			catchError(err, res)
		}
	}
)

// @route   POST api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', ['name', 'avatar'])
		res.json(profiles)
	} catch (err) {
		catchError(err, res)
	}
})

// @route   POST api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public
router.get('/user/:user_id', async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id,
		}).populate('user', ['name', 'avatar'])

		if (!profile) return res.status(400).json({ msg: 'Profile not found' })

		res.json(profile)
	} catch (err) {
		catchError(err, res)
	}
})

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
	try {
		const user = req.user.id
		// TODO: remove user's posts
		// Remove profile
		await Profile.findOneAndRemove({ user: user })
		// Remove user
		await User.findOneAndRemove({ _id: user })

		res.json({ msg: 'User removed' })
	} catch (err) {
		catchError(err, res)
	}
})

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
	'/experience',
	[
		auth,
		[
			check('title', 'Title is required').not().isEmpty(),
			check('company', 'Company is required').not().isEmpty(),
			check('from', 'From date is required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() })

		const {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		} = req.body

		const newExp = {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		}

		try {
			const profile = await Profile.findOne({ user: req.user.id })

			profile.experience.unshift(newExp)

			await profile.save()

			res.json(profile)
		} catch (err) {
			catchError(err, res)
		}
	}
)

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id })

		// Get remove index
		const removeIndex = profile.experience
			.map(item => item.id)
			.indexOf(req.params.exp_id)

		profile.experience.splice(removeIndex, 1)
		await profile.save()
		res.json(profile)
	} catch (err) {
		catchError(err, res)
	}
})

module.exports = router

function catchError(err, res) {
	console.error(err)
	if (err.kind == 'ObjectId') return res.status(400).send('Profile not found')
	res.status(500).send('Server error')
}
