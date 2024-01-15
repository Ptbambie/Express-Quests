const app = require('./app');
const port = process.env.APP_PORT ?? 5001;

app.listen(port, (err) => {
    if (err) {
      console.error("Something bad happened");
    } else {
      console.log(`Server is listening on ${port}`);
    }
  });

  module.exports = index;