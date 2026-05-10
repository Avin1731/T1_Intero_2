const getHealthStatus = () => {
  return {
    status: 'UP',
    timestamp: new Date()
  };
};

module.exports = {
  getHealthStatus
};
