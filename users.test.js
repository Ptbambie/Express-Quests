const request = require("supertest");
const app = require('./app');


describe("GET /api/users", () => {
    it("should return all users", async () => {
      const response = await request(app).get("/api/users");
      //console.log(response);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);

    console.log(response.body);
    });
  });


  describe("GET /api/users/:id", () => {
    it("should return a specific users by ID with status 200 and JSON format", async () => {
      // requête pour obtenir les détails du film avec l'ID 1
      const responseSingleUser = await request(app).get("/api/users/1");
      console.log(responseSingleUser.body);

      expect(responseSingleUser.headers["content-type"]).toMatch(/json/);
      expect(responseSingleUser.status).toEqual(200);
    });
  
    it("should return status 404 for non-existent users with ID 0", async () => {
      // requête pour obtenir les détails d'un film avec un ID qui n'existe pas
      console.log(responseNonExistentUser.body);
  
      expect(responseNonExistentUser.status).toEqual(404);
    });
  });
  
  describe("POST /api/users", () => {
    it("should return created users", async () => {
      // Création du nouveau user
      const newUser = {
        firstname:"Alice",
        lastname:"Fleur",
        email: "${crypto.randomUUID()}@wild.co",
        city: "Paris",
        language: "English"
      };
      
      // Test
      const response = await request(app).post("/api/users").send(newUser);
  
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.status).toEqual(201);
      
      // Vérifie l'existence et le type de toutes les propriétés attendues
      expect(response.body).toHaveProperty("firstname");
      expect(typeof response.body.id).toBe("string");
  
      expect(response.body).toHaveProperty("lastname");
      expect(typeof response.body.title).toBe("string");
  
      expect(response.body).toHaveProperty("email");
      expect(typeof response.body.director).toBe("string");
  
      expect(response.body).toHaveProperty("city");
      expect(typeof response.body.year).toBe("string");
  
      expect(response.body).toHaveProperty("language");
      expect(typeof response.body.color).toBe("string");
  
      // Récupère la nouvelle ressource dans la base de données
      const [result] = await database.query(
        "SELECT * FROM users WHERE id=?",
        response.body.id
      );
      
      const [userInDatabase] = result;
  
      // Vérifie que la nouvelle ressource dans la base de données correspond aux attentes
      expect(userInDatabase).toHaveProperty("firstname");
      expect(userInDatabase.id).toEqual(response.body.id);
  
      expect(userInDatabase).toHaveProperty("lastname");
      expect(userInDatabase.title).toEqual(response.body.title);
  
      expect(userInDatabase).toHaveProperty("email");
      expect(userInDatabase.director).toEqual(response.body.director);
  
      expect(userInDatabase).toHaveProperty("city");
      expect(userInDatabase.year).toEqual(response.body.year);
  
      expect(userInDatabase).toHaveProperty("language");
      expect(userInDatabase.color).toEqual(response.body.color);
    });
  
    // En cas d'erreur
    it("should return an error for incomplete user data", async () => {
      const userWithMissingProps = { title: "Inconnu" };
  
      const response = await request(app)
        .post("/api/users")
        .send(userWithMissingProps);
  
      expect(response.status).toEqual(500);
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should edit user", async () => {
      // Ajoutez l'utilisateur à la base de données
      const newUser = {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        city: "New York",
        language: "English"
      };
  
      const [result] = await database.query(
        "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
        [newUser.firstname, newUser.lastname, newUser.email, newUser.city, newUser.language]
      );
  
      const id = result.insertId;
  
      // Met à jour l'utilisateur
      const updatedUser = {
        firstname: "Jane",
        lastname: "Doe",
        email: "jane.doe@example.com",
        city: "Los Angeles",
        language: "Spanish"
      };
  
      const response = await request(app)
        .put(`/api/users/${id}`)
        .send(updatedUser);
  
      expect(response.status).toEqual(204);
  
      // Vérifie que l'utilisateur a été correctement mis à jour dans la base de données
      const [users] = await database.query("SELECT * FROM users WHERE id=?", id);
  
      const [userInDatabase] = users;
  
      expect(userInDatabase).toHaveProperty("id");
      expect(userInDatabase).toHaveProperty("firstname", updatedUser.firstname);
      expect(userInDatabase).toHaveProperty("lastname", updatedUser.lastname);
      expect(userInDatabase).toHaveProperty("email", updatedUser.email);
      expect(userInDatabase).toHaveProperty("city", updatedUser.city);
      expect(userInDatabase).toHaveProperty("language", updatedUser.language);
    });
  
    it("should return an error for incomplete user data", async () => {
      const userWithMissingProps = { firstname: "Incomplete" };
  
      const response = await request(app)
        .put(`/api/users/1`)
        .send(userWithMissingProps);
  
      expect(response.status).toEqual(500);
    });
  
    it("should return 404 for non-existing user", async () => {
      const newUser = {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        city: "New York",
        language: "English"
      };
  
      const response = await request(app).put("/api/users/0").send(newUser);
  
      expect(response.status).toEqual(404);
    });
  });
  