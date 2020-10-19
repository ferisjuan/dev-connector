import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { getCurrentProfile } from '../../actions/profile'
import { DashboardActions } from './DashboardActions'

import Spinner from '../layout/Spinner'

const Dashboard = ({
	auth: { user },
	profile: { profile, loading },
	getCurrentProfile,
}) => {
	useEffect(() => {
		getCurrentProfile()
	}, [])

	return loading && profile === null ? (
		<Spinner />
	) : (
		<>
			<h1 className='large text-primary'>Dashboard</h1>
			<p className='lead'>
				<i className='fas fa-user'> </i>
				Welcome {user?.name}
			</p>
			{profile !== null ? (
				<DashboardActions />
			) : (
				<>
					<p>You have not yet set up a profile, please add some info</p>
					<Link to='/create-profile' className='btn btn-primary my-1'>
						Create profile
					</Link>
				</>
			)}
		</>
	)
}

Dashboard.propTypes = {
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired,
	getCurrentProfile: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
	auth: state.auth,
	profile: state.profile,
})

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard)
