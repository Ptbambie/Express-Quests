const database = require("./database");


const getUsers = (req, res) => {
  let sql ='SELECT * FROM users';
  const sqlValues = [];

  if (req.query.language != null){
    sql += 'WHERE language = ?'
    sqlValues.push(req.query.language);
  }
  if (req.query.city != null) {
    if (sqlValues.length === 0) {
      sql += ' WHERE city = ?';
    } else {
      sql += ' AND city = ?';
    }
    sqlValues.push(req.query.city);
  }

    database
      .query(sql, sqlValues)
      .then(([users]) => {res.json({ users });
       })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data FROM database");
      });
  };

  const getUsersId = (req, res) => {
    const id = parseInt(req.params.id);
  
    database
      .query("SELECT * FROM users WHERE id = ?", [id])
      .then(([users]) => {
        if (users[0] != null) {
          res.json(users[0]);
        } else {
          res.status(404).send("Not Found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data FROM database");
      });
  };

  const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
    const email = req.body.email;
  
    database
      .query("SELECT * FROM users WHERE email = ?", [email])
      .then(([users]) => {
        if (users[0] != null) {
          req.user = users[0];
          next();
        } else {
          res.status(404).send("User not found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving user data from database");
      });
  };
  
  // Commentaire explicatif
  // Cette fonction est un middleware utilisé pour récupérer un utilisateur à partir de son adresse e-mail.
  // Elle vérifie si un utilisateur correspondant à l'adresse e-mail fournie existe dans la base de données.
  // Si l'utilisateur est trouvé, il est ajouté à l'objet de requête (req.user) et la fonction next() est appelée pour passer au middleware suivant.
  // Sinon, une réponse avec le statut 404 est renvoyée pour indiquer que l'utilisateur n'a pas été trouvé.
  // En cas d'erreur lors de la récupération des données utilisateur depuis la base de données, une réponse avec le statut 500 est renvoyée.
  

  const postUsers = (req, res) => {
    const { firstName, lastName, mail, city, language, password } = req.body;
  
    argon2
      .hash(password)
      .then((hashedPassword) => {
        database
          .query("INSERT INTO users (firstName, lastName, mail, city, language, hashedPassword  ) VALUES (?, ?, ?)", [
            firstName,
            lastName,
            mail,
            city,
            language,
            hashedPassword ,
          ])
          .then(([result]) => {
            const id = result.insertId;
            res.status(201).json({ id, firstName, mail});
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send("Error creating user");
          });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error hashing password");
      });
  };
  
const updateUsers = (req,res)=>{
  const id = parseInt(req.params.id);
  const {firstName,lastName,mail,city,language, password } = req.body;

  argon2
  .hash(password)
  .then((hashedPassword) => {
  database
    .query(
      "UPDATE users SET firstName = ?, lastName = ?, mail = ?, city = ?, language = ? WHERE id = ?",
        [  firstName,
          lastName,
          mail,
          city,
          language,
          hashedPassword,
          id,
        ]
    )
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error updating user");
    });
})
.catch((err) => {
  console.error(err);
  res.status(500).send("Error hashing password");
});
};

const deleteUsers = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("DELETE FROM users where id = ?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error deleting the user");
    });
};

  module.exports = {
    getUsers,
    getUsersId,
    getUserByEmailWithPasswordAndPassToNext,
    postUsers,
    updateUsers,
    deleteUsers,
  };
  