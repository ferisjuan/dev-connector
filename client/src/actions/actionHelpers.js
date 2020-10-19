import { setAlert } from './alert'

export const errorsIterator = (err, dispatch) => {
	const errors = err.response.data.errors

	if (errors) {
		errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
	}
}
