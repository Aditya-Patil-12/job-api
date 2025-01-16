const mongoose = require("mongoose");

const clientOptions = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

const connectDB = (url) => {
  const connection = mongoose.connect(url, clientOptions); 
  console.log("databse conencted guys ....");
  return connection;
};

module.exports = connectDB;
