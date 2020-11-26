import {
	CLEAR_PROFILE,
	GET_PROFILE,
	GET_PROFILES,
	GET_REPOS,
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
		case GET_PROFILES:
			return { ...state, profiles: payload, loading: false }
		case GET_REPOS:
			return { ...state, repos: payload, loading: false }
		case CLEAR_PROFILE:
			return { ...state, profile: null, repos: null, loading: false, error: {} }
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
