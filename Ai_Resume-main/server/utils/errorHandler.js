/**
 * Global error handling middleware for Express
 * 
 * @param {Error} err - The error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Default error status and message
    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
      // Mongoose validation error
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(err.errors).map(val => val.message)
      });
    }
    
    if (err.name === 'CastError') {
      // Mongoose cast error (e.g., invalid ObjectId)
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format',
        error: err.message
      });
    }
    
    if (err.code === 11000) {
      // Mongoose duplicate key error
      return res.status(400).json({
        success: false,
        message: 'Duplicate field value entered',
        error: err.message
      });
    }
    
    // Send error response
    res.status(status).json({
      success: false,
      message,
      error: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  };
  
  module.exports = {
    errorHandler
  };