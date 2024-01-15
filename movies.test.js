const request = require("supertest");
const app = require('./app');
const crypto = require('crypto');

describe("GET /api/movies", () => {
    it("should return all movies", async () => {
        const response = await request(app).get("/api/movies");
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
    });
});

describe("GET /api/movies/:id", () => {
    it("should return a specific movie by ID with status 200 and JSON format", async () => {
        // requête pour obtenir les détails du film avec l'ID 1
        const responseSingleMovie = await request(app).get("/api/movies/1");
        expect(responseSingleMovie.headers["content-type"]).toMatch(/json/);
        expect(responseSingleMovie.status).toEqual(200);
    });

    it("should return status 404 for non-existent movie with ID 0", async () => {
        // requête pour obtenir les détails d'un film avec un ID qui n'existe pas
        const responseNonExistentMovie = await request(app).get("/api/movies/0");
        expect(responseNonExistentMovie.status).toEqual(404);
    });
});

describe("POST /api/movies", () => {
    it("should return created movie", async () => {
        // Création du nouveau film
        const newMovie = {
            title: "Star Wars",
            director: "George Lucas",
            year: "1977",
            color: "1",
            duration: 120,
        };

        // Test
        const response = await request(app).post("/api/movies").send(newMovie);

        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toEqual(201);

        // Vérifie l'existence et le type de toutes les propriétés attendues
        expect(response.body).toHaveProperty("id");
        expect(typeof response.body.id).toBe("number");

        expect(response.body).toHaveProperty("title");
        expect(typeof response.body.title).toBe("string");

        expect(response.body).toHaveProperty("director");
        expect(typeof response.body.director).toBe("string");

        expect(response.body).toHaveProperty("year");
        expect(typeof response.body.year).toBe("string");

        expect(response.body).toHaveProperty("color");
        expect(typeof response.body.color).toBe("string");

        expect(response.body).toHaveProperty("duration");
        expect(typeof response.body.duration).toBe("number");

        // Récupère la nouvelle ressource dans la base de données
        const [result] = await database.query(
            "SELECT * FROM movies WHERE id=?",
            response.body.id
        );

        const [movieInDatabase] = result;

        // Vérifie que la nouvelle ressource dans la base de données correspond aux attentes
        expect(movieInDatabase).toHaveProperty("id", response.body.id);
        expect(movieInDatabase).toHaveProperty("title", response.body.title);
        expect(movieInDatabase).toHaveProperty("director", response.body.director);
        expect(movieInDatabase).toHaveProperty("year", response.body.year);
        expect(movieInDatabase).toHaveProperty("color", response.body.color);
        expect(movieInDatabase).toHaveProperty("duration", response.body.duration);
    });

    // En cas d'erreur
    it("should return an error for incomplete movie data", async () => {
        const movieWithMissingProps = { title: "Harry Potter" };

        const response = await request(app)
            .post("/api/movies")
            .send(movieWithMissingProps);

        expect(response.status).toEqual(500);
    });
});

describe("PUT /api/movies/:id", () => {
    it("should edit movie", async () => {
        // Ajoute le film à la base de données
        const newMovie = {
            title: "Avatar",
            director: "James Cameron",
            year: "2009",
            color: "1",
            duration: 162,
        };

        const [result] = await database.query(
            "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
            [newMovie.title, newMovie.director, newMovie.year, newMovie.color, newMovie.duration]
        );

        const id = result.insertId;

        // Mettez à jour le film
        const updatedMovie = {
            title: "Wild is Life",
            director: "Alan Smithee",
            year: "2023",
            color: "0",
            duration: 120,
        };

        const response = await request(app)
            .put(`/api/movies/${id}`)
            .send(updatedMovie);

        expect(response.status).toEqual(204);

        // Vérifiez que le film a été correctement mis à jour dans la base de données
        const [movies] = await database.query("SELECT * FROM movies WHERE id=?", id);

        const [movieInDatabase] = movies;

        expect(movieInDatabase).toHaveProperty("id", id);
        expect(movieInDatabase).toHaveProperty("title", updatedMovie.title);
        expect(movieInDatabase).toHaveProperty("director", updatedMovie.director);
        expect(movieInDatabase).toHaveProperty("year", updatedMovie.year);
        expect(movieInDatabase).toHaveProperty("color", updatedMovie.color);
        expect(movieInDatabase).toHaveProperty("duration", updatedMovie.duration);
    });

    it("should return an error for incomplete movie data", async () => {
        const movieWithMissingProps = { title: "Harry Potter" };

        const response = await request(app)
            .put(`/api/movies/1`)
            .send(movieWithMissingProps);

        expect(response.status).toEqual(500);
    });

    it("should return 404 for non-existing movie", async () => {
        const newMovie = {
            title: "Avatar",
            director: "James Cameron",
            year: "2009",
            color: "1",
            duration: 162,
        };

        const response = await request(app).put("/api/movies/0").send(newMovie);

        expect(response.status).toEqual(404);
    });
});

describe("DELETE /api/movies/:id", () => {
    it("should delete a movie and return status 204", async () => {
        // Ajoute un film à la base de données pour le supprimer ensuite
        const newMovie = {
            title: "Inception",
            director: "Christopher Nolan",
            year: "2010",
            color: "1",
            duration: 148,
        };

        const [result] = await database.query(
            "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
            [newMovie.title, newMovie.director, newMovie.year, newMovie.color, newMovie.duration]
        );

        const id = result.insertId;

        // Supprime le film ajouté
        const response = await request(app).delete(`/api/movies/${id}`);

        expect(response.status).toEqual(204);

        // Vérifie que le film a été correctement supprimé de la base de données
        const [movies] = await database.query("SELECT * FROM movies WHERE id=?", id);

        expect(movies).toHaveLength(0);
    });

    it("should return 404 for non-existing movie", async () => {
        // Tente de supprimer un film avec un ID qui n'existe pas
        const response = await request(app).delete("/api/movies/0");

        expect(response.status).toEqual(404);
    });
});
