import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { logout } from '../../actions/auth'

const Navbar = ({ auth: { isAuthN, loading }, logout }) => {
	const authLinks = (
		<ul>
			<li>
				<Link to='/profiles'>Developers</Link>
			</li>
			<li>
				<Link to='/dashboard'>
					<i className='fas fa-user'></i>
					<span className='hide-sm'>Dashboard</span>
				</Link>
			</li>
			<li>
				<a onClick={logout} to='#!'>
					<i className='fas fa-sign-out-alt'></i>
					<span className='hide-sm'>Logout</span>
				</a>
			</li>
		</ul>
	)

	const guestLinks = (
		<ul>
			<li>
				<Link to='/profiles'>Developers</Link>
			</li>
			<li>
				<Link to='/register'>Register</Link>
			</li>
			<li>
				<Link to='/login'>Login</Link>
			</li>
		</ul>
	)

	return (
		<nav className='navbar bg-dark'>
			<h1>
				<Link to='/'>
					<i className='fas fa-code'></i> DevConnector
				</Link>
			</h1>
			{!loading && <>{isAuthN ? authLinks : guestLinks}</>}
		</nav>
	)
}

Navbar.propTypes = {
	auth: PropTypes.object.isRequired,
	logout: PropTypes.func.isRequired,
}

const mapPropsToState = state => ({
	auth: state.auth,
})

export default connect(mapPropsToState, { logout })(Navbar)
