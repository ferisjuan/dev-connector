import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { createProfile, getCurrentProfile } from '../../actions/profile'

const EditProfile = ({
	createProfile,
	getCurrentProfile,
	history,
	profile: { profile, loading },
}) => {
	const [formData, setFormData] = useState({
		company: '',
		website: '',
		location: '',
		bio: '',
		status: '',
		githubUsername: '',
		skills: '',
		youtube: '',
		facebook: '',
		twitter: '',
		instagram: '',
		linkedin: '',
	})

	useEffect(() => {
		console.log(formData)
		getCurrentProfile()

		setFormData({
			company: loading || !profile.company ? '' : profile.company,
			website: loading || !profile.website ? '' : profile.website,
			location: loading || !profile.location ? '' : profile.location,
			bio: loading || !profile.bio ? '' : profile.bio,
			status: loading || !profile.status ? '' : profile.status,
			githubUsername:
				loading || !profile.githubUsername ? '' : profile.githubUsername,
			skills: loading || !profile.skills ? '' : profile.skills.join(','),
			youtube: loading || !profile.youtube ? '' : profile.youtube,
			facebook: loading || !profile.facebook ? '' : profile.facebook,
			twitter: loading || !profile.twitter ? '' : profile.twitter,
			instagram: loading || !profile.instagram ? '' : profile.instagram,
			linkedin: loading || !profile.linkedin ? '' : profile.linkedin,
		})
	}, [loading])

	const [displaySocialInputs, setDisplaySocialInputs] = useState(false)

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
	} = formData

	const HandleChange = e =>
		setFormData({ ...formData, [e.target.name]: e.target.value })

	const handleSubmit = e => {
		e.preventDefault()
		createProfile(formData, history, true)
	}

	return (
		<>
			<h1 className='large text-primary'>Create Your Profile</h1>
			<p className='lead'>
				<i className='fas fa-user'></i> Let's get some information to make your
				profile stand out
			</p>
			<small>* = required field</small>
			<form className='form' onSubmit={e => handleSubmit(e)}>
				<div className='form-group'>
					<select name='status' value={status} onChange={e => HandleChange(e)}>
						<option value='0'>* Select Professional Status</option>
						<option value='Developer'>Developer</option>
						<option value='Junior Developer'>Junior Developer</option>
						<option value='Senior Developer'>Senior Developer</option>
						<option value='Manager'>Manager</option>
						<option value='Student or Learning'>Student or Learning</option>
						<option value='Instructor'>Instructor or Teacher</option>
						<option value='Intern'>Intern</option>
						<option value='Other'>Other</option>
					</select>
					<small className='form-text'>
						Give us an idea of where you are at in your career
					</small>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='Company'
						name='company'
						value={company}
						onChange={e => HandleChange(e)}
					/>
					<small className='form-text'>
						Could be your own company or one you work for
					</small>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='Website'
						name='website'
						value={website}
						onChange={e => HandleChange(e)}
					/>
					<small className='form-text'>
						Could be your own or a company website
					</small>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='Location'
						name='location'
						value={location}
						onChange={e => HandleChange(e)}
					/>
					<small className='form-text'>
						City & state suggested (eg. Boston, MA)
					</small>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='* Skills'
						name='skills'
						value={skills}
						onChange={e => HandleChange(e)}
					/>
					<small className='form-text'>
						Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
					</small>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='Github Username'
						name='githubUsername'
						value={githubUsername}
						onChange={e => HandleChange(e)}
					/>
					<small className='form-text'>
						If you want your latest repos and a Github link, include your
						username
					</small>
				</div>
				<div className='form-group'>
					<textarea
						placeholder='A short bio of yourself'
						name='bio'
						value={bio}
						onChange={e => HandleChange(e)}
					></textarea>
					<small className='form-text'>Tell us a little about yourself</small>
				</div>

				<div className='my-2'>
					<button
						onClick={() => setDisplaySocialInputs(!displaySocialInputs)}
						type='button'
						className='btn btn-light'
					>
						Add Social Network Links
					</button>
					<span>Optional</span>
				</div>

				{displaySocialInputs && (
					<>
						<div className='form-group social-input'>
							<i className='fab fa-twitter fa-2x'></i>
							<input
								type='text'
								placeholder='Twitter URL'
								name='twitter'
								value={twitter}
								onChange={e => HandleChange(e)}
							/>
						</div>

						<div className='form-group social-input'>
							<i className='fab fa-facebook fa-2x'></i>
							<input
								type='text'
								placeholder='Facebook URL'
								name='facebook'
								value={facebook}
								onChange={e => HandleChange(e)}
							/>
						</div>

						<div className='form-group social-input'>
							<i className='fab fa-youtube fa-2x'></i>
							<input
								type='text'
								placeholder='YouTube URL'
								name='youtube'
								value={youtube}
								onChange={e => HandleChange(e)}
							/>
						</div>

						<div className='form-group social-input'>
							<i className='fab fa-linkedin fa-2x'></i>
							<input
								type='text'
								placeholder='Linkedin URL'
								name='linkedin'
								value={linkedin}
								onChange={e => HandleChange(e)}
							/>
						</div>

						<div className='form-group social-input'>
							<i className='fab fa-instagram fa-2x'></i>
							<input
								type='text'
								placeholder='Instagram URL'
								name='instagram'
								value={instagram}
								onChange={e => HandleChange(e)}
							/>
						</div>
					</>
				)}

				<input type='submit' className='btn btn-primary my-1' />
				<Link className='btn btn-light my-1' to='/dashboard'>
					Go Back
				</Link>
			</form>
		</>
	)
}

EditProfile.propTypes = {
	createProfile: PropTypes.func.isRequired,
	getCurrentProfile: PropTypes.func.isRequired,
	history: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
	profile: state.profile,
})

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
	withRouter(EditProfile)
)
