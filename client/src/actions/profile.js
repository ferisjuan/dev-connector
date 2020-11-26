import axios from 'axios'

import {
	ACCOUNT_DELETED,
	CLEAR_PROFILE,
	GET_PROFILE,
	GET_PROFILES,
	GET_REPOS,
	PROFILE_ERROR,
	UPDATE_PROFILE,
} from './types'

import { setAlert } from './alert'
import setAuthToken from '../utils/setAuthToken'
import { errorsIterator } from './actionHelpers'

const dispatchProfileError = (err, dispatch) => {
	dispatch({
		type: PROFILE_ERROR,
		payload: { msg: err.response.statusText, status: err.response.status },
	})
}

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
		dispatchProfileError(err, dispatch)
	}
}

export const getProfiles = () => async dispatch => {
	dispatch({
		type: CLEAR_PROFILE,
	})

	try {
		if (localStorage.token) {
			setAuthToken(localStorage.token)
		}

		const res = await axios.get('/api/profile')
		dispatch({
			type: GET_PROFILES,
			payload: res.data,
		})
	} catch (err) {
		dispatchProfileError(err, dispatch)
	}
}

export const getProfileById = userID => async dispatch => {
	try {
		if (localStorage.token) {
			setAuthToken(localStorage.token)
		}

		const res = await axios.get(`/api/profile/user${userID}`)

		dispatch({
			type: GET_PROFILE,
			payload: res.data,
		})
	} catch (err) {
		dispatchProfileError(err, dispatch)
	}
}

export const getGithubRepos = username => async dispatch => {
	try {
		const res = await axios.get(`/api/profile/github/${username}`)

		dispatch({
			type: GET_REPOS,
			payload: res.data,
		})
	} catch (err) {
		dispatchProfileError(err, dispatch)
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

		dispatch(
			setAlert(isEditing ? 'Profile updated' : 'Profile created', 'success')
		)

		if (!isEditing) {
			history.push('/dashboard')
		}
	} catch (err) {
		errorsIterator(err, dispatch)
		dispatchProfileError(err, dispatch)
	}
}

export const addExperience = (formData, history) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		const res = await axios.put('/api/profile/experience', formData, config)

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		})

		dispatch(setAlert('Experience added', 'success'))

		history.push('/dashboard')
	} catch (err) {
		errorsIterator(err, dispatch)
		dispatchProfileError(err, dispatch)
	}
}

export const addEducation = (formData, history) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		}

		const res = await axios.put('/api/profile/education', formData, config)

		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		})

		dispatch(setAlert('Education added', 'success'))

		history.push('/dashboard')
	} catch (err) {
		errorsIterator(err, dispatch)
		dispatchProfileError(err, dispatch)
	}
}

export const deleteExperience = id => async dispatch => {
	try {
		const res = await axios.delete(`/api/profile/experience/${id}`)
		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		})

		dispatch(setAlert('Experience removed', 'success'))
	} catch (err) {
		errorsIterator(err, dispatch)
		dispatchProfileError(err, dispatch)
	}
}

export const deleteEducation = id => async dispatch => {
	try {
		const res = await axios.delete(`/api/profile/education/${id}`)
		dispatch({
			type: UPDATE_PROFILE,
			payload: res.data,
		})

		dispatch(setAlert('Education removed', 'success'))
	} catch (err) {
		errorsIterator(err, dispatch)
		dispatchProfileError(err, dispatch)
	}
}

export const deleteAccount = () => async dispatch => {
	if (window.confirm('Are you sure? This can NOT be undone!')) {
		try {
			dispatch({
				type: CLEAR_PROFILE,
			})

			dispatch({
				type: ACCOUNT_DELETED,
			})

			dispatch(setAlert('Your account has been permanently deleted'))
		} catch (err) {
			errorsIterator(err, dispatch)
			dispatchProfileError(err, dispatch)
		}
	}
}
