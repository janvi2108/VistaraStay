class ExpressError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent Error constructor with the message
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;
