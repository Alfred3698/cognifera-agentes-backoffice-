export default () => ({
  service: {
    port: process.env.RENT_PROPERTY_SERVICE_PORT,
    node_env: process.env.NODE_ENV,
  },
});
