import {
	AUTH_ERROR,
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	LOGOUT,
	ACCOUNT_DELETED,
} from '../actions/types'

const initialState = {
	token: localStorage.getItem('token'),
	isAuthN: null,
	loading: true,
	user: null,
}

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case LOGIN_SUCCESS:
		case REGISTER_SUCCESS:
			localStorage.setItem('token', payload.token)
			return {
				...state,
				...payload,
				isAuthN: true,
				loading: false,
			}
		case ACCOUNT_DELETED:
		case AUTH_ERROR:
		case LOGIN_FAIL:
		case LOGOUT:
		case REGISTER_FAIL:
			localStorage.removeItem('token')
			return {
				...state,
				token: null,
				isAuthN: false,
				loading: false,
				user: null,
			}

		case USER_LOADED:
			return { ...state, isAuthN: true, loading: false, user: payload }
		default:
			return state
	}
}
