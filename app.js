const express = require("express");
const app = express();
const { body } = require("express-validator");
const dotenv = require("dotenv");

dotenv.config();
app.use(express.json());

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

const port = process.env.APP_PORT || 5000;

const { validationResult } = require('express-validator');
const { validateMovie } = require("./validator");
const movieHandlers = require("./movieHandlers");
const users = require("./users");
const { validateUser } = require("./validateUser");
const { hashPassword, verifyPassword, verifyToken } = require("./auth.js");

app.get("/", welcome);
app.put("/api/users/:id", hashPassword, users.updateUsers);

// Route GET /api/movies pour renvoyer tous les films

// Route publique - accessible à tous
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

// Route privée - nécessite un jeton d'authentification
app.post("/api/movies", validateMovie, verifyToken, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, verifyToken, movieHandlers.updateMovie);
app.delete("/api/movies/:id", verifyToken, movieHandlers.deleteMovie);

// Route GET /api/users pour renvoyer tous les utilisateurs

// Route publique - accessible à tous
app.get("/api/users", users.getUsers);
app.get("/api/users/:id", users.getUsersId);

// Route privée - nécessite un jeton d'authentification
app.post('/api/users', validateUser, verifyToken, users.postUsers);
app.put("/api/users/:id", validateUser, verifyToken, users.updateUsers);
app.delete("/api/users/:id", verifyToken, users.deleteUsers);

// Route publique - accessible à tous
app.post("/api/login", isItDwight);

// Route privée - nécessite un jeton d'authentification et utilise deux middlewares
app.post("/api/login", users.getUserByEmailWithPasswordAndPassToNext, verifyPassword);

// Middleware global pour vérifier le jeton d'authentification sur toutes les routes POST, PUT et DELETE
app.use(verifyToken);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});

//...

const isItDwight = (req, res) => {
  if (req.body.email === "dwight@theoffice.com" && req.body.password === "123456") {
    res.send("Credentials are valid");
  } else {
    res.sendStatus(401);
  }
};
