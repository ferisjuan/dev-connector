function catchError(err, res) {
	console.error(err)
	if (err.kind == 'ObjectId') return res.status(400).send('Profile not found')
	res.status(500).send('Server error')
}
exports.catchError = catchError
