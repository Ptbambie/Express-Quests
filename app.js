require("dotenv").config();
app.get("/", welcome);
app.use(express.json());

const express = require("express");
const app = express();
const { body } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};
const port = process.env.APP_PORT || 5000;

const { body, validationResult } = require('express-validator');
const {validateMovie} = require("./validator");
const movieHandlers = require("./movieHandlers");
const users = require("./users");
const {validateUser} = require("./validateUser")

// Route GET /api/movies pour renvoyer tous les films
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.post("/api/movies", validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

// Route GET /api/users pour renvoyer tous les utilisateurs
app.get("/api/users", users.getUsers);
app.get("/api/users/:id", users.getUsersId);
app.post('/api/users', validateUser, users.postUsers);
app.put("/api/users/:id", validateUser, users.updateUsers);
app.delete("/api/users/:id", users.deleteUsers);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});