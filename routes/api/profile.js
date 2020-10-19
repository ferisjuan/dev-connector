const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')
const request = require('request')
const config = require('config')
const { catchError } = require('../../helpers/catchError')

const OBJECT_TYPE = 'Profile'

// @r, 'Profile'oute   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate('user', ['name', 'avatar'])

		if (!profile) {
			return res.status(404).json({ msg: 'There is no profile for this user' })
		}

		res.json(profile)
	} catch (err) {
		catchError(err, res, OBJECT_TYPE)
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
			catchError(err, res, OBJECT_TYPE)
		}
	}
)

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', ['name', 'avatar'])
		res.json(profiles)
	} catch (err) {
		catchError(err, res, OBJECT_TYPE)
	}
})

// @route   GET api/profile/user/:user_id
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
		catchError(err, res, OBJECT_TYPE)
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
		catchError(err, res, OBJECT_TYPE)
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
			catchError(err, res, OBJECT_TYPE)
		}
	}
)

// @route   DELETE api/profile/experience/:edu_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:edu_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id })

		// Get remove index
		const removeIndex = profile.experience
			.map(item => item.id)
			.indexOf(req.params.edu_id)

		profile.experience.splice(removeIndex, 1)
		await profile.save()
		res.json(profile)
	} catch (err) {
		catchError(err, res, OBJECT_TYPE)
	}
})

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put(
	'/education',
	[
		auth,
		[
			check('school', 'School is required').not().isEmpty(),
			check('degree', 'Degree is required').not().isEmpty(),
			check('fieldOfStudy', 'Field of study is required').not().isEmpty(),
			check('from', 'From date is required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() })

		const {
			school,
			degree,
			fieldOfStudy,
			from,
			to,
			current,
			description,
		} = req.body

		const newExp = {
			school,
			degree,
			fieldOfStudy,
			from,
			to,
			current,
			description,
		}

		try {
			const profile = await Profile.findOne({ user: req.user.id })
			profile.education.unshift(newExp)
			await profile.save()

			res.json(profile)
		} catch (err) {
			catchError(err, res, OBJECT_TYPE)
		}
	}
)

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id })

		// Get remove index
		const removeIndex = profile.education
			.map(item => item.id)
			.indexOf(req.params.edu_id)

		profile.education.splice(removeIndex, 1)
		await profile.save()
		res.json(profile)
	} catch (err) {
		catchError(err, res, OBJECT_TYPE)
	}
})

// @route   GET api/profile/github/:username
// @desc    Get user repos from github
// @access  Public
router.get('/github/:user_name', async (req, res) => {
	try {
		const options = {
			uri: `https://api.github.com/users/${
				req.params.user_name
			}/repos?per_page=5&sort=created:asc&client_id=${config.get(
				'githubClientId'
			)}&client_secret=${config.get('githubSecret')}`,
			method: 'GET',
			headers: { 'user-agent': 'node.js' },
		}

		request(options, (error, response, body) => {
			if (error) console.error(error)

			if (response.statusCode !== 200) {
				return res.status(404).json({ msg: 'No Github profile found' })
			}

			res.json(JSON.parse(body))
		})
	} catch (err) {
		catchError(err, res, OBJECT_TYPE)
	}
})

module.exports = router
