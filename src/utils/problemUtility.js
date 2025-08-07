const axios = require("axios");

const waiting = async (timer) => {
  setTimeout(() => {
    return 1;
  }, timer);
};

const getLanguageById = (lang) => {
  const language = {
    cpp: 54,
    java: 62,
    javascript: 63,
  };

  return language[lang.toLowerCase()];
};

const submitBatch = async (submissions) => {
  console.log(process.env.JUDGE0_KEY);
  const options = {
    method: "POST",
    url: process.env.JUDGE0_URL,
    params: {
      base64_encoded: "false",
    },
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      submissions,
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  return await fetchData();
};

const submitToken = async (resultToken) => {
  const options = {
    method: "GET",
    url: process.env.JUDGE0_URL, 
    params: {
      tokens: resultToken.join(","),
      base64_encoded: "false",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": process.env.JUDGE0_KEY,
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  while (true) {
    const result = await fetchData();

    const IsResultObtained = result.submissions.every((r) => r.status_id > 2);

    if (IsResultObtained) return result.submissions;

    await waiting(1000);
  }
};

module.exports = { getLanguageById, submitBatch, submitToken };
