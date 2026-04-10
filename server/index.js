const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://aryanparashaar:machine123@cluster0.eb8qjmy.mongodb.net/"
    
  )
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Routes
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    "Server started on port " + PORT
  );
});