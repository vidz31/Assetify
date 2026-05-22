export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({ success: false, message: 'Validation Error', errors })
  }

  if (err.code === 11000) {
    return res.status(400).json({ success: false, message: 'Email already exists' })
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  })
}
