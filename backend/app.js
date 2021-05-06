const path = require("path");
const express = require("express");
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");
const authRoutes = require("./routes/auth");

const app = express();

mongoose.connect('mongodb+srv://thato:12345@cluster0.iohao.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(() => {
    console.log('connected to DB!');
  })
  .catch((err)=> {
    console.log("Connection failed");
  })



app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use("/images", express.static(path.join("backend/images")));

//solution to cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/users", authRoutes);

module.exports = app;
