const axios = require('axios');

const getGenderData = async (name) => {
  const response = await axios.get(
    `https://api.genderize.io?name=${encodeURIComponent(name)}`,
    { timeout: 3000 }
  );
  return response.data;
};

module.exports = { getGenderData };