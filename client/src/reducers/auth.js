import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types'

const initialState = {
	token: localStorage.getItem('token'),
	isAuthN: null,
	loading: true,
	user: null,
}

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case REGISTER_SUCCESS:
			localStorage.setItem('token', payload.token)
			return {
				...state,
				...payload,
				isAuthN: true,
				loading: false,
			}
		case REGISTER_FAIL:
			localStorage.removeItem('token')
			return { ...state, token: null, isAuthN: false, loading: false }

		default:
			return state
	}
}
