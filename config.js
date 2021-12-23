module.exports = {
  jwtSecret: process.env.JWT_SECRET || '36d5370e-35f3-4652-a2d9-7f96b7c43886',
  mongoUri:
    process.env.MONGO_URI ||
    process.env.MONGO_HOST ||
    `mongodb://${process.env.IP || 'localhost'}:${
      process.env.MONGO_PORT || '27017'
    }/lemon-mart`,
};
