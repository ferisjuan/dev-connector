import axios from 'axios'

import { GET_PROFILE, PROFILE_ERROR } from './types'

import { setAlert } from './alert'
import setAuthToken from '../utils/setAuthToken'
import { errorsIterator } from './actionHelpers'

export const getCurrentProfile = () => async dispatch => {
	try {
		if (localStorage.token) {
			setAuthToken(localStorage.token)
		}

		const res = await axios.get('/api/profile/me')

		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		})
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statesText, status: err.response.status },
		})
	}
}

export const createProfile = (
	formData,
	history,
	isEditing = false
) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		const res = await axios.post('/api/profile', formData, config)

		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		})

		dispatch(setAlert(isEditing ? 'Profile updated' : 'Profile created'))

		if (!isEditing) {
			history.push('/dashboard')
		}
	} catch (err) {
		errorsIterator(err, dispatch)

		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status },
		})
	}
}
