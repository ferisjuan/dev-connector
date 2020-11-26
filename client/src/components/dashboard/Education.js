import React from 'react'
import Moment from 'react-moment'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { deleteEducation } from '../../actions/profile'

const Education = ({ education, deleteEducation }) => {
	const studies = education.map(edu => (
		<>
			<tr key={edu.id}>
				<td>{edu.school}</td>
				<td className='hide-sm'>{edu.degree}</td>
				<td>
					<Moment format='YYYY/MM/DD'>{edu.from}</Moment> -{' '}
					{edu.to === null ? (
						'Now'
					) : (
						<Moment format='YYYY/MM/DD'>{edu.to}</Moment>
					)}
				</td>
				<td>
					<button
						className='btn btn-danger'
						onClick={() => deleteEducation(edu.id)}
					>
						Delete
					</button>
				</td>
			</tr>
		</>
	))
	return (
		<>
			<h2 className='my-2'>Education Credentials</h2>
			<table className='table'>
				<thead>
					<tr>
						<th>School</th>
						<th className='hide-sm'>Degree</th>
						<th className='hide-sm'>Years</th>
						<th />
					</tr>
				</thead>
				<tbody>{studies}</tbody>
			</table>
		</>
	)
}

Education.propTypes = {
	experience: PropTypes.array.isRequired,
}

export default connect(null, { deleteEducation })(Education)
