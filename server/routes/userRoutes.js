const express = require("express");
const router = express.Router();

const User = require("../models/User");
const upload = require("./upload");

router.post(
  "/users",
  upload.array("documents"),
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        dob,
        resStreet1,
        resStreet2,
        permStreet1,
        permStreet2,
      } = req.body;

      const documents =
        req.files.map(
          (file, index) => ({
            fileName:
              req.body.fileName[index],
            fileType:
              req.body.fileType[index],
            filePath: file.path,
          })
        );

      const newUser = new User({
        firstName,
        lastName,
        email,
        dob,

        residentialAddress: {
          street1: resStreet1,
          street2: resStreet2,
        },

        permanentAddress: {
          street1: permStreet1,
          street2: permStreet2,
        },

        documents,
      });

      await newUser.save();

      res.json({
        message:
          "User saved successfully",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

module.exports = router;