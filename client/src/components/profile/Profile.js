import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import PropTypes from 'prop-types'

import { getProfileById } from '../../actions/profile'

const Profile = ({
	match,
	getProfileById,
	profile: { profile, loading },
	auth,
}) => {
	useEffect(() => {
		getProfileById(match.params.id) // get from url
	}, [getProfileById])
	return (
		<>
			{profile === null || loading ? (
				<Spinner />
			) : (
				<>
					<Link className='btn btn-light'>Back to Profiles</Link>
					{auth.isAuthN &&
						auth.loading === false &&
						auth.user._id === profile.user._id && (
							<Link to='/edit-profile' class='btn btn-dark'>
								Edit Profile
							</Link>
						)}
				</>
			)}
		</>
	)
}

Profile.propTypes = {
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	getProfileById: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
	auth: state.auth,
	profile: state.profile,
})

export default connect(mapStateToProps, { getProfileById })(Profile)
