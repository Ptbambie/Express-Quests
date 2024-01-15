const request = require("supertest");
const app = require('./app');


describe("GET /api/movies", () => {
    it("should return all movies", async () => {
      const response = await request(app).get("/api/movies");
      //console.log(response);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);

    console.log(response.body);
    });
  });


  describe("GET /api/movies/:id", () => {
    it("should return a specific movie by ID with status 200 and JSON format", async () => {
      // requête pour obtenir les détails du film avec l'ID 1
      const responseSingleMovie = await request(app).get("/api/movies/1");
      console.log(responseSingleMovie.body);

      expect(responseSingleMovie.headers["content-type"]).toMatch(/json/);
      expect(responseSingleMovie.status).toEqual(200);
    });
  
    it("should return status 404 for non-existent movie with ID 0", async () => {
      // requête pour obtenir les détails d'un film avec un ID qui n'existe pas
      const responseNonExistentMovie = await request(app).get("/api/movies/0");
      console.log(responseNonExistentMovie.body);
  
      expect(responseNonExistentMovie.status).toEqual(404);
    });
  });
  
 
