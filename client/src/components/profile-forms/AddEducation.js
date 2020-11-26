import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import { addEducation } from '../../actions/profile'

const AddExperience = ({ addEducation, history }) => {
	const [formData, setFormData] = useState({
		school: '',
		degree: '',
		fieldOfStudy: '',
		from: '',
		to: '',
		current: false,
		description: '',
	})

	const {
		school,
		degree,
		fieldOfStudy,
		from,
		to,
		current,
		description,
	} = formData

	const [isToDateDissabled, setToggleToDateDissabled] = useState(false)

	const handleChange = e =>
		setFormData({ ...formData, [e.target.name]: e.target.value })

	const handleSubmit = e => {
		e.preventDefault()
		console.log(formData)
		addEducation(formData, history)
	}

	return (
		<>
			<h1 className='large text-primary'>Add An Experience</h1>
			<p className='lead'>
				<i className='fas fa-code-branch'></i> Add any school/bootcamp that you
				have attended
			</p>
			<small>* = required field</small>
			<form className='form' onSubmit={e => handleSubmit(e)}>
				<div className='form-group'>
					<input
						type='text'
						placeholder='* Program degree'
						name='degree'
						required
						value={degree}
						onChange={e => handleChange(e)}
					/>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='* school'
						name='school'
						required
						value={school}
						onChange={e => handleChange(e)}
					/>
				</div>
				<div className='form-group'>
					<input
						type='text'
						placeholder='fieldOfStudy'
						name='fieldOfStudy'
						value={fieldOfStudy}
						onChange={e => handleChange(e)}
					/>
				</div>
				<div className='form-group'>
					<h4>From Date</h4>
					<input
						type='date'
						name='from'
						value={from}
						onChange={e => handleChange(e)}
					/>
				</div>
				<div className='form-group'>
					<p>
						<input
							type='checkbox'
							name='current'
							value={current}
							checked={current}
							onChange={e => {
								setFormData({ ...formData, current: !current })
								setToggleToDateDissabled(!isToDateDissabled)
							}}
						/>
						Current Study
					</p>
				</div>
				{!current && (
					<div className='form-group'>
						<h4>To Date</h4>
						<input
							type='date'
							name='to'
							value={to}
							onChange={e => handleChange(e)}
						/>
					</div>
				)}
				<div className='form-group'>
					<textarea
						name='description'
						cols='30'
						rows='5'
						placeholder='Program Description'
						value={description}
						onChange={e => handleChange(e)}
					></textarea>
				</div>
				<input type='submit' className='btn btn-primary my-1' />
				<Link className='btn btn-light my-1' to='dashboard'>
					Go Back
				</Link>
			</form>
		</>
	)
}

AddExperience.propTypes = {
	addEducation: PropTypes.func.isRequired,
}

export default connect(null, { addEducation })(withRouter(AddExperience))
