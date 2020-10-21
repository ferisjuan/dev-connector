import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import ProfileItem from './ProfileItem'
import Spinner from '../layout/Spinner'

import { getProfiles } from '../../actions/profile'

const Profiles = ({ profile: { profiles, loading }, getProfiles }) => {
	useEffect(() => {
		getProfiles()
	}, [])

	return (
		<>
			{loading ? (
				<Spinner />
			) : (
				<>
					<h1 className='large text-primary'>Developers</h1>
					<p className='lead'>
						<i className='fab fa-connectdevelop'></i> Browse and connect with
						developers
					</p>
					<div className='profiles'>
						{profiles.length > 0 ? (
							profiles.map(profile => (
								<ProfileItem key={profile.id} profile={profile} />
							))
						) : (
							<h4>No profiles found...</h4>
						)}
					</div>
				</>
			)}
		</>
	)
}

Profiles.propTypes = {
	profiles: PropTypes.array.isRequired,
	getProfiles: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
	profile: state.profile,
})

export default connect(mapStateToProps, { getProfiles })(Profiles)
