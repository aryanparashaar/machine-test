const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  fileName: String,
  fileType: String,
  filePath: String,
});

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  dob: Date,

  residentialAddress: {
    street1: String,
    street2: String,
  },

  permanentAddress: {
    street1: String,
    street2: String,
  },

  documents: [documentSchema],
});

module.exports =
  mongoose.model("User", userSchema);