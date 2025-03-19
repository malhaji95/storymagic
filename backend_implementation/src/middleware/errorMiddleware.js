// Error handling middleware
const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Default error status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong on the server';
  
  // Send error response
  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
};

module.exports = errorMiddleware;
