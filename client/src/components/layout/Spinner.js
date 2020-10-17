import React from 'react'
import spinner from '../../img/200.gif'

export default function Spinner() {
	return (
		<>
			<img
				src={spinner}
				alt='Loading...'
				style={{ width: 200, margin: 'auto', display: 'block' }}
			/>
		</>
	)
}
