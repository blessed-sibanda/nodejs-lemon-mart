module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'LemonMart',
    description: 'LemonMart API',
    version: '1.0.0',
    contact: {
      name: 'Blessed Sibanda',
      email: 'blessedsibanda.me@gmail.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
};
