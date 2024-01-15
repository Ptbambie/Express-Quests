const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Configuration pour une base de données en mémoire (exemple avec MongoDB)
const mongod = new MongoMemoryServer();

module.exports = async () => {
  const uri = await mongod.getUri();

  // Connection à la base de données en mémoire avant le lancement des tests
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};
