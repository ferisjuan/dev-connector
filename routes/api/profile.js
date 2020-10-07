const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
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
		console.error(err.message)
		res.status(500).send('Server error')
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
		if (website) profileFields.company = website
		if (location) profileFields.company = location
		if (bio) profileFields.company = bio
		if (status) profileFields.status = status
		if (githubUsername) profileFields.company = githubUsername
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
			console.error(err.message)
			res.status(500).send('Server error')
		}
	}
)

module.exports = router
