require('dotenv').config()
const app = require('./config/express')();
const port = app.get('port');
const mongo = require('./database/mongo');

const listenServer = () => {
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`)
    });
}

mongo.connect()
  .then(listenServer)
  .catch(console.error)
  .finally(mongo.disconnect);