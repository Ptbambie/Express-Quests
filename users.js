const database = require("./database");

const users =[
    {
        firstName:'John',
        lastName:'Doe',
        mail:'john.doe@example.com',
        city:'Paris',
        language:'English'
    },
      {
        firstName:'Valeriy',
        lastName:'Appius',
        mail:'valeriy.appius@example.com',
        city:'Moscow',
        language:'Russian'
    },
      {
        firstName: 'Ralf',
        lastName:'Geronimo',
        mail:'ralf.geronimo@example.com',
        city:'New York',
        language:'Italian'
    },
      {
        firstName:'Maria',
        lastName:'Iskandar',
        mail:'maria.iskandar@example.com',
        city:'New York',
        language:'German'
    },
      {
        firstName:'Jane',
        lastName:'Doe',
        mail:'jane.doe@example.com',
        city:'London',
        language:'English'
    },
      {
        firstName:'Johanna',
        lastName:'Martino',
        mail:'johanna.martino@example.com',
        city:'Milan',
        language:'Spanish'
    }    
];

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
      .then(([users]) => {
        res.json(users); //a verifier!!!
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data FROM database");
      });
  };

  const getUsersId = (req, res) => {
    const id = parseInt(req.params.id);
  
    database
      .query("SELECt * FROM users WHERE id = ?", [id])
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

const postUsers = (req, res) => {
    const { title, director, year, color, duration } = req.body;
  
  
  database
    .query(
        "NSERT INTO users (title, director, year, color)  ?",
        [title, director, year, color, duration]
    )
    .then(([result]) => {
      const id = result.insertId;
      res.status(201).json(id,title, director, year, color)
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error creating");
      }
    );
};

const updateUsers = (req,res)=>{
  const id = parseInt(req.params.id);
  const {title, director, year, color, duration} = req.body;

 
  database
    .query(
        "UPDATE user SET title = ?, director = ?, year = ?, color = ?, duration= ? where id = ?",
        [title, director, year, color, duration, id]
    )
    .then(([result]) => {
        if (result.affectedRows === 0) {
          res.status(404).send("Not Found");
        } else {
          res.sendStatus(204);
        }
      }
    )
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error editing the user");
      }
    );
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
    postUsers,
    updateUsers,
    deleteUsers,
  };
  