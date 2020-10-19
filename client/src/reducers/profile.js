import {
	CLEAR_PROFILE,
	GET_PROFILE,
	PROFILE_ERROR,
	UPDATE_PROFILE,
} from '../actions/types'

const initialState = {
	profile: null,
	profiles: [],
	repos: [],
	loading: true,
	error: {},
}

export default (state = initialState, { type, payload }) => {
	switch (type) {
		case GET_PROFILE:
		case UPDATE_PROFILE:
			return { ...state, profile: payload, loading: false, error: {} }
		case CLEAR_PROFILE:
			return { ...state, profile: null, repos: null, loading: false, error: {} }
		case UPDATE_PROFILE:
		case PROFILE_ERROR:
			return {
				...state,
				error: payload,
				loading: false,
			}
		default:
			return state
	}
}
