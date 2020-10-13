function catchError(err, res, type) {
	console.error(err)
	if (err.kind == 'ObjectId')
		return res.status(400).send({ msg: `${type} not found` })
	res.status(500).send('Server error')
}
exports.catchError = catchError
