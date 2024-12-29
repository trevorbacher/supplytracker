// Error handling middleware function
const errorHandler = (err, req, res, next) => {
    // Determine the status code to use for the response
    const statusCode = res.statusCode ? res.statusCode : 500; // Default to 500 if no status code is set
    res.status(statusCode); // Set the response status code

    // Send JSON response with error details
    res.json({
        message: err.message, // Error message
        stack: process.env.NODE_ENV === 'development' ? err.stack : null // Include stack trace in development mode
    });
};

module.exports = errorHandler;