import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

const PrivateRote = ({
	component: Component,
	auth: { isAuthN, loading },
	...rest
}) => (
	<Route
		{...rest}
		render={props =>
			!isAuthN && !loading ? <Redirect to='/login' /> : <Component {...props} />
		}
	/>
)

PrivateRote.propTypes = {
	auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
	auth: state.auth,
})

export default connect(mapStateToProps)(PrivateRote)
