export default {
  routes: [
    {
      // Path defined with a URL parameter
      method: 'GET',
      path: '/participant/one/:num',
      handler: 'participant.findOneByCategory',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      // Path defined with a regular expression
      method: 'GET',
      path: '/participant/:region(\\d{2}|\\d{3})/:id', // Only match when the first parameter contains 2 or 3 digits.
      handler: 'participant.findOneByRegion',
    },
  ],
};
